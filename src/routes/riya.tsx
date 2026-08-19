import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Bot, Loader2, Send, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { askRiya } from "@/lib/ai.functions";
import { useProject } from "@/lib/session";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/riya")({
  head: () => ({
    meta: [
      { title: "Riya AI — Hardware Expert Chatbot" },
      {
        name: "description",
        content:
          "Riya AI answers circuit, sensor, microcontroller and troubleshooting questions in English, Tamil or Tanglish.",
      },
      { property: "og:title", content: "Riya AI — Hardware Expert Chatbot" },
      { property: "og:description", content: "Your hardware-only AI troubleshooting expert." },
    ],
  }),
  component: RiyaPage,
});

type Msg = { role: "user" | "assistant"; content: string };

function RiyaPage() {
  const project = useProject();
  const chat = useServerFn(askRiya);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Vanakkam! I'm Riya — your hardware expert. Ask me about circuits, sensors, motor drivers, microcontrollers or why your board isn't booting. English, Tamil or Tanglish, unga wish.",
    },
  ]);
  const [input, setInput] = useState("");

  const mutation = useMutation({
    mutationFn: async (history: Msg[]) =>
      chat({ data: { messages: history, context: project?.title ?? "" } }),
    onSuccess: (reply) => setMessages((m) => [...m, { role: "assistant", content: reply }]),
    onError: (e: Error) => toast.error(e.message),
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || mutation.isPending) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    mutation.mutate(next);
  }

  return (
    <PageShell
      eyebrow="Step 8 of 10"
      title="Riya AI Chatbot"
      description="A specialist assistant. Hardware, circuits and embedded systems only — no off-topic detours."
      className="max-w-3xl"
    >
      <div className="glass flex h-[62vh] flex-col p-4 sm:p-6">
        <div className="flex-1 space-y-4 overflow-y-auto pr-1">
          {messages.map((m, i) => (
            <div
              key={i}
              className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </span>
              <p
                className={cn(
                  "min-w-0 whitespace-pre-wrap rounded-2xl border border-border px-4 py-3 text-sm",
                  m.role === "user" ? "bg-primary/10 text-foreground" : "bg-card/60 text-muted-foreground",
                )}
              >
                {m.content}
              </p>
            </div>
          ))}
          {mutation.isPending ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Riya is thinking…
            </p>
          ) : null}
        </div>

        <form onSubmit={submit} className="mt-4 flex gap-2 border-t border-border pt-4">
          <Input
            value={input}
            maxLength={1000}
            placeholder="Ask about your circuit…"
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit" disabled={!input.trim() || mutation.isPending}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </PageShell>
  );
}