import { z } from "zod";

export const trackEventSchema = z.object({
  businessId: z.string().min(1),
  eventName: z.string().min(1),
  entityType: z.string().optional(),
  entityId: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
  sessionId: z.string().optional(),
});

export const analyticsSummarySchema = z.object({
  visitsToday: z.number(),
  visitsLast7Days: z.number(),
  visitsLast30Days: z.number(),
  whatsappClicks: z.number(),
  ordersStarted: z.number(),
});

export const topProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  count: z.number(),
});

export const hourlyVisitSchema = z.object({
  hour: z.number().int().min(0).max(23),
  dayOfWeek: z.number().int().min(0).max(6),
  count: z.number(),
});

export const dailyVisitSchema = z.object({
  date: z.string(),
  count: z.number(),
});

export type TrackEventInput = z.infer<typeof trackEventSchema>;
export type AnalyticsSummary = z.infer<typeof analyticsSummarySchema>;
export type TopProduct = z.infer<typeof topProductSchema>;
export type HourlyVisit = z.infer<typeof hourlyVisitSchema>;
export type DailyVisit = z.infer<typeof dailyVisitSchema>;
