import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  coverImage: string;
  author: string;
  published: boolean;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  likes: number;
  likedBy: string[]; // Store IP addresses or User IDs
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, unique: true, required: true, trim: true },
    content: { type: String, required: true },
    coverImage: { type: String, required: true },
    author: { type: String, required: true, trim: true },
    published: { type: Boolean, default: false },
    tags: [{ type: String, trim: true }],
    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: String }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

blogSchema.index({ slug: 1 }, { unique: true });
blogSchema.index({ published: 1, createdAt: -1 });

const Blog: Model<IBlog> =
  mongoose.models.Blog || mongoose.model<IBlog>("Blog", blogSchema);

export default Blog;
