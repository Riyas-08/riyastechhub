// Signed member session tokens: proves the caller completed OTP verification for a member.
const TTL_MS = 30 * 24 * 60 * 60 * 1000;
const enc = new TextEncoder();

function b64url(bytes: ArrayBuffer) {
  let s = "";
  for (const b of new Uint8Array(bytes)) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function key() {
  const secret = process.env["MEMBER_SESSION_SECRET"];
  if (!secret) throw new Error("Member sessions are not configured");
  return crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
  ]);
}

async function sign(payload: string) {
  return b64url(await crypto.subtle.sign("HMAC", await key(), enc.encode(payload)));
}

export async function issueMemberToken(memberId: string) {
  const payload = `${memberId}.${Date.now() + TTL_MS}`;
  return `${payload}.${await sign(payload)}`;
}

export async function verifyMemberToken(token: string | null | undefined): Promise<string | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [id, exp, sig] = parts as [string, string, string];
  if (!/^[0-9a-f-]{36}$/i.test(id) || !(Number(exp) > Date.now())) return null;
  const expected = await sign(`${id}.${exp}`);
  if (expected.length !== sig.length) return null;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  return diff === 0 ? id : null;
}

export async function requireMember(token: string | null | undefined) {
  const id = await verifyMemberToken(token);
  if (!id) throw new Error("Your session has expired. Please sign in again.");
  return id;
}

/** Signature for the one-click payment approval link sent to the owner's private Slack channel. */
export async function paymentApprovalSig(paymentId: string) {
  return sign(`approve-payment:${paymentId}`);
}

export async function verifyPaymentApprovalSig(paymentId: string, sig: string) {
  const expected = await paymentApprovalSig(paymentId);
  if (expected.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  return diff === 0;
}
