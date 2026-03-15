import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IDownload extends Document {
  title: string;
  description: string;
  fileUrl: string;
  fileType: string;
  fileSizeBytes: number;
  thumbnailUrl: string | null;
  category: string;
  downloadCount: number;
  status: "draft" | "published";
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const downloadSchema = new Schema<IDownload>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, trim: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true, trim: true },
    fileSizeBytes: { type: Number, required: true },
    thumbnailUrl: { type: String, default: null },
    category: { type: String, required: true, trim: true },
    downloadCount: { type: Number, default: 0 },
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

downloadSchema.index({ status: 1, category: 1 });
downloadSchema.index({ status: 1, createdAt: -1 });

const Download: Model<IDownload> =
  mongoose.models.Download ||
  mongoose.model<IDownload>("Download", downloadSchema);

export default Download;
