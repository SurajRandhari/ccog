import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPrayerRequest extends Document {
  name: string;
  email: string;
  request: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const prayerRequestSchema = new Schema<IPrayerRequest>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    request: { type: String, required: true },
    isPublic: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const PrayerRequest: Model<IPrayerRequest> =
  mongoose.models.PrayerRequest || mongoose.model<IPrayerRequest>("PrayerRequest", prayerRequestSchema);

export default PrayerRequest;
