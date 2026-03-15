import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IEvent extends Document {
  title: string;
  slug: string;
  type: "regular" | "upcoming";
  description: string;
  startDate: Date;
  endDate: Date | null;
  time: string;
  location: string | null;
  imageUrl: string | null;
  isRecurring: boolean;
  recurrencePattern: string | null;
  status: "draft" | "published";
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, unique: true, trim: true },
    type: {
      type: String,
      enum: ["regular", "upcoming"],
      required: true,
    },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, default: null },
    time: { type: String, required: true, trim: true },
    location: { type: String, default: null, trim: true },
    imageUrl: { type: String, default: null },
    isRecurring: { type: Boolean, default: false },
    recurrencePattern: { type: String, default: null, trim: true },
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

eventSchema.index({ slug: 1 }, { unique: true });
eventSchema.index({ status: 1, startDate: 1 });
eventSchema.index({ type: 1, status: 1 });

const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", eventSchema);

export default Event;
