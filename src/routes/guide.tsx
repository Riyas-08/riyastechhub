import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { BookOpen, Loader2, Stethoscope } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { askTroubleshooter, buildVivaBank } from "@/lib/ai.functions";
import { useHydrated, useProject } from "@/lib/session";

export const Route = createFileRoute("/guide")({
  head: () => ({
    meta: [
      { title: "Component Guide, Troubleshooting & Viva — RiyasTech Hub" },
      {
        name: "description",
        content:
          "Learn every component in your build, diagnose faults with AI and rehearse with a generated viva question bank.",
      },
      { property: "og:title", content: "Component Guide & Viva — RiyasTech Hub" },
      {
        property: "og:description",
        content: "Component theory, AI troubleshooting and viva preparation in one place.",
      },
    ],
  }),
  component: GuidePage,
});

type Question = { topic: string; question: string; answer: string; difficulty: string };

function GuidePage() {
  const project = useProject();
  const hydrated = useHydrated();
  const navigate = useNavigate();
  const viva = useServerFn(buildVivaBank);
  const troubleshoot = useServerFn(askTroubleshooter);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [doubt, setDoubt] = useState("");
  const [answer, setAnswer] = useState("");

  const vivaMutation = useMutation({
    mutationFn: (count: number) =>
      viva({
        data: {
          title: project!.title,
          description: project!.description,
          count,
        },
      }),
    onSuccess: (qs) => {
      setQuestions((prev) => [...prev, ...qs]);
      toast.success(`${qs.length} questions added`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const troubleMutation = useMutation({
    mutationFn: () =>
      troubleshoot({ data: { query: doubt.trim(), context: project?.title ?? "" } }),
    onSuccess: setAnswer,
    onError: (e: Error) => toast.error(e.message),
  });

  if (hydrated && !project) {
    return (
      <PageShell eyebrow="Step 7 of 10" title="Component Guide, Troubleshooting & Viva">
        <div className="glass p-6">
          <p className="text-sm text-muted-foreground">
            Analyse a project first — the guide and viva bank are generated from your own build.
          </p>
          <Button className="mt-4" onClick={() => navigate({ to: "/analyze" })}>
            Analyse a project
          </Button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Step 7 of 10"
      title="Component Guide, Troubleshooting & Viva"
      description={project?.title ?? ""}
    >
      <Tabs defaultValue="guide">
        <TabsList className="w-full">
          <TabsTrigger value="guide" className="flex-1">
            Guide
          </TabsTrigger>
          <TabsTrigger value="fix" className="flex-1">
            Troubleshoot
          </TabsTrigger>
          <TabsTrigger value="viva" className="flex-1">
            Viva
          </TabsTrigger>
        </TabsList>

        <TabsContent value="guide" className="mt-5">
          <div className="glass p-5 sm:p-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
              <BookOpen className="h-5 w-5 text-primary" /> How each component works
            </h2>
            <Accordion type="single" collapsible className="mt-3">
              {(project?.components ?? []).map((c) => (
                <AccordionItem key={c.name} value={c.name}>
                  <AccordionTrigger className="text-left text-sm">{c.name}</AccordionTrigger>
                  <AccordionContent className="space-y-2 text-sm text-muted-foreground">
                    <p className="text-xs uppercase tracking-widest text-primary">
                      {c.category} · {c.specification}
                    </p>
                    <p>{c.guide}</p>
                    <p>
                      <span className="text-foreground">Circuit role: </span>
                      {c.role}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </TabsContent>

        <TabsContent value="fix" className="mt-5">
          <div className="glass p-5 sm:p-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
              <Stethoscope className="h-5 w-5 text-primary" /> AI Troubleshooting
            </h2>
            <Textarea
              rows={4}
              maxLength={2000}
              className="mt-4"
              value={doubt}
              placeholder="Motor driver heat aaguthu, L298N output varala — enna check pannanum?"
              onChange={(e) => setDoubt(e.target.value)}
            />
            <Button
              className="mt-3"
              disabled={doubt.trim().length < 3 || troubleMutation.isPending}
              onClick={() => troubleMutation.mutate()}
            >
              {troubleMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Diagnose
            </Button>
            {answer ? (
              <p className="mt-5 whitespace-pre-wrap rounded-xl border border-border bg-card/60 p-4 text-sm text-muted-foreground">
                {answer}
              </p>
            ) : null}
          </div>
        </TabsContent>

        <TabsContent value="viva" className="mt-5">
          <div className="glass p-5 sm:p-6">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <h2 className="min-w-0 font-display text-lg font-semibold">
                Viva Question Bank
                <span className="ml-2 text-sm text-primary">{questions.length} loaded</span>
              </h2>
              <Button
                size="sm"
                className="shrink-0"
                disabled={vivaMutation.isPending}
                onClick={() => vivaMutation.mutate(50)}
              >
                {vivaMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {questions.length ? "Generate 50 more" : "Generate questions"}
              </Button>
            </div>
            <Accordion type="single" collapsible className="mt-4">
              {questions.map((q, i) => (
                <AccordionItem key={i} value={`q-${i}`}>
                  <AccordionTrigger className="text-left text-sm">
                    {i + 1}. {q.question}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-2 text-sm text-muted-foreground">
                    <p className="text-xs uppercase tracking-widest text-primary">
                      {q.topic} · {q.difficulty}
                    </p>
                    <p>{q.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}