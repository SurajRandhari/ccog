import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  slug: z.string().optional(),
  excerpt: z
    .string()
    .min(1, "Excerpt is required")
    .max(300, "Excerpt must be under 300 characters"),
  content: z.string().min(1, "Content is required"),
  coverImageUrl: z.string().url().nullable().optional(),
  author: z.string().min(1, "Author is required"),
  authorImageUrl: z.string().url().nullable().optional(),
  tags: z.array(z.string()).default([]),
  status: z.enum(["draft", "published"]).default("draft"),
  publishedAt: z.coerce.date().nullable().optional(),
});

export type PostInput = z.infer<typeof postSchema>;
