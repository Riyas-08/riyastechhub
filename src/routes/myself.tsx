import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Building2,
  Calendar,
  Clock,
  Cpu,
  ExternalLink,
  MapPin,
  Phone,
  Search,
  Trash2,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { PageShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import {
  clearHistory,
  useCollege,
  useHistory,
  useHydrated,
  useMember,
} from "@/lib/session";

export const Route = createFileRoute("/myself")({
  head: () => ({
    meta: [
      { title: "Myself — RiyasTech Hub" },
      {
        name: "description",
        content:
          "Your RiyasTech Hub dashboard: sign-in details, academic profile and full project analysis history.",
      },
      { property: "og:title", content: "Myself — RiyasTech Hub" },
      { property: "og:description", content: "Your profile and project analysis history." },
    ],
  }),
  component: MyselfPage,
});

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function MyselfPage() {
  const member = useMember();
  const college = useCollege();
  const history = useHistory();
  const hydrated = useHydrated();
  const navigate = useNavigate();

  if (hydrated && !member) {
    return (
      <PageShell eyebrow="Your Dashboard" title="Myself">
        <div className="glass p-6">
          <p className="text-sm text-muted-foreground">
            Sign in with your mobile number to see your profile and analysis history.
          </p>
          <Button className="mt-4" onClick={() => navigate({ to: "/enter" })}>
            Go to Sign-In
          </Button>
        </div>
      </PageShell>
    );
  }

  const fields = [
    { icon: User, label: "Full Name", value: member?.username },
    { icon: Phone, label: "Phone Number", value: member?.mobile },
    { icon: MapPin, label: "City / ஊரு", value: member?.district },
    { icon: Building2, label: "College Name", value: college },
    { icon: BookOpen, label: "Course / Department", value: member?.department },
    { icon: Calendar, label: "Academic Year", value: member?.yearOfStudy },
    {
      icon: Clock,
      label: "Initial Sign-in",
      value: member?.signedInAt ? formatTime(member.signedInAt) : null,
    },
  ];

  return (
    <PageShell
      eyebrow="Your Dashboard"
      title="Myself"
      description="Your sign-in details and every project analysis you have run on RiyasTech Hub."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {fields.map((f) => (
          <div
            key={f.label}
            className="glass flex items-start gap-3 border-primary/20 p-4"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-primary/40 bg-primary/10 text-primary">
              <f.icon className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {f.label}
              </span>
              <span className="mt-0.5 block truncate text-sm font-medium">
                {f.value || "Not set"}
              </span>
            </span>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
          <Search className="h-5 w-5 text-primary" /> Project Analysis History
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate({ to: "/analyze" })}
          >
            <ExternalLink className="h-4 w-4" /> New analysis
          </Button>
          {history.length > 0 ? (
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => {
                clearHistory();
                toast.success("History cleared");
              }}
            >
              <Trash2 className="h-4 w-4" /> Clear history
            </Button>
          ) : null}
        </div>
      </div>

      {history.length === 0 ? (
        <div className="glass mt-4 p-6 text-sm text-muted-foreground">
          No analyses yet. Run your first hardware project analysis and it will
          appear here with its timestamp and component count.
        </div>
      ) : (
        <div className="mt-4 grid gap-3">
          {history.map((h) => (
            <div key={h.id} className="glass card-hover p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="font-display text-base font-semibold text-primary">
                  {h.title}
                </h3>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs text-primary">
                  <Cpu className="h-3.5 w-3.5" />
                  Analyzed Successfully · {h.componentCount} parts
                </span>
              </div>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                {h.query}
              </p>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> {formatTime(h.at)}
              </p>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}
