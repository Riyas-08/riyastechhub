import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Copy, Coins, Users } from "lucide-react";
import { toast } from "sonner";

import { PageShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { getAdminOverview, getReferralHub } from "@/lib/hub.functions";
import { useHydrated, useMember } from "@/lib/session";

export const Route = createFileRoute("/referrals")({
  head: () => ({
    meta: [
      { title: "Refer & Earn + Admin Hub — RiyasTech Hub" },
      {
        name: "description",
        content:
          "Share your unique referral link, earn credits for every verified sign-up, and view live platform metrics.",
      },
      { property: "og:title", content: "Refer & Earn — RiyasTech Hub" },
      { property: "og:description", content: "Earn credits for every verified new member." },
    ],
  }),
  component: ReferralsPage,
});

function ReferralsPage() {
  const member = useMember();
  const hydrated = useHydrated();
  const navigate = useNavigate();
  const hub = useServerFn(getReferralHub);
  const admin = useServerFn(getAdminOverview);

  const hubQuery = useQuery({
    queryKey: ["referral-hub", member?.id],
    enabled: !!member,
    queryFn: () => hub({ data: { token: member!.token ?? "" } }),
  });

  const adminQuery = useQuery({ queryKey: ["admin-overview"], queryFn: () => admin({}) });

  const link =
    member && typeof window !== "undefined"
      ? `${window.location.origin}/enter?ref=${member.referralCode}`
      : "";

  if (hydrated && !member) {
    return (
      <PageShell eyebrow="Step 6 of 10" title="Refer & Earn">
        <div className="glass p-6">
          <p className="text-sm text-muted-foreground">
            Sign in to generate your unique referral link.
          </p>
          <Button className="mt-4" onClick={() => navigate({ to: "/enter" })}>
            Go to Sign-In
          </Button>
        </div>
      </PageShell>
    );
  }

  const stats = adminQuery.data;

  return (
    <PageShell
      eyebrow="Step 6 of 10"
      title="Refer & Earn + Admin Hub"
      description="Credits are awarded only when an invited student completes OTP verification — no fake counts."
    >
      <div className="glass p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Your credits</p>
            <p className="mt-1 flex items-center gap-2 font-display text-3xl font-bold text-primary">
              <Coins className="h-6 w-6" />
              {hubQuery.data?.member.credits ?? member?.credits ?? 0}
            </p>
          </div>
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Verified referrals
            </p>
            <p className="mt-1 flex items-center gap-2 font-display text-3xl font-bold text-primary">
              <Users className="h-6 w-6" />
              {hubQuery.data?.invites.length ?? 0}
            </p>
          </div>
        </div>

        <p className="mt-6 text-xs uppercase tracking-widest text-muted-foreground">
          Your referral link
        </p>
        <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] gap-2">
          <p className="min-w-0 truncate rounded-lg border border-border px-3 py-2 text-sm text-primary">
            {link}
          </p>
          <Button
            variant="outline"
            className="shrink-0"
            onClick={() => {
              navigator.clipboard.writeText(link);
              toast.success("Referral link copied");
            }}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        {hubQuery.data?.invites.length ? (
          <ul className="mt-6 space-y-2">
            {hubQuery.data.invites.map((i) => (
              <li
                key={i.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-sm"
              >
                <span className="min-w-0 truncate">
                  {i.username} · {i.district}
                </span>
                <span className="shrink-0 text-primary">+{i.credits} credits</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="glass mt-6 p-6">
        <h2 className="font-display text-lg font-semibold">Admin Overview</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ["Members", stats?.totalMembers ?? 0],
            ["Referrals", stats?.totalReferrals ?? 0],
            ["Credits given", stats?.creditsDistributed ?? 0],
            ["Projects analysed", stats?.projectsAnalyzed ?? 0],
            ["Avg rating", stats?.averageRating ?? "—"],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-xl border border-border p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
              <p className="mt-1 font-display text-2xl font-bold text-primary">{value}</p>
            </div>
          ))}
        </div>

        {stats?.recent.length ? (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="py-2 pr-4">Member</th>
                  <th className="py-2 pr-4">District</th>
                  <th className="py-2 pr-4">Department</th>
                  <th className="py-2 pr-4">Year</th>
                  <th className="py-2">Credits</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {stats.recent.map((r) => (
                  <tr key={r.id} className="border-t border-border">
                    <td className="py-2 pr-4 text-foreground">{r.username}</td>
                    <td className="py-2 pr-4">{r.district}</td>
                    <td className="py-2 pr-4">{r.department ?? "—"}</td>
                    <td className="py-2 pr-4">{r.year ?? "—"}</td>
                    <td className="py-2 text-primary">{r.credits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </PageShell>
  );
}