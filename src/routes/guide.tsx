import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { BookOpen, Crown, Download, Loader2, Stethoscope } from "lucide-react";
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
import {
  isSeniorYear,
  useHydrated,
  useMember,
  usePremium,
  useProject,
} from "@/lib/session";

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
  const member = useMember();
  const premium = usePremium();
  const hydrated = useHydrated();
  const navigate = useNavigate();
  const viva = useServerFn(buildVivaBank);
  const troubleshoot = useServerFn(askTroubleshooter);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [doubt, setDoubt] = useState("");
  const [answer, setAnswer] = useState("");

  const vivaLocked = hydrated && isSeniorYear(member?.yearOfStudy) && !premium.viva;

  const vivaMutation = useMutation({
    mutationFn: (count: number) =>
      viva({
        data: {
          title: project!.title,
          description: project!.description,
          count,
          token: member?.token ?? "",
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

  async function downloadPdf() {
    if (!questions.length) return;
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 48;
    const width = doc.internal.pageSize.getWidth() - margin * 2;
    const bottom = doc.internal.pageSize.getHeight() - margin;
    let y = margin;

    const line = (text: string, size: number, bold = false, gap = 6) => {
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setFontSize(size);
      for (const l of doc.splitTextToSize(text, width) as string[]) {
        if (y > bottom) {
          doc.addPage();
          y = margin;
        }
        doc.text(l, margin, y);
        y += size + 3;
      }
      y += gap;
    };

    line("RiyasTech Hub — Viva Question Bank", 18, true, 4);
    line(project?.title ?? "Hardware Project", 12, false, 14);

    questions.forEach((q, i) => {
      line(`${i + 1}. ${q.question}`, 12, true, 2);
      line(`${q.topic} · ${q.difficulty}`, 9, false, 2);
      line(`Answer: ${q.answer}`, 11, false, 12);
    });

    doc.save("riyastech-viva-questions.pdf");
    toast.success("PDF downloaded");
  }

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

            {/* Responsive table grid: real table on md+, stacked cards on mobile */}
            <div className="mt-4 hidden overflow-x-auto rounded-xl border border-border md:block">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-card/70 text-xs uppercase tracking-widest text-primary">
                  <tr>
                    <th className="px-4 py-3 font-medium">Component</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Specification</th>
                    <th className="px-4 py-3 font-medium">Circuit role</th>
                    <th className="px-4 py-3 font-medium">How it works</th>
                  </tr>
                </thead>
                <tbody>
                  {(project?.components ?? []).map((c) => (
                    <tr key={c.name} className="border-t border-border align-top">
                      <td className="px-4 py-3 font-medium text-foreground">{c.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{c.category}</td>
                      <td className="px-4 py-3 text-muted-foreground">{c.specification}</td>
                      <td className="px-4 py-3 text-muted-foreground">{c.role}</td>
                      <td className="px-4 py-3 text-muted-foreground">{c.guide}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 md:hidden">
              {(project?.components ?? []).map((c) => (
                <article key={c.name} className="rounded-xl border border-border bg-card/60 p-4">
                  <h3 className="font-display font-semibold">{c.name}</h3>
                  <p className="mt-1 text-xs uppercase tracking-widest text-primary">
                    {c.category} · {c.specification}
                  </p>
                  <dl className="mt-3 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm text-muted-foreground">
                    <dt className="text-foreground">Role</dt>
                    <dd>{c.role}</dd>
                    <dt className="text-foreground">Works</dt>
                    <dd>{c.guide}</dd>
                  </dl>
                </article>
              ))}
            </div>
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
            {vivaLocked ? (
              <div className="rounded-xl border border-primary/50 bg-primary/5 p-5">
                <p className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-primary">
                  <Crown className="h-4 w-4" /> Premium required
                </p>
                <h2 className="mt-2 font-display text-lg font-semibold">
                  Viva question bank is premium for 3rd and 4th year
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Unlock up to 500 questions with model answers and PDF download for ₹49.
                </p>
                <Button
                  className="mt-4 text-neon-foreground"
                  style={{ backgroundImage: "var(--gradient-neon)" }}
                  onClick={() => navigate({ to: "/premium" })}
                >
                  Unlock for ₹49
                </Button>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="min-w-0 flex-1 font-display text-lg font-semibold">
                    Viva Question Bank
                    <span className="ml-2 text-sm text-primary">{questions.length} loaded</span>
                  </h2>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!questions.length}
                    onClick={downloadPdf}
                  >
                    <Download className="h-4 w-4" /> Download as PDF
                  </Button>
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
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
