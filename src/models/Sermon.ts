import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ISermon extends Document {
  title: string;
  slug: string;
  series: string | null;
  preacher: string;
  description: string;
  scripture: string | null;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number | null;
  publishedAt: Date;
  status: "draft" | "published";
  tags: string[];
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const sermonSchema = new Schema<ISermon>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, unique: true, trim: true },
    series: { type: String, default: null, trim: true },
    preacher: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    scripture: { type: String, default: null, trim: true },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    duration: { type: Number, default: null },
    publishedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      required: true,
    },
    tags: [{ type: String, trim: true }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

sermonSchema.index({ slug: 1 }, { unique: true });
sermonSchema.index({ status: 1, publishedAt: -1 });
sermonSchema.index({ series: 1 });
sermonSchema.index({ tags: 1 });

const Sermon: Model<ISermon> =
  mongoose.models.Sermon || mongoose.model<ISermon>("Sermon", sermonSchema);

export default Sermon;
