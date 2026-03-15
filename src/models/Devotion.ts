import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IDevotion extends Document {
  title: string;
  slug: string;
  date: Date;
  scripture: string;
  content: string;
  author: string;
  status: "draft" | "published";
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const devotionSchema = new Schema<IDevotion>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, unique: true, trim: true },
    date: { type: Date, required: true },
    scripture: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    author: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      required: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

devotionSchema.index({ slug: 1 }, { unique: true });
devotionSchema.index({ date: -1, status: 1 });

const Devotion: Model<IDevotion> =
  mongoose.models.Devotion ||
  mongoose.model<IDevotion>("Devotion", devotionSchema);

export default Devotion;
