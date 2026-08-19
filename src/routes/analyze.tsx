import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { analyzeProject } from "@/lib/ai.functions";
import { saveProject } from "@/lib/hub.functions";
import { setProject, useMember, useProject } from "@/lib/session";

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

function AnalyzePage() {
  const member = useMember();
  const stored = useProject();
  const navigate = useNavigate();
  const analyze = useServerFn(analyzeProject);
  const persist = useServerFn(saveProject);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      const result = await analyze({ data: { title: title.trim(), description: description.trim() } });
      await persist({
        data: {
          memberId: member?.id ?? null,
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

  const ready = title.trim().length >= 3 && description.trim().length >= 10;

  return (
    <PageShell
      eyebrow="Step 4 of 10"
      title="Hardware Project Analysis Engine"
      description="Write in English, Tamil or Tanglish. The engine reads your idea and derives every IC, sensor, driver, passive and mechanical part it actually needs."
    >
      <div className="glass p-6 sm:p-8">
        <div className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              value={title}
              maxLength={200}
              placeholder="e.g. Smart irrigation system with soil moisture sensing"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="about">About this Project</Label>
            <Textarea
              id="about"
              rows={7}
              maxLength={4000}
              value={description}
              placeholder="Enna project pannalam nu explain pannunga… (English / தமிழ் / Tanglish all supported)"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <Button
            size="lg"
            disabled={!ready || mutation.isPending}
            onClick={() => mutation.mutate()}
            className="text-neon-foreground disabled:opacity-40"
            style={ready ? { backgroundImage: "var(--gradient-neon)" } : undefined}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Tracing your circuit…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Search / Analyze
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