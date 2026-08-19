import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { updateAcademics } from "@/lib/hub.functions";
import { setMember, useHydrated, useMember } from "@/lib/session";
import { DEPARTMENTS, YEARS } from "@/lib/vendors";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Academic Profile — RiyasTech Hub" },
      {
        name: "description",
        content:
          "Choose your hardware department (ECE, EEE, Mechanical, Civil and core branches) and year of study.",
      },
      { property: "og:title", content: "Academic Profile — RiyasTech Hub" },
      { property: "og:description", content: "Set your department and year of study." },
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

  const mutation = useMutation({
    mutationFn: () =>
      save({ data: { memberId: member!.id, department, yearOfStudy: year } }),
    onSuccess: (updated) => {
      setMember(updated);
      toast.success("Profile saved");
      navigate({ to: "/analyze" });
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
              onClick={() => setYear(y)}
              className={cn(
                "rounded-xl border border-border px-4 py-3 text-sm transition-colors hover:border-primary/60 hover:text-primary",
                year === y && "border-primary bg-primary/10 text-primary",
              )}
            >
              {y}
            </button>
          ))}
        </div>

        <Button
          size="lg"
          className="mt-8 w-full text-neon-foreground disabled:opacity-40 sm:w-auto"
          style={department && year ? { backgroundImage: "var(--gradient-neon)" } : undefined}
          disabled={!department || !year || mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Continue to Project Analysis
        </Button>
      </div>
    </PageShell>
  );
}