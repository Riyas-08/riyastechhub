import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  adminOverview,
  confirmOtp,
  entitlements,
  issueOtp,
  recordPayment,
  referralHub,
  saveAcademics,
  storeFeedback,
  storeProject,
} from "./hub.server";
import { issueMemberToken, requireMember, verifyMemberToken } from "./member-token.server";

const token = z.string().max(500).nullable();

export const sendOtp = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ mobile: z.string().trim().regex(/^[6-9]\d{9}$/) }).parse(d),
  )
  .handler(async ({ data }) => issueOtp(data.mobile));

export const verifyOtp = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        mobile: z.string().trim().regex(/^[6-9]\d{9}$/),
        code: z.string().trim().length(6),
        username: z.string().trim().min(2).max(60),
        district: z.string().trim().min(2).max(60),
        referralCode: z.string().trim().max(40).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const res = await confirmOtp(data);
    if (!res.ok) return res;
    return { ...res, member: { ...res.member, token: await issueMemberToken(res.member.id) } };
  });

export const updateAcademics = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        token: z.string().max(500),
        department: z.string().trim().min(2).max(60),
        yearOfStudy: z.string().trim().min(1).max(40),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const memberId = await requireMember(data.token);
    const updated = await saveAcademics({ memberId, department: data.department, yearOfStudy: data.yearOfStudy });
    return { ...updated, token: data.token };
  });

export const getReferralHub = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ token: z.string().max(500) }).parse(d))
  .handler(async ({ data }) => referralHub(await requireMember(data.token)));

export const getAdminOverview = createServerFn({ method: "GET" }).handler(async () =>
  adminOverview(),
);

export const saveProject = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        token,
        title: z.string().trim().min(2).max(200),
        description: z.string().trim().max(4000),
        components: z.unknown(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const memberId = await verifyMemberToken(data.token);
    await storeProject({ memberId, title: data.title, description: data.description, components: data.components });
    return { ok: true as const };
  });

export const submitFeedback = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        token,
        rating: z.number().int().min(1).max(5),
        message: z.string().trim().max(1500),
      })
      .parse(d),
  )
  .handler(async ({ data }) =>
    storeFeedback({ memberId: await verifyMemberToken(data.token), rating: data.rating, message: data.message }),
  );

export const reportPayment = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        token,
        plan: z.enum(["analysis", "viva"]),
        status: z.enum(["submitted", "proof_uploaded"]),
      })
      .parse(d),
  )
  .handler(async ({ data }) =>
    recordPayment({ memberId: await verifyMemberToken(data.token), plan: data.plan, status: data.status }),
  );

export const getEntitlements = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ token: z.string().max(500) }).parse(d))
  .handler(async ({ data }) => {
    const memberId = await verifyMemberToken(data.token);
    return memberId ? entitlements(memberId) : { analysis: false, viva: false };
  });
