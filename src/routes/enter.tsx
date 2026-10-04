import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { PageShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sendOtp, verifyOtp } from "@/lib/hub.functions";
import { setMember } from "@/lib/session";
import { DISTRICTS } from "@/lib/vendors";

export const Route = createFileRoute("/enter")({
  validateSearch: z.object({ ref: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Secure Sign-In — RiyasTech Hub" },
      {
        name: "description",
        content:
          "Verify your mobile number with a server-generated OTP and select your district to enter RiyasTech Hub.",
      },
      { property: "og:title", content: "Secure Sign-In — RiyasTech Hub" },
      { property: "og:description", content: "OTP-verified access to the hardware platform." },
    ],
  }),
  component: EnterPage,
});

function EnterPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/enter" });
  const send = useServerFn(sendOtp);
  const verify = useServerFn(verifyOtp);

  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [district, setDistrict] = useState("");
  const [code, setCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);

  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const mobileValid = /^[6-9]\d{9}$/.test(mobile) && mobile.length === 10;
  const canSend =
    username.trim().length >= 2 && mobileValid && district !== "" && cooldown === 0;

  const sendMutation = useMutation({
    mutationFn: () => {
      if (!mobileValid) throw new Error("Enter exactly 10 digits.");
      return send({ data: { mobile } });
    },
    onSuccess: (res) => {
      setOtpSent(true);
      setVerified(false);
      setCode("");
      setCooldown(40);
      toast.success(`OTP sent to +91 ${mobile}`, {
        description: `No SMS gateway is connected yet, so your verification code is: ${res.code}`,
        duration: 15000,
      });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const verifyMutation = useMutation({
    mutationFn: () =>
      verify({
        data: {
          mobile,
          code,
          username: username.trim(),
          district,
          ...(search.ref ? { referralCode: search.ref } : {}),
        },
      }),
    onSuccess: (res) => {
      if (!res.ok) {
        toast.error(res.reason);
        return;
      }
      setVerified(true);
      setMember(res.member);
      toast.success("Mobile number verified");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <PageShell
      eyebrow="Step 2 of 10"
      title="Secure Sign-In"
      description="Every account is gated by a real, server-generated one-time code. Nothing can be bypassed from the browser."
      className="max-w-2xl"
    >
      <div className="glass p-6 sm:p-8">
        <div className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              maxLength={60}
              placeholder="Your name"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="mobile">Mobile Number</Label>
            <div className="flex items-center gap-2">
              <span className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground">
                +91
              </span>
              <Input
                id="mobile"
                inputMode="numeric"
                value={mobile}
                placeholder="10-digit number"
                maxLength={10}
                onChange={(e) => {
                  setMobile(e.target.value.replace(/\D/g, "").slice(0, 10));
                  setOtpSent(false);
                  setVerified(false);
                }}
              />
            </div>
            {mobile && !mobileValid ? (
              <p className="text-xs text-destructive">
                Enter exactly 10 digits starting with 6, 7, 8 or 9.
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">{mobile.length}/10 digits</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="district">District</Label>
            <Select value={district} onValueChange={setDistrict}>
              <SelectTrigger id="district">
                <SelectValue placeholder="Select your district" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {DISTRICTS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            disabled={!canSend || sendMutation.isPending || verified}
            onClick={() => sendMutation.mutate()}
          >
            {sendMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {otpSent
              ? cooldown > 0
                ? `Resend OTP in ${cooldown}s`
                : "Resend OTP"
              : cooldown > 0
                ? `Send OTP in ${cooldown}s`
                : "Send OTP"}
          </Button>

          {otpSent ? (
            <div className="grid gap-2">
              <Label htmlFor="otp">Enter OTP</Label>
              <div className="flex gap-2">
                <Input
                  id="otp"
                  inputMode="numeric"
                  value={code}
                  placeholder="6-digit code"
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                />
                <Button
                  disabled={code.length !== 6 || verifyMutation.isPending || verified}
                  onClick={() => verifyMutation.mutate()}
                >
                  {verifyMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="h-4 w-4" />
                  )}
                  Verify
                </Button>
              </div>
            </div>
          ) : null}

          {verified ? (
            <p className="flex items-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm text-primary">
              <CheckCircle2 className="h-4 w-4" /> Verified. You can continue.
            </p>
          ) : null}

          <Button
            size="lg"
            disabled={!verified}
            onClick={() => navigate({ to: "/profile" })}
            className="text-neon-foreground disabled:opacity-40"
            style={verified ? { backgroundImage: "var(--gradient-neon)" } : undefined}
          >
            Proceed
          </Button>
          {!verified ? (
            <p className="text-center text-xs text-muted-foreground">
              Proceed unlocks only after the OTP is verified on the server and a district is chosen.
            </p>
          ) : null}
        </div>
      </div>
    </PageShell>
  );
}