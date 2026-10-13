import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BadgeCheck, Crown, Download, ImagePlus, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import qrAsset from "@/assets/payment-qr.jpg.asset.json";
import { reportPayment } from "@/lib/hub.functions";
import { setPremium, useMember, usePremium } from "@/lib/session";
import { useServerFn } from "@tanstack/react-start";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/premium")({
  head: () => ({
    meta: [
      { title: "Premium Access — RiyasTech Hub" },
      {
        name: "description",
        content:
          "Unlock 3rd and 4th year project analysis at ₹99/month and the viva question bank at ₹49. Pay by UPI QR and unlock instantly.",
      },
      { property: "og:title", content: "Premium Access — RiyasTech Hub" },
      {
        property: "og:description",
        content: "Project analysis ₹99/month, viva question bank ₹49 — UPI QR payment.",
      },
    ],
  }),
  component: PremiumPage,
});

const PLANS = [
  {
    id: "analysis" as const,
    name: "Project Analysis",
    price: 99,
    cadence: "per month",
    perks: [
      "Unlimited senior-year project analysis",
      "Full part-number level component list",
      "Multi-store price comparison and buy links",
      "Component guide and AI troubleshooting",
    ],
  },
  {
    id: "viva" as const,
    name: "Viva Questions",
    price: 49,
    cadence: "one time",
    perks: [
      "Generate up to 500 viva questions",
      "Model answers with difficulty tags",
      "Download the full bank as a PDF",
      "Topic-wise revision coverage",
    ],
  },
];

function PremiumPage() {
  const navigate = useNavigate();
  const premium = usePremium();
  const [proof, setProof] = useState<string | null>(null);
  const [lastPlan, setLastPlan] = useState<"analysis" | "viva">("analysis");
  const member = useMember();
  const report = useServerFn(reportPayment);

  function notify(plan: "analysis" | "viva", status: "submitted" | "proof_uploaded") {
    report({ data: { token: member?.token ?? null, plan, status } }).catch(() => undefined);
  }

  function unlock(id: "analysis" | "viva") {
    setPremium({ ...premium, [id]: true });
    setLastPlan(id);
    notify(id, "submitted");
    toast.success(
      id === "analysis" ? "Project Analysis unlocked" : "Viva Question Bank unlocked",
    );
  }

  function onProof(file: File | undefined) {
    if (!file) return;
    if (file.size > 5_000_000) {
      toast.error("Screenshot must be under 5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setProof(String(reader.result));
    notify(lastPlan, "proof_uploaded");
    reader.readAsDataURL(file);
  }

  return (
    <PageShell
      eyebrow="Premium Access"
      title="Premium Subscription"
      description="3rd and 4th year content is premium. Pay through any UPI app using the QR below, then unlock your plan."
    >
      <section className="grid gap-5 md:grid-cols-2">
        {PLANS.map((plan) => {
          const active = premium[plan.id];
          return (
            <article
              key={plan.id}
              className={cn("glass card-hover p-6", active && "border-primary/60")}
            >
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-primary">
                <Crown className="h-4 w-4" /> {plan.cadence}
              </p>
              <h2 className="mt-2 font-display text-xl font-semibold">{plan.name}</h2>
              <p className="mt-1 font-display text-4xl font-bold text-primary">₹{plan.price}</p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {plan.perks.map((p) => (
                  <li key={p} className="flex gap-2">
                    <BadgeCheck className="h-4 w-4 shrink-0 text-primary" /> {p}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-5 w-full text-neon-foreground"
                style={!active ? { backgroundImage: "var(--gradient-neon)" } : undefined}
                variant={active ? "outline" : "default"}
                disabled={active}
                onClick={() => unlock(plan.id)}
              >
                {active ? "Unlocked" : `I've paid ₹${plan.price} — unlock`}
              </Button>
            </article>
          );
        })}
      </section>

      <section className="glass mt-8 p-6">
        <h2 className="font-display text-lg font-semibold">Pay with any UPI app</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Scan or screenshot this QR code and pay with GPay, PhonePe, Paytm or Navi. Add the plan
          name in the payment note.
        </p>
        <div className="mt-5 grid gap-6 md:grid-cols-[auto_minmax(0,1fr)]">
          <img
            src={qrAsset.url}
            alt="RiyasTech Hub UPI payment QR code"
            width={280}
            height={380}
            loading="lazy"
            className="mx-auto w-full max-w-[280px] rounded-xl border border-border bg-white p-3"
          />
          <div>
            <a
              href={qrAsset.url}
              download="riyastech-payment-qr.jpg"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-primary hover:border-primary/60"
            >
              <Download className="h-4 w-4" /> Save QR image
            </a>

            <div className="mt-6">
              <p className="text-sm font-semibold">Upload your payment screenshot</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Manual verification — keep the screenshot handy and mail it if asked.
              </p>
              <label className="mt-3 flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border px-4 py-3 text-sm text-muted-foreground hover:border-primary/60 hover:text-primary">
                <ImagePlus className="h-4 w-4" />
                {proof ? "Change screenshot" : "Choose or capture screenshot"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onProof(e.target.files?.[0])}
                />
              </label>
              {proof ? (
                <img
                  src={proof}
                  alt="Uploaded payment screenshot preview"
                  className="mt-3 max-h-52 rounded-lg border border-border"
                />
              ) : null}
            </div>

            <a
              href="mailto:riyasusman2008@gmail.com?subject=RiyasTech%20Hub%20Premium%20Payment"
              className="mt-6 inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Mail className="h-4 w-4" /> riyasusman2008@gmail.com
            </a>
          </div>
        </div>
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="outline" onClick={() => navigate({ to: "/analyze" })}>
          Continue to Project Analysis
        </Button>
        <Button variant="outline" onClick={() => navigate({ to: "/guide" })}>
          Go to Viva Module
        </Button>
      </div>
    </PageShell>
  );
}
