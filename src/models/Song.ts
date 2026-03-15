import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ISong extends Document {
  title: string;
  slug: string;
  songNumber: string | null;
  author: string | null;
  lyrics: string | null;
  category: string;
  language: string;
  tags: string[];
  status: "draft" | "published";
  isLive: boolean;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const songSchema = new Schema<ISong>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, unique: true, trim: true },
    songNumber: { type: String, default: null, trim: true },
    author: { type: String, default: null, trim: true },
    lyrics: { type: String, default: null },
    category: { type: String, required: true, default: "Worship", trim: true },
    language: { type: String, required: true, default: "English", trim: true },
    tags: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ["draft", "published"],
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
