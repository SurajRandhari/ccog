import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  location: string;
  date: Date;
  time: string;
  image: string;
  category: string;
  status: "draft" | "published";
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, unique: true, trim: true },
    description: { type: String, required: true },
    location: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    time: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    category: { type: String, required: true, default: "General" },
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

eventSchema.index({ slug: 1 }, { unique: true });
eventSchema.index({ status: 1, startDate: 1 });
eventSchema.index({ category: 1, status: 1 });

const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", eventSchema);

export default Event;
