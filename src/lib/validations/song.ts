import { z } from "zod";

export const songSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  slug: z.string().optional(),
  artist: z.string().nullable().optional(),
  lyrics: z.string().nullable().optional(),
  audioUrl: z.string().url().nullable().optional(),
  chordsUrl: z.string().url().nullable().optional(),
  language: z.string().min(1, "Language is required").default("English"),
  tags: z.array(z.string()).default([]),
  status: z.enum(["draft", "published"]).default("draft"),
});

export type SongInput = z.infer<typeof songSchema>;
