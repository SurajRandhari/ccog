import { z } from "zod";

export const downloadSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().min(1, "Description is required"),
  fileUrl: z.string().url("Invalid file URL"),
  fileType: z.string().min(1, "File type is required"),
  fileSizeBytes: z.number().positive("File size must be positive"),
  thumbnailUrl: z.string().url().nullable().optional(),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["draft", "published"]).default("draft"),
});

export type DownloadInput = z.infer<typeof downloadSchema>;
