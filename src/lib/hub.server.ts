import { supabaseAdmin } from "@/integrations/supabase/client.server";

import { maskMobile, notifySlack } from "./slack.server";

export type MemberPublic = {
  id: string;
  username: string;
  mobile: string;
  district: string;
  department: string | null;
  yearOfStudy: string | null;
  referralCode: string;
  credits: number;
};

const OTP_TTL_MS = 5 * 60 * 1000;
const REFERRAL_CREDITS = 50;

function randomCode() {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return String(100000 + (buf[0]! % 900000));
}

function makeReferralCode(username: string) {
  const base = username.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 5) || "RIYAS";
  return `${base}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

type MemberRow = {
  id: string;
  username: string;
  mobile: string;
  district: string;
  department: string | null;
  year_of_study: string | null;
  referral_code: string;
  credits: number;
};

function toPublic(row: MemberRow): MemberPublic {
  return {
    id: row.id,
    username: row.username,
    mobile: row.mobile,
    district: row.district,
    department: row.department,
    yearOfStudy: row.year_of_study,
    referralCode: row.referral_code,
    credits: row.credits,
  };
}

export async function issueOtp(mobile: string) {
  const code = randomCode();
  const { error } = await supabaseAdmin.from("otp_codes").insert({
    mobile,
    code,
    expires_at: new Date(Date.now() + OTP_TTL_MS).toISOString(),
  });
  if (error) throw new Error(error.message);
  // No SMS gateway is connected, so the freshly generated server-side code is
  // handed back to the UI. Verification itself always happens on the server.
  return { sent: true as const, code, expiresInSeconds: OTP_TTL_MS / 1000 };
}

export async function confirmOtp(input: {
  mobile: string;
  code: string;
  username: string;
  district: string;
  referralCode?: string | undefined;
}) {
  const { data: rows, error } = await supabaseAdmin
    .from("otp_codes")
    .select("id, code, expires_at, consumed, attempts")
    .eq("mobile", input.mobile)
    .eq("consumed", false)
    .order("created_at", { ascending: false })
    .limit(1);
  if (error) throw new Error(error.message);
  const otp = rows?.[0];
  if (!otp) return { ok: false as const, reason: "No active code. Please request a new OTP." };
  if (new Date(otp.expires_at).getTime() < Date.now())
    return { ok: false as const, reason: "This code has expired. Request a new one." };
  if (otp.attempts >= 5)
    return { ok: false as const, reason: "Too many attempts. Request a new code." };
  if (otp.code !== input.code) {
    await supabaseAdmin
      .from("otp_codes")
      .update({ attempts: otp.attempts + 1 })
      .eq("id", otp.id);
    return { ok: false as const, reason: "Incorrect OTP." };
  }
  await supabaseAdmin.from("otp_codes").update({ consumed: true }).eq("id", otp.id);

  const { data: existing } = await supabaseAdmin
    .from("members")
    .select("*")
    .eq("mobile", input.mobile)
    .maybeSingle();

  if (existing) {
    const { data: updated, error: updErr } = await supabaseAdmin
      .from("members")
      .update({ username: input.username, district: input.district })
      .eq("id", existing.id)
      .select("*")
      .single();
    if (updErr) throw new Error(updErr.message);
    return { ok: true as const, member: toPublic(updated as MemberRow), isNew: false };
  }

  let referrerId: string | null = null;
  if (input.referralCode) {
    const { data: ref } = await supabaseAdmin
      .from("members")
      .select("id")
      .eq("referral_code", input.referralCode.trim().toUpperCase())
      .maybeSingle();
    referrerId = ref?.id ?? null;
  }

  const { data: created, error: insErr } = await supabaseAdmin
    .from("members")
    .insert({
      username: input.username,
      mobile: input.mobile,
      district: input.district,
      referral_code: makeReferralCode(input.username),
      referred_by: referrerId,
    })
    .select("*")
    .single();
  if (insErr) throw new Error(insErr.message);

  let referrerName: string | null = null;
  if (referrerId) {
    const { data: refRow } = await supabaseAdmin
      .from("referrals")
      .insert({
        referrer_id: referrerId,
        referred_id: created.id,
        credits_awarded: REFERRAL_CREDITS,
      })
      .select("id")
      .single();
    const { data: referrer } = await supabaseAdmin
      .from("members")
      .select("credits, username")
      .eq("id", referrerId)
      .single();
    referrerName = referrer?.username ?? null;
    await supabaseAdmin
      .from("members")
      .update({ credits: (referrer?.credits ?? 0) + REFERRAL_CREDITS })
      .eq("id", referrerId);
    await notifySlack("referral", `referral:${refRow?.id ?? created.id}`, "New referral", {
      Referrer: referrerName,
      "New member": created.username,
      District: created.district,
      "Credits awarded": REFERRAL_CREDITS,
    });
  }

  await notifySlack("registration", `registration:${created.id}`, "New student registration", {
    Name: created.username,
    District: created.district,
    Mobile: maskMobile(created.mobile),
    "Referred by": referrerName,
  });

  return { ok: true as const, member: toPublic(created as MemberRow), isNew: true };
}

export async function saveAcademics(input: {
  memberId: string;
  department: string;
  yearOfStudy: string;
}) {
  const { data, error } = await supabaseAdmin
    .from("members")
    .update({ department: input.department, year_of_study: input.yearOfStudy })
    .eq("id", input.memberId)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return toPublic(data as MemberRow);
}

export async function referralHub(memberId: string) {
  const { data: member } = await supabaseAdmin
    .from("members")
    .select("*")
    .eq("id", memberId)
    .maybeSingle();
  if (!member) return null;
  const { data: invites } = await supabaseAdmin
    .from("referrals")
    .select("id, credits_awarded, created_at, members!referrals_referred_id_fkey(username, district)")
    .eq("referrer_id", memberId)
    .order("created_at", { ascending: false });

  return {
    member: toPublic(member as MemberRow),
    invites: (invites ?? []).map((row) => {
      const invited = row.members as unknown as { username: string; district: string } | null;
      return {
        id: row.id,
        credits: row.credits_awarded,
        joinedAt: row.created_at,
        username: invited?.username ?? "New member",
        district: invited?.district ?? "-",
      };
    }),
  };
}

export async function adminOverview() {
  const [members, referrals, projects, feedback] = await Promise.all([
    supabaseAdmin
      .from("members")
      .select("id, username, district, department, year_of_study, credits, created_at")
      .order("created_at", { ascending: false })
      .limit(50),
    supabaseAdmin.from("referrals").select("credits_awarded"),
    supabaseAdmin.from("projects").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("feedback").select("rating"),
  ]);

  const referralRows = referrals.data ?? [];
  const ratings = (feedback.data ?? []).map((r) => r.rating);

  return {
    totalMembers: members.data?.length ?? 0,
    totalReferrals: referralRows.length,
    creditsDistributed: referralRows.reduce((sum, r) => sum + r.credits_awarded, 0),
    projectsAnalyzed: projects.count ?? 0,
    averageRating: ratings.length
      ? Number((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2))
      : null,
    recent: (members.data ?? []).slice(0, 10).map((m) => ({
      id: m.id,
      username: m.username,
      district: m.district,
      department: m.department,
      year: m.year_of_study,
      credits: m.credits,
      joinedAt: m.created_at,
    })),
  };
}

async function memberLabel(memberId: string | null) {
  if (!memberId) return { name: "Guest", department: null as string | null };
  const { data } = await supabaseAdmin
    .from("members")
    .select("username, department")
    .eq("id", memberId)
    .maybeSingle();
  return { name: data?.username ?? "Guest", department: data?.department ?? null };
}

export async function storeProject(input: {
  memberId: string | null;
  title: string;
  description: string;
  components?: unknown;
}) {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .insert({
      member_id: input.memberId,
      title: input.title,
      description: input.description,
      components: input.components as never,
    })
    .select("id")
    .single();
  if (error || !data) return;
  const who = await memberLabel(input.memberId);
  const count = Array.isArray(input.components) ? input.components.length : null;
  await notifySlack("project", `project:${data.id}`, "New project analysis request", {
    Project: input.title,
    Student: who.name,
    Department: who.department,
    Components: count,
  });
}

export async function storeFeedback(input: {
  memberId: string | null;
  rating: number;
  message: string;
}) {
  const { data, error } = await supabaseAdmin
    .from("feedback")
    .insert({
      member_id: input.memberId,
      rating: input.rating,
      message: input.message,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  const who = await memberLabel(input.memberId);
  await notifySlack("feedback", `feedback:${data.id}`, "New feedback & rating", {
    Rating: `${"★".repeat(input.rating)}${"☆".repeat(5 - input.rating)} (${input.rating}/5)`,
    From: who.name,
    Message: input.message || null,
  });
  return { ok: true as const };
}

const PLAN_PRICES = { analysis: 99, viva: 49 } as const;

export async function recordPayment(input: {
  memberId: string | null;
  plan: "analysis" | "viva";
  status: "submitted" | "proof_uploaded";
}) {
  const amount = PLAN_PRICES[input.plan];
  const { data, error } = await supabaseAdmin
    .from("payments")
    .insert({ member_id: input.memberId, plan: input.plan, amount, status: input.status })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  const who = await memberLabel(input.memberId);
  await notifySlack("payment", `payment:${data.id}`, "Payment status change", {
    Plan: input.plan === "analysis" ? "Project Analysis (₹99/month)" : "Viva Questions (₹49)",
    Status: input.status === "submitted" ? "Marked as paid — verify in UPI app" : "Screenshot uploaded — verify",
    Student: who.name,
  });
  return { ok: true as const };
}