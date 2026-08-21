import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Bot, Loader2, MessageCircle, Send, User, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { askRiya } from "@/lib/ai.functions";
import { useProject } from "@/lib/session";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

export function RiyaDock() {
  const project = useProject();
  const chat = useServerFn(askRiya);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Vanakkam! Ask Riya anything about your circuit, sensors or components — English, Tamil or Tanglish.",
    },
  ]);

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
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-end gap-3 p-4 sm:p-6">
      {open ? (
        <div className="glass pointer-events-auto flex h-[70vh] max-h-[520px] w-full max-w-sm flex-col overflow-hidden p-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <p className="flex items-center gap-2 font-display text-sm font-semibold">
              <Bot className="h-4 w-4 text-primary" /> Ask Riya AI
            </p>
            <button
              aria-label="Close Riya chat"
              onClick={() => setOpen(false)}
              className="grid h-7 w-7 place-items-center rounded-lg border border-border text-muted-foreground hover:text-primary"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto py-3 pr-1">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex gap-2", m.role === "user" && "flex-row-reverse")}>
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                  {m.role === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                </span>
                <p
                  className={cn(
                    "min-w-0 whitespace-pre-wrap rounded-2xl border border-border px-3 py-2 text-xs",
                    m.role === "user"
                      ? "bg-primary/10 text-foreground"
                      : "bg-card/60 text-muted-foreground",
                  )}
                >
                  {m.content}
                </p>
              </div>
            ))}
            {mutation.isPending ? (
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Riya is thinking…
              </p>
            ) : null}
          </div>

          <form onSubmit={submit} className="flex gap-2 border-t border-border pt-3">
            <Input
              value={input}
              maxLength={1000}
              placeholder="Ask Riya…"
              onChange={(e) => setInput(e.target.value)}
            />
            <Button type="submit" size="icon" disabled={!input.trim() || mutation.isPending}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      ) : null}

      {!open ? (
        <button
          onClick={() => setOpen(true)}
          aria-label="Ask Riya AI"
          className="pointer-events-auto flex items-center gap-2 rounded-full border border-primary/50 bg-primary/15 px-4 py-3 text-sm font-semibold text-primary shadow-[0_0_24px_rgba(0,240,255,0.35)] backdrop-blur-xl transition-transform hover:scale-105"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="hidden sm:inline">Ask Riya AI</span>
        </button>
      ) : null}
    </div>
  );
}
