import { useServerFn } from "@tanstack/react-start";
import { useEffect } from "react";

import { getEntitlements } from "@/lib/hub.functions";
import { setPremium, useMember } from "@/lib/session";

/** Keeps the browser's premium flags in sync with owner-approved payments on the server. */
export function PremiumSync() {
  const member = useMember();
  const fetchEnt = useServerFn(getEntitlements);
  useEffect(() => {
    if (!member?.token) {
      setPremium({ analysis: false, viva: false });
      return;
    }
    fetchEnt({ data: { token: member.token } })
      .then((ent) => setPremium(ent))
      .catch(() => undefined);
  }, [member?.token, fetchEnt]);
  return null;
}
