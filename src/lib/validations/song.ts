import { z } from "zod";

export const songSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  slug: z.string().optional(),
  songNumber: z.string().nullable().optional(),
  author: z.string().nullable().optional(),
  lyrics: z.string().nullable().optional(),
  category: z.string().min(1, "Category is required").default("Worship"),
  language: z.string().min(1, "Language is required").default("English"),
  tags: z.array(z.string()).default([]),
  status: z.enum(["draft", "published"]).default("draft"),
  isLive: z.boolean().default(false),
});

export type SongInput = z.infer<typeof songSchema>;
