import { createFileRoute } from "@tanstack/react-router";

import { approvePayment } from "@/lib/hub.server";
import { verifyPaymentApprovalSig } from "@/lib/member-token.server";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function page(body: string, status = 200) {
  return new Response(
    `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Payment approval — RiyasTech Hub</title></head><body style="font-family:system-ui;background:#0D1117;color:#e6edf3;display:grid;place-items:center;min-height:100vh;margin:0"><main style="max-width:420px;padding:24px;text-align:center">${body}</main></body></html>`,
    { status, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } },
  );
}

async function check(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id") ?? "";
  const sig = url.searchParams.get("sig") ?? "";
  if (!/^[0-9a-f-]{36}$/i.test(id) || !sig || !(await verifyPaymentApprovalSig(id, sig))) return null;
  return { id, sig };
}

export const Route = createFileRoute("/api/public/payments/approve")({
  server: {
    handlers: {
      // GET only shows a confirmation button, so link previews can never approve a payment.
      GET: async ({ request }) => {
        const ok = await check(request);
        if (!ok) return page("<h1>Invalid approval link</h1>", 403);
        return page(
          `<h1>Approve this payment?</h1><p>Only approve after you see the money in your UPI app.</p><form method="post" action="?id=${esc(ok.id)}&sig=${esc(ok.sig)}"><button style="padding:12px 24px;font-size:16px;border-radius:8px;border:0;background:#00F0FF;color:#0D1117;cursor:pointer">Approve payment</button></form>`,
        );
      },
      POST: async ({ request }) => {
        const ok = await check(request);
        if (!ok) return page("<h1>Invalid approval link</h1>", 403);
        const row = await approvePayment(ok.id);
        if (!row) return page("<h1>Payment not found</h1>", 404);
        return page(`<h1>Approved ✅</h1><p>The student's ${row.plan === "viva" ? "Viva Question Bank" : "Project Analysis"} plan is now unlocked.</p>`);
      },
    },
  },
});
