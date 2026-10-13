import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Crown, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { analyzeProject } from "@/lib/ai.functions";
import { saveProject } from "@/lib/hub.functions";
import {
  isSeniorYear,
  setProject,
  useHydrated,
  useMember,
  usePremium,
  useProject,
} from "@/lib/session";

export const Route = createFileRoute("/analyze")({
  head: () => ({
    meta: [
      { title: "Project Analysis Engine — RiyasTech Hub" },
      {
        name: "description",
        content:
          "Describe your hardware project in English, Tamil or Tanglish and generate an exhaustive, part-number-level component list.",
      },
      { property: "og:title", content: "Project Analysis Engine — RiyasTech Hub" },
      {
        property: "og:description",
        content: "AI-generated hardware bill of materials for any electronics project.",
      },
    ],
  }),
  component: AnalyzePage,
});

const TITLE_EXAMPLES = [
  "Smart irrigation system with soil moisture sensing",
  "IoT air quality monitor with ESP32 and MQ-135",
  "Line following robot using IR array and L298N",
  "Solar powered battery charge controller",
  "RFID based smart attendance system",
];

function AnalyzePage() {
  const member = useMember();
  const stored = useProject();
  const premium = usePremium();
  const hydrated = useHydrated();
  const navigate = useNavigate();
  const analyze = useServerFn(analyzeProject);
  const persist = useServerFn(saveProject);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [focused, setFocused] = useState(false);

  const locked =
    hydrated && isSeniorYear(member?.yearOfStudy) && !premium.analysis;

  const mutation = useMutation({
    mutationFn: async () => {
      const result = await analyze({
        data: { title: title.trim(), description: description.trim() },
      });
      await persist({
        data: {
          token: member?.token ?? null,
          title: title.trim(),
          description: description.trim(),
          components: result.components,
        },
      });
      return result;
    },
    onSuccess: (result) => {
      setProject({ ...result, title: title.trim(), description: description.trim() });
      toast.success(`${result.components.length} components generated`);
      navigate({ to: "/components" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const ready = title.trim().length >= 3;

  return (
    <PageShell
      eyebrow="Step 4 of 10"
      title="Hardware Project Analysis Engine"
      description="Write in English, Tamil or Tanglish. The engine reads your idea and derives every IC, sensor, driver, passive and mechanical part it actually needs."
    >
      {locked ? (
        <div className="glass mb-6 border-primary/50 p-6">
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-primary">
            <Crown className="h-4 w-4" /> Premium required
          </p>
          <h2 className="mt-2 font-display text-lg font-semibold">
            3rd and 4th year project analysis is a premium feature
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Unlock unlimited senior-year analysis for ₹99 per month.
          </p>
          <Button
            className="mt-4 text-neon-foreground"
            style={{ backgroundImage: "var(--gradient-neon)" }}
            onClick={() => navigate({ to: "/premium" })}
          >
            View Premium Plans
          </Button>
        </div>
      ) : null}

      <div className="glass p-6 sm:p-8">
        <div className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="title">
              Project Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              maxLength={200}
              required
              placeholder="e.g. Smart irrigation system with soil moisture sensing"
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              onChange={(e) => setTitle(e.target.value)}
            />
            {focused ? (
              <div className="rounded-xl border border-border bg-card/70 p-3">
                <p className="text-xs uppercase tracking-widest text-primary">
                  Example titles — tap to use
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {TITLE_EXAMPLES.map((ex) => (
                    <button
                      key={ex}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setTitle(ex)}
                      className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="about">
              About this Project{" "}
              <span className="text-xs text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="about"
              rows={7}
              maxLength={4000}
              value={description}
              placeholder="Enna project pannalam nu explain pannunga… (English / தமிழ் / Tanglish all supported). You can leave this blank."
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <Button
            size="lg"
            disabled={!ready || locked || mutation.isPending}
            onClick={() => mutation.mutate()}
            className="text-neon-foreground disabled:opacity-40"
            style={ready && !locked ? { backgroundImage: "var(--gradient-neon)" } : undefined}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Tracing your circuit…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Search Analysis
              </>
            )}
          </Button>
          {mutation.isPending ? (
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full w-1/3 animate-pulse rounded-full"
                style={{ backgroundImage: "var(--gradient-neon)" }}
              />
            </div>
          ) : null}
        </div>
      </div>

      {stored ? (
        <div className="glass card-hover mt-6 p-6">
          <h2 className="font-display text-lg font-semibold">Last analysed project</h2>
          <p className="mt-1 text-sm text-primary">{stored.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {stored.components.length} components ready.
          </p>
          <Button variant="outline" className="mt-4" onClick={() => navigate({ to: "/components" })}>
            Open component list
          </Button>
        </div>
      ) : null}
    </PageShell>
  );
}
