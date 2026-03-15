import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string | null;
  author: string;
  authorImageUrl: string | null;
  tags: string[];
  status: "draft" | "published";
  publishedAt: Date | null;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, unique: true, trim: true },
    excerpt: { type: String, required: true, trim: true, maxlength: 300 },
    content: { type: String, required: true },
    coverImageUrl: { type: String, default: null },
    author: { type: String, required: true, trim: true },
    authorImageUrl: { type: String, default: null },
    tags: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      required: true,
    },
    publishedAt: { type: Date, default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

postSchema.index({ slug: 1 }, { unique: true });
postSchema.index({ status: 1, publishedAt: -1 });
postSchema.index({ tags: 1 });

const Post: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>("Post", postSchema);

export default Post;
