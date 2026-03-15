import { z } from "zod";

export const sermonSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  slug: z.string().optional(),
  series: z.string().nullable().optional(),
  preacher: z.string().min(1, "Preacher is required"),
  description: z.string().min(1, "Description is required"),
  scripture: z.string().nullable().optional(),
  videoUrl: z.string().url("Invalid video URL"),
  thumbnailUrl: z.string().url("Invalid thumbnail URL"),
  duration: z.number().nullable().optional(),
  publishedAt: z.coerce.date().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  tags: z.array(z.string()).default([]),
});

export type SermonInput = z.infer<typeof sermonSchema>;
