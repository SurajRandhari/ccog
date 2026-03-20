import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IComment extends Document {
  blogId: Types.ObjectId;
  name: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    blogId: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
    name: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  }
);

commentSchema.index({ blogId: 1, createdAt: -1 });

const Comment: Model<IComment> =
  mongoose.models.Comment || mongoose.model<IComment>("Comment", commentSchema);

export default Comment;
