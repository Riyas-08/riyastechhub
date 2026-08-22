import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Crown, Loader2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateAcademics } from "@/lib/hub.functions";
import {
  isSeniorYear,
  setCollege,
  setMember,
  useHydrated,
  useMember,
} from "@/lib/session";
import { DEPARTMENTS, YEARS } from "@/lib/vendors";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Academic Profile — RiyasTech Hub" },
      {
        name: "description",
        content:
          "Choose your hardware department (ECE, EEE, Mechanical, Civil and core branches), college name and year of study.",
      },
      { property: "og:title", content: "Academic Profile — RiyasTech Hub" },
      { property: "og:description", content: "Set your college, department and year of study." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const member = useMember();
  const hydrated = useHydrated();
  const navigate = useNavigate();
  const save = useServerFn(updateAcademics);
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [college, setCollegeName] = useState("");
  const [showPremium, setShowPremium] = useState(false);

  const mutation = useMutation({
    mutationFn: () => save({ data: { memberId: member!.id, department, yearOfStudy: year } }),
    onSuccess: (updated) => {
      setMember(updated);
      setCollege(college.trim());
      toast.success("Profile saved");
      navigate({ to: isSeniorYear(year) ? "/premium" : "/analyze" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (hydrated && !member) {
    return (
      <PageShell eyebrow="Step 3 of 10" title="Academic Profile">
        <div className="glass p-6">
          <p className="text-sm text-muted-foreground">
            Verify your mobile number first to build your profile.
          </p>
          <Button className="mt-4" onClick={() => navigate({ to: "/enter" })}>
            Go to Sign-In
          </Button>
        </div>
      </PageShell>
    );
  }

  const ready = !!department && !!year && college.trim().length >= 3;

  return (
    <PageShell
      eyebrow="Step 3 of 10"
      title="Academic Profile"
      description="RiyasTech Hub is built for core hardware branches. Computer Science streams are intentionally out of scope."
    >
      <div className="glass p-6 sm:p-8">
        <h2 className="font-display text-lg font-semibold">Department</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DEPARTMENTS.map((d) => (
            <button
              key={d}
              onClick={() => setDepartment(d)}
              className={cn(
                "rounded-xl border border-border px-4 py-3 text-left text-sm transition-colors hover:border-primary/60 hover:text-primary",
                department === d && "border-primary bg-primary/10 text-primary",
              )}
            >
              {d}
            </button>
          ))}
        </div>

        <h2 className="mt-8 font-display text-lg font-semibold">Year of Study</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {YEARS.map((y) => (
            <button
              key={y}
              onClick={() => {
                setYear(y);
                if (isSeniorYear(y)) setShowPremium(true);
              }}
              className={cn(
                "rounded-xl border border-border px-4 py-3 text-sm transition-colors hover:border-primary/60 hover:text-primary",
                year === y && "border-primary bg-primary/10 text-primary",
              )}
            >
              {y}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-2">
          <Label htmlFor="college">College Name (required)</Label>
          <Input
            id="college"
            value={college}
            maxLength={120}
            placeholder="e.g. Kumaraguru College of Technology"
            onChange={(e) => setCollegeName(e.target.value)}
          />
          {college && college.trim().length < 3 ? (
            <p className="text-xs text-destructive">Enter your full college name.</p>
          ) : null}
        </div>

        <Button
          size="lg"
          className="mt-8 w-full text-neon-foreground disabled:opacity-40 sm:w-auto"
          style={ready ? { backgroundImage: "var(--gradient-neon)" } : undefined}
          disabled={!ready || mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Continue to Project Analysis
        </Button>
      </div>

      {showPremium ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4 backdrop-blur-sm">
          <div className="glass w-full max-w-md p-6">
            <div className="flex items-start justify-between gap-3">
              <p className="flex items-center gap-2 font-display text-lg font-semibold text-primary">
                <Crown className="h-5 w-5" /> Premium Subscription
              </p>
              <button
                aria-label="Close premium popup"
                onClick={() => setShowPremium(false)}
                className="grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground hover:text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {year} content — full project analysis and the viva question bank — is premium.
              Unlock it to continue with senior-year projects.
            </p>
            <div className="mt-5 grid gap-2">
              <Button
                className="text-neon-foreground"
                style={{ backgroundImage: "var(--gradient-neon)" }}
                onClick={() => navigate({ to: "/premium" })}
              >
                View plans — from ₹49
              </Button>
              <Button variant="outline" onClick={() => setShowPremium(false)}>
                Maybe later
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </PageShell>
  );
}
