import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ISong extends Document {
  title: string;
  slug: string;
  songNumber?: string | null;
  lyrics: string | null;
  language: "Hindi" | "English" | "Odia";
  author: string | null;
  category: "worship" | "praise" | "traditional";
  status: "draft" | "published";
  isLive?: boolean;
  tags: string[];
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const songSchema = new Schema<ISong>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, unique: true, trim: true },
    songNumber: { type: String, trim: true, default: null },
    lyrics: { type: String, required: true },
    language: { 
      type: String, 
      required: true, 
      enum: ["Hindi", "English", "Odia"],
      default: "English",
      trim: true 
    },
    author: { type: String, required: true, default: "Unknown", trim: true },
    category: { 
      type: String, 
      required: true, 
      enum: ["worship", "praise", "traditional"],
      default: "worship",
      trim: true 
    },
    tags: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
      required: true,
    },
    isLive: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

songSchema.index({ slug: 1 }, { unique: true });
songSchema.index({ status: 1, title: 1 });
songSchema.index({ language: 1 });
songSchema.index({ tags: 1 });

const Song: Model<ISong> =
  mongoose.models.Song || mongoose.model<ISong>("Song", songSchema);

export default Song;
