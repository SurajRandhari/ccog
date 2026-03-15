import mongoose, { Schema, Model } from "mongoose";

interface ServiceTime {
  label: string;
  time: string;
}

interface SocialLinks {
  facebook: string | null;
  youtube: string | null;
  instagram: string | null;
  whatsapp: string | null;
}

export interface ISiteSettings {
  _id: string;
  churchName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  mapEmbedUrl: string;
  serviceTimes: ServiceTime[];
  socialLinks: SocialLinks;
  pastorName: string;
  pastorBio: string;
  pastorImageUrl: string | null;
  churchHistoryContent: string;
  updatedAt: Date;
}

const siteSettingsSchema = new Schema(
  {
    _id: { type: String, default: "site_settings" },
    churchName: {
      type: String,
      required: true,
      default: "Calvary Church of God",
    },
    tagline: {
      type: String,
      required: true,
      default: "A community of faith, hope, and love",
    },
    address: { type: String, required: true, default: "" },
    phone: { type: String, required: true, default: "" },
    email: { type: String, required: true, default: "" },
    mapEmbedUrl: { type: String, default: "" },
    serviceTimes: [
      {
        label: { type: String, required: true },
        time: { type: String, required: true },
        _id: false,
      },
    ],
    socialLinks: {
      facebook: { type: String, default: null },
      youtube: { type: String, default: null },
      instagram: { type: String, default: null },
      whatsapp: { type: String, default: null },
    },
    pastorName: {
      type: String,
      required: true,
      default: "Rev. Suresh Randhari",
    },
    pastorBio: { type: String, default: "" },
    pastorImageUrl: { type: String, default: null },
    churchHistoryContent: { type: String, default: "" },
  },
  {
    timestamps: { createdAt: false, updatedAt: true },
  }
);

const SiteSettings: Model<ISiteSettings> =
  (mongoose.models.SiteSettings as Model<ISiteSettings>) ||
  mongoose.model<ISiteSettings>("SiteSettings", siteSettingsSchema);

export default SiteSettings;

export async function getSiteSettings(): Promise<ISiteSettings> {
  const settings = await SiteSettings.findById("site_settings");
  if (settings) return settings;

  // Create default if not exists
  return SiteSettings.create({ _id: "site_settings" });
}

