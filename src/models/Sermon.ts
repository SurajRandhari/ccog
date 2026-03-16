import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ISermon extends Document {
  title: string;
  slug: string;
  speaker: string;
  description: string;
  videoUrl: string;
  date: Date;
  tags: string[];
  status: "draft" | "published";
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const sermonSchema = new Schema<ISermon>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, unique: true, trim: true },
    speaker: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    videoUrl: { type: String, required: true },
    date: { type: Date, default: Date.now },
    tags: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
      required: true,
    },
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
