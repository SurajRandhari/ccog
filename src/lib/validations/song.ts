import { z } from "zod";

export const songSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  slug: z.string().optional(),
  songNo: z.union([z.number(), z.string(), z.null()]).optional().transform((val) => {
    if (val === null || val === undefined || val === "") return null;
    const num = Number(val);
    return isNaN(num) ? null : num;
  }),
  lyrics: z.string().min(1, "Lyrics are required"),
  category: z.string().min(1, "Category is required").default("Worship"),
  language: z.string().min(1, "Language is required").default("English"),
  author: z.string().optional().default(""),
  isPublished: z.boolean().default(false),
  status: z.enum(["active", "deleted"]).default("active"),
});

export type SongInput = z.infer<typeof songSchema>;
