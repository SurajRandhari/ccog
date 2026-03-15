import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  slug: z.string().optional(),
  type: z.enum(["regular", "upcoming"]),
  description: z.string().min(1, "Description is required"),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable().optional(),
  time: z.string().min(1, "Time is required"),
  location: z.string().nullable().optional(),
  imageUrl: z.string().url().nullable().optional(),
  isRecurring: z.boolean().default(false),
  recurrencePattern: z.string().nullable().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
});

export type EventInput = z.infer<typeof eventSchema>;
