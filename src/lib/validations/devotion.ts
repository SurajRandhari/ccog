import { z } from "zod";

export const devotionSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  slug: z.string().optional(),
  date: z.coerce.date(),
  scripture: z.string().min(1, "Scripture reference is required"),
  content: z.string().min(1, "Content is required"),
  author: z.string().min(1, "Author is required"),
  status: z.enum(["draft", "published"]).default("draft"),
});

export type DevotionInput = z.infer<typeof devotionSchema>;
