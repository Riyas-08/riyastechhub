import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ExternalLink, Loader2, Mail, Star, Youtube } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { submitFeedback } from "@/lib/hub.functions";
import { useMember } from "@/lib/session";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/connect")({
  head: () => ({
    meta: [
      { title: "Learn, Rate & Contact — RiyasTech Hub" },
      {
        name: "description",
        content:
          "Curated electronics YouTube channels, rate RiyasTech Hub and reach Riyas U directly by email.",
      },
      { property: "og:title", content: "Learn, Rate & Contact — RiyasTech Hub" },
      { property: "og:description", content: "Learning channels, ratings and direct contact." },
    ],
  }),
  component: ConnectPage,
});

const CHANNELS = [
  { name: "GreatScott!", topic: "Practical electronics builds and teardowns", url: "https://www.youtube.com/@greatscottlab" },
  { name: "ElectroBOOM", topic: "Circuit theory explained through spectacular failures", url: "https://www.youtube.com/@ElectroBOOM" },
  { name: "Andreas Spiess", topic: "IoT, ESP32, LoRa and sensor deep dives", url: "https://www.youtube.com/@AndreasSpiess" },
  { name: "Electronics Hub Tamil", topic: "Tamil-language electronics and Arduino tutorials", url: "https://www.youtube.com/results?search_query=electronics+tamil+arduino" },
  { name: "Phil's Lab", topic: "Professional PCB design and hardware layout", url: "https://www.youtube.com/@PhilsLab" },
  { name: "How To Mechatronics", topic: "Robotics, motors and mechanism projects", url: "https://www.youtube.com/@HowToMechatronics" },
];

function ConnectPage() {
  const member = useMember();
  const send = useServerFn(submitFeedback);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);

  const mutation = useMutation({
    mutationFn: () =>
      send({ data: { memberId: member?.id ?? null, rating, message: message.trim() } }),
    onSuccess: () => {
      setDone(true);
      toast.success("Thanks for the feedback!");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <PageShell
      eyebrow="Step 10 of 10"
      title="Learning, Rating & Contact"
      description="Keep levelling up your hardware skills, then tell us how RiyasTech Hub can get better."
    >
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CHANNELS.map((c) => (
          <a
            key={c.name}
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            className="glass card-hover block p-5"
          >
            <span className="flex items-center gap-2 text-primary">
              <Youtube className="h-5 w-5 shrink-0" />
              <span className="min-w-0 truncate font-display font-semibold">{c.name}</span>
              <ExternalLink className="ml-auto h-3.5 w-3.5 shrink-0" />
            </span>
            <p className="mt-2 text-sm text-muted-foreground">{c.topic}</p>
          </a>
        ))}
      </section>

      <section className="glass mt-8 p-6">
        <h2 className="font-display text-lg font-semibold">Rate RiyasTech Hub</h2>
        <div className="mt-3 flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              aria-label={`${n} star`}
              onClick={() => setRating(n)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={cn(
                  "h-8 w-8",
                  n <= rating ? "fill-primary text-primary" : "text-muted-foreground",
                )}
              />
            </button>
          ))}
        </div>
        <Textarea
          rows={4}
          maxLength={1500}
          className="mt-4"
          value={message}
          placeholder="What worked well? What should improve?"
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button
          className="mt-3"
          disabled={rating === 0 || mutation.isPending || done}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {done ? "Feedback submitted" : "Submit rating"}
        </Button>
      </section>

      <section className="glass mt-6 p-6">
        <h2 className="font-display text-lg font-semibold">Contact</h2>
        <a
          href="mailto:riyasusman2008@gmail.com"
          className="mt-3 inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <Mail className="h-4 w-4" /> riyasusman2008@gmail.com
        </a>
      </section>
    </PageShell>
  );
}