import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Bot, Camera, ImagePlus, Loader2, Send, User } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { PageShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { askRiya, identifyComponent } from "@/lib/ai.functions";
import { useProject } from "@/lib/session";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/riya")({
  head: () => ({
    meta: [
      { title: "Riya AI — Hardware Expert Chatbot" },
      {
        name: "description",
        content:
          "Riya AI answers circuit, sensor, microcontroller and troubleshooting questions in English, Tamil or Tanglish, and identifies components from a photo.",
      },
      { property: "og:title", content: "Riya AI — Hardware Expert Chatbot" },
      { property: "og:description", content: "Your hardware-only AI troubleshooting expert." },
    ],
  }),
  component: RiyaPage,
});

type Msg = { role: "user" | "assistant"; content: string; image?: string };

function RiyaPage() {
  const project = useProject();
  const chat = useServerFn(askRiya);
  const identify = useServerFn(identifyComponent);
  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Vanakkam! I'm Riya — your hardware expert. Ask me about circuits, sensors, motor drivers, microcontrollers or why your board isn't booting. You can also upload or capture a photo of any component and I'll identify it. English, Tamil or Tanglish, unga wish.",
    },
  ]);
  const [input, setInput] = useState("");

  const mutation = useMutation({
    mutationFn: async (history: Msg[]) =>
      chat({
        data: {
          messages: history.map((m) => ({ role: m.role, content: m.content })),
          context: project?.title ?? "",
        },
      }),
    onSuccess: (reply) => setMessages((m) => [...m, { role: "assistant", content: reply }]),
    onError: (e: Error) => toast.error(e.message),
  });

  const imageMutation = useMutation({
    mutationFn: (image: string) => identify({ data: { image, note: input.trim() } }),
    onSuccess: (reply) => setMessages((m) => [...m, { role: "assistant", content: reply }]),
    onError: (e: Error) => toast.error(e.message),
  });

  const busy = mutation.isPending || imageMutation.isPending;

  function onFile(file: File | undefined) {
    if (!file) return;
    if (file.size > 6_000_000) {
      toast.error("Image must be under 6 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const image = String(reader.result);
      setMessages((m) => [
        ...m,
        { role: "user", content: input.trim() || "Identify this component.", image },
      ]);
      setInput("");
      imageMutation.mutate(image);
    };
    reader.readAsDataURL(file);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
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
      <div className="glass flex h-[68vh] flex-col p-4 text-[1.2rem] leading-relaxed sm:p-6">
        <div className="flex-1 space-y-5 overflow-y-auto pr-1">
          {messages.map((m, i) => (
            <div key={i} className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                {m.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
              </span>
              <div
                className={cn(
                  "min-w-0 rounded-2xl border border-border px-4 py-3 text-[1.05rem]",
                  m.role === "user"
                    ? "bg-primary/10 text-foreground"
                    : "bg-card/60 text-muted-foreground",
                )}
              >
                {m.image ? (
                  <img
                    src={m.image}
                    alt="Uploaded component"
                    className="mb-2 max-h-56 rounded-lg border border-border"
                  />
                ) : null}
                <p className="whitespace-pre-wrap">{m.content}</p>
              </div>
            </div>
          ))}
          {busy ? (
            <p className="flex items-center gap-2 text-[1.05rem] text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />{" "}
              {imageMutation.isPending ? "Riya is inspecting your photo…" : "Riya is thinking…"}
            </p>
          ) : null}
        </div>

        <form onSubmit={submit} className="mt-4 space-y-3 border-t border-border pt-4">
          <Textarea
            value={input}
            rows={3}
            maxLength={1000}
            placeholder="Ask about your circuit, or add a note for the photo…"
            className="min-h-[96px] text-[1.05rem]"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) submit(e);
            }}
          />
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled={busy}
              onClick={() => cameraRef.current?.click()}
            >
              <Camera className="h-5 w-5" /> Take photo
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled={busy}
              onClick={() => galleryRef.current?.click()}
            >
              <ImagePlus className="h-5 w-5" /> Upload image
            </Button>
            <Button type="submit" size="lg" className="ml-auto" disabled={!input.trim() || busy}>
              <Send className="h-5 w-5" /> Send
            </Button>
          </div>
          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              onFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
          <input
            ref={galleryRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              onFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </form>
      </div>
    </PageShell>
  );
}
