import { z } from "zod";

export const presignedUrlSchema = z.object({
  filename: z.string().min(1),
  contentType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  fileSize: z.number().int().max(5 * 1024 * 1024, "Máximo 5MB"),
});

export const confirmUploadSchema = z.object({
  key: z.string().min(1),
});

export type PresignedUrlInput = z.infer<typeof presignedUrlSchema>;
export type ConfirmUploadInput = z.infer<typeof confirmUploadSchema>;
