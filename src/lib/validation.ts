import { z } from "zod";
import { normalizePkPhone } from "@/lib/format";

const phone = z
  .string()
  .trim()
  .min(1, "Phone / WhatsApp number is required")
  .transform((v, ctx) => {
    const normalized = normalizePkPhone(v);
    if (!normalized) {
      ctx.addIssue({ code: "custom", message: "Enter a valid Pakistani mobile number, e.g. 0300 1234567" });
      return z.NEVER;
    }
    return normalized;
  });

const name = z.string().trim().min(2, "Please enter your full name").max(80);
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined));

const email = z
  .string()
  .trim()
  .max(120)
  .optional()
  .transform((v) => (v ? v : undefined))
  .refine((v) => !v || z.email().safeParse(v).success, "Enter a valid email address");

const hp = z.string().max(200).optional(); // honeypot: real users leave it empty (route silently drops filled ones)

export const visitSchema = z.object({
  type: z.literal("visit"),
  name,
  phone,
  area: z.string().trim().min(2, "Tell us your Lahore area / sector").max(120),
  date: z.string().trim().max(20).optional(),
  window: z.string().trim().max(60).optional(),
  message: optionalText(1000),
  hp,
});

export const messageSchema = z.object({
  type: z.literal("message"),
  name,
  phone,
  email,
  message: z.string().trim().min(5, "Please describe your project").max(2000),
  hp,
});

export const quoteSchema = z.object({
  type: z.literal("quote"),
  name,
  phone,
  email,
  area: z.string().trim().min(2, "Tell us your site location / sub-division").max(160),
  scope: z.string().trim().min(2, "Select the surface scope").max(120),
  texture: z.string().trim().min(2, "Select a texture").max(80),
  areaSqft: z.number().positive().max(200_000),
  estimate: z.number().nonnegative().max(500_000_000).optional(),
  date: z.string().trim().max(20).optional(),
  window: z.string().trim().max(60).optional(),
  message: optionalText(1000),
  hp,
});

export const leadSchema = z.discriminatedUnion("type", [visitSchema, messageSchema, quoteSchema]);

export type LeadInput = z.input<typeof leadSchema>;
export type LeadOutput = z.output<typeof leadSchema>;
