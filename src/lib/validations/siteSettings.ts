import { z } from "zod";

const serviceTimeSchema = z.object({
  label: z.string().min(1, "Label is required"),
  time: z.string().min(1, "Time is required"),
});

const socialLinksSchema = z.object({
  facebook: z.string().url().nullable().optional(),
  youtube: z.string().url().nullable().optional(),
  instagram: z.string().url().nullable().optional(),
  whatsapp: z.string().url().nullable().optional(),
});

export const siteSettingsSchema = z.object({
  churchName: z.string().min(1, "Church name is required"),
  tagline: z.string().min(1, "Tagline is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email"),
  mapEmbedUrl: z.string().url("Invalid map URL").optional(),
  serviceTimes: z.array(serviceTimeSchema).default([]),
  socialLinks: socialLinksSchema.optional(),
  pastorName: z.string().min(1, "Pastor name is required"),
  pastorBio: z.string().optional(),
  pastorImageUrl: z.string().url().nullable().optional(),
  churchHistoryContent: z.string().optional(),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
