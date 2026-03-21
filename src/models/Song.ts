import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ISong extends Document {
  songNo: number | null;
  title: string;
  slug: string;
  language: "Hindi" | "English" | "Odia";
  category: "Worship" | "Praise" | "Christmas" | "Lent" | "Hymn" | "Special Songs";
  lyrics: string;
  author?: string;
  isPublished: boolean;
  status: "active" | "deleted";
  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const songSchema = new Schema<ISong>(
  {
    songNo: { type: Number, default: null },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, unique: true, trim: true },
    language: {
      type: String,
      required: true,
      enum: ["Hindi", "English", "Odia"],
      default: "English",
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Worship", "Praise", "Christmas", "Lent", "Hymn", "Special Songs"],
      default: "Worship",
      trim: true,
    },
    lyrics: { type: String, required: true },
    author: { type: String, trim: true, default: "" },
    isPublished: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["active", "deleted"],
      default: "active",
      required: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

// Unique indexes
songSchema.index({ slug: 1 }, { unique: true });

// Performance indexes
songSchema.index({ songNo: 1 });
songSchema.index({ language: 1, category: 1, status: 1, isPublished: 1 });
songSchema.index({ status: 1, isPublished: 1 });
songSchema.index({ language: 1 });
songSchema.index({ category: 1 });

// Text search index for fast full-text search
songSchema.index({ title: "text", lyrics: "text" });

const Song: Model<ISong> =
  mongoose.models.Song || mongoose.model<ISong>("Song", songSchema);

export default Song;
