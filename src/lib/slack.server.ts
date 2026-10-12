import { supabaseAdmin } from "@/integrations/supabase/client.server";

const PREFERRED_CHANNEL = "riyastechhub-alerts";
const FALLBACK_CHANNEL = "all-riyastechhub";
const MAX_ATTEMPTS = 3;

export type SlackEvent =
  | "registration"
  | "referral"
  | "project"
  | "feedback"
  | "payment";

const ICONS: Record<SlackEvent, string> = {
  registration: ":tada:",
  referral: ":handshake:",
  project: ":hammer_and_wrench:",
  feedback: ":star:",
  payment: ":credit_card:",
};

function gatewayBase() {
  return (process.env["CONNECTOR_GATEWAY_BASE_URL"] || "https://connector-gateway.lovable.dev") + "/slack/api";
}

async function slackCall(method: string, body: Record<string, unknown>) {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const slackKey = process.env["SLACK_API_KEY"];
  if (!lovableKey || !slackKey) throw new Error("Slack credentials are not configured");
  const res = await fetch(`${gatewayBase()}/${method}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": slackKey,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data: { ok?: boolean; error?: string; [k: string]: unknown } = {};
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`${method} non-JSON [${res.status}]: ${text.slice(0, 200)}`);
  }
  if (!res.ok || !data.ok) throw new Error(`${method} failed [${res.status}]: ${data.error ?? text.slice(0, 200)}`);
  return data;
}

async function resolveChannel(): Promise<string> {
  let cursor = "";
  let fallback: string | null = null;
  do {
    const data = (await slackCall("conversations.list", {
      limit: 200,
      types: "public_channel",
      exclude_archived: true,
      ...(cursor ? { cursor } : {}),
    })) as { channels?: { id: string; name: string }[]; response_metadata?: { next_cursor?: string } };
    for (const c of data.channels ?? []) {
      if (c.name === PREFERRED_CHANNEL) return c.id;
      if (c.name === FALLBACK_CHANNEL) fallback = c.id;
    }
    cursor = data.response_metadata?.next_cursor ?? "";
  } while (cursor);
  if (fallback) return fallback;
  throw new Error(`Slack channel #${PREFERRED_CHANNEL} not found`);
}

export function maskMobile(mobile: string | null | undefined) {
  if (!mobile) return "-";
  return `XXXXXX${mobile.slice(-4)}`;
}

/**
 * Sends one notification per unique eventKey (deduplicated in the database),
 * retrying transient failures. Never throws — Slack problems must not break site actions.
 */
export async function notifySlack(
  type: SlackEvent,
  eventKey: string,
  title: string,
  fields: Record<string, string | number | null | undefined>,
) {
  try {
    const { data: existing } = await supabaseAdmin
      .from("slack_notifications")
      .select("id, status, attempts")
      .eq("event_key", eventKey)
      .maybeSingle();
    if (existing?.status === "sent") return { ok: true, duplicate: true };

    let rowId = existing?.id;
    if (!rowId) {
      const { data: inserted, error } = await supabaseAdmin
        .from("slack_notifications")
        .insert({ event_key: eventKey, event_type: type })
        .select("id")
        .single();
      if (error) {
        // Unique violation = another request is already handling this event.
        if (error.code === "23505") return { ok: true, duplicate: true };
        throw new Error(error.message);
      }
      rowId = inserted.id;
    }

    const lines = Object.entries(fields)
      .filter(([, v]) => v !== null && v !== undefined && v !== "")
      .map(([k, v]) => `*${k}:* ${String(v).slice(0, 300)}`);
    const text = `${ICONS[type]} *${title}*\n${lines.join("\n")}`;

    let lastError = "";
    let attempts = existing?.attempts ?? 0;
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      attempts++;
      try {
        const channel = await resolveChannel();
        await slackCall("chat.postMessage", {
          channel,
          text,
          username: "RiyasTech Hub Alerts",
          icon_emoji: ":zap:",
          unfurl_links: false,
        });
        await supabaseAdmin
          .from("slack_notifications")
          .update({ status: "sent", attempts, sent_at: new Date().toISOString(), last_error: null })
          .eq("id", rowId);
        return { ok: true, duplicate: false };
      } catch (err) {
        lastError = err instanceof Error ? err.message : String(err);
        console.error(`[slack] ${type} attempt ${attempts} failed: ${lastError}`);
        if (i < MAX_ATTEMPTS - 1) await new Promise((r) => setTimeout(r, 400 * 2 ** i));
      }
    }
    await supabaseAdmin
      .from("slack_notifications")
      .update({ status: "failed", attempts, last_error: lastError.slice(0, 500) })
      .eq("id", rowId);
    return { ok: false, error: lastError };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[slack] ${type} notify error: ${msg}`);
    return { ok: false, error: msg };
  }
}
