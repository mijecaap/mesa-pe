import { z } from "zod";
import { businessThemeSchema } from "./theme.schema.js";

export const businessSlugSchema = z
  .string()
  .min(2)
  .max(50)
  .regex(/^[a-z0-9-]+$/, "El slug solo puede contener letras minúsculas, números y guiones");

export const createBusinessSchema = z.object({
  slug: businessSlugSchema,
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  whatsappNumber: z.string().min(8).max(20),
  address: z.string().max(300).optional(),
  googleMapsUrl: z.string().url().optional().or(z.literal("")),
  instagramUrl: z.string().url().optional().or(z.literal("")),
  tiktokUrl: z.string().url().optional().or(z.literal("")),
  facebookUrl: z.string().url().optional().or(z.literal("")),
  logoUrl: z.string().url().optional().or(z.literal("")),
  bannerUrl: z.string().url().optional().or(z.literal("")),
  currency: z.string().default("PEN"),
  isPublished: z.boolean().default(false),
  manualStatus: z.enum(["AUTO", "OPEN", "CLOSED"]).default("AUTO"),
  theme: businessThemeSchema.optional(),
});

export const updateBusinessSchema = createBusinessSchema.partial();

export type CreateBusinessInput = z.infer<typeof createBusinessSchema>;
export type UpdateBusinessInput = z.infer<typeof updateBusinessSchema>;
