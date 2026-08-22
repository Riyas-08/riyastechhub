import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  analyzeHardwareProject,
  generateViva,
  identifyComponentImage,
  riyaChat,
  troubleshootQuery,
} from "./ai.server";

export const identifyComponent = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        image: z
          .string()
          .max(8_000_000)
          .refine((v) => v.startsWith("data:image/"), "Upload a valid image"),
        note: z.string().trim().max(500).default(""),
      })
      .parse(d),
  )
  .handler(async ({ data }) => identifyComponentImage(data.image, data.note));

export const analyzeProject = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        title: z.string().trim().min(3).max(200),
        description: z.string().trim().max(4000).default(""),
      })
      .parse(d),
  )
  .handler(async ({ data }) => analyzeHardwareProject(data.title, data.description));

export const buildVivaBank = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        title: z.string().trim().min(3).max(200),
        description: z.string().trim().max(4000),
        count: z.number().int().min(20).max(100),
      })
      .parse(d),
  )
  .handler(async ({ data }) => generateViva(data.title, data.description, data.count));

export const askTroubleshooter = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        query: z.string().trim().min(3).max(2000),
        context: z.string().trim().max(2000).default(""),
      })
      .parse(d),
  )
  .handler(async ({ data }) => troubleshootQuery(data.query, data.context));

export const askRiya = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        messages: z
          .array(
            z.object({
              role: z.enum(["user", "assistant"]),
              content: z.string().trim().min(1).max(4000),
            }),
          )
          .min(1)
          .max(24),
        context: z.string().trim().max(2000).default(""),
      })
      .parse(d),
  )
  .handler(async ({ data }) => riyaChat(data.messages, data.context));