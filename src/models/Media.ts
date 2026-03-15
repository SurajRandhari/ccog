import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IMedia extends Document {
  filename: string;
  cloudinaryPublicId: string;
  url: string;
  secureUrl: string;
  type: "image" | "video" | "audio" | "document";
  mimeType: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  duration: number | null;
  altText: string;
  uploadedBy: Types.ObjectId;
  createdAt: Date;
}

const mediaSchema = new Schema<IMedia>(
  {
    filename: { type: String, required: true, trim: true },
    cloudinaryPublicId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    url: { type: String, required: true },
    secureUrl: { type: String, required: true },
    type: {
      type: String,
      enum: ["image", "video", "audio", "document"],
      required: true,
    },
    mimeType: { type: String, required: true },
    sizeBytes: { type: Number, required: true },
    width: { type: Number, default: null },
    height: { type: Number, default: null },
    duration: { type: Number, default: null },
    altText: { type: String, default: "", trim: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

mediaSchema.index({ type: 1, createdAt: -1 });
mediaSchema.index({ cloudinaryPublicId: 1 }, { unique: true });
mediaSchema.index({ uploadedBy: 1 });

const Media: Model<IMedia> =
  mongoose.models.Media || mongoose.model<IMedia>("Media", mediaSchema);

export default Media;
