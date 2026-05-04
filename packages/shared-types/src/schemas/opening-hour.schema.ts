import { z } from "zod";

export const openingHourSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  openTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato debe ser HH:MM"),
  closeTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato debe ser HH:MM"),
  isClosed: z.boolean().default(false),
});

export const updateOpeningHoursSchema = z.object({
  hours: z.array(openingHourSchema).length(7),
});

export type OpeningHourInput = z.infer<typeof openingHourSchema>;
export type UpdateOpeningHoursInput = z.infer<typeof updateOpeningHoursSchema>;
