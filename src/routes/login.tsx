import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { PageShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const safeNext = (n?: string) => (n && n.startsWith("/") && !n.startsWith("//") ? n : "/");

export const Route = createFileRoute("/login")({
  ssr: false,
  validateSearch: z.object({ next: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "AI Assistant Sign-In — RiyasTech Hub" },
      { name: "description", content: "Sign in with email or Google to connect ChatGPT or Claude to RiyasTech Hub." },
      { property: "og:title", content: "AI Assistant Sign-In — RiyasTech Hub" },
      { property: "og:description", content: "Secure sign-in for AI assistant connections." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { next } = Route.useSearch();
  const target = safeNext(next);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"in" | "up">("in");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const go = () => { window.location.href = target; };
    supabase.auth.getSession().then(({ data }) => { if (data.session) go(); });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => { if (s) go(); });
    return () => data.subscription.unsubscribe();
  }, [target]);

  async function submit() {
    setBusy(true);
    const res = mode === "in"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + target } });
    setBusy(false);
    if (res.error) { toast.error(res.error.message); return; }
    if (mode === "up" && !res.data.session) toast.success("Check your email to confirm your account.");
  }

  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + target });
    if (r.error) toast.error(String((r.error as Error).message ?? r.error));
  }

  return (
    <PageShell eyebrow="AI assistant access" title={mode === "in" ? "Sign in" : "Create account"} description="Used only to connect ChatGPT or Claude to RiyasTech Hub." className="max-w-md">
      <div className="glass grid gap-4 p-6">
        <Button variant="outline" onClick={google}>Continue with Google</Button>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button disabled={busy || !email || password.length < 6} onClick={submit}>
          {mode === "in" ? "Sign in" : "Sign up"}
        </Button>
        <button className="text-sm text-muted-foreground underline" onClick={() => setMode(mode === "in" ? "up" : "in")}>
          {mode === "in" ? "No account? Sign up" : "Have an account? Sign in"}
        </button>
      </div>
    </PageShell>
  );
}
