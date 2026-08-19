import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  adminOverview,
  confirmOtp,
  issueOtp,
  referralHub,
  saveAcademics,
  storeFeedback,
  storeProject,
} from "./hub.server";

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
  .handler(async ({ data }) => confirmOtp(data));

export const updateAcademics = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        memberId: z.string().uuid(),
        department: z.string().trim().min(2).max(60),
        yearOfStudy: z.string().trim().min(1).max(40),
      })
      .parse(d),
  )
  .handler(async ({ data }) => saveAcademics(data));

export const getReferralHub = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ memberId: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => referralHub(data.memberId));

export const getAdminOverview = createServerFn({ method: "GET" }).handler(async () =>
  adminOverview(),
);

export const saveProject = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        memberId: z.string().uuid().nullable(),
        title: z.string().trim().min(2).max(200),
        description: z.string().trim().max(4000),
        components: z.unknown(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    await storeProject(data);
    return { ok: true as const };
  });

export const submitFeedback = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        memberId: z.string().uuid().nullable(),
        rating: z.number().int().min(1).max(5),
        message: z.string().trim().max(1500),
      })
      .parse(d),
  )
  .handler(async ({ data }) => storeFeedback(data));