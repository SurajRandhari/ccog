import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Comment from "@/models/Comment";
import Blog from "@/models/Blog";
import mongoose from "mongoose";

// GET /api/blogs/[id]/comments - Fetch comments for a blog post
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    // Find the blog first to handle both ID and Slug
    const blog = await Blog.findOne({
      $or: [
        { _id: mongoose.isValidObjectId(id) ? id : null },
        { slug: id }
      ]
    });

    if (!blog) {
      return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    }

    const comments = await Comment.find({ blogId: blog._id }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: comments });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST /api/blogs/[id]/comments - Post a new comment
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const body = await req.json();
    const { name, content } = body;

    if (!name || !content) {
      return NextResponse.json({ success: false, message: "Name and content are required" }, { status: 400 });
    }

    // Find the blog first to handle both ID and Slug
    const blog = await Blog.findOne({
      $or: [
        { _id: mongoose.isValidObjectId(id) ? id : null },
        { slug: id }
      ]
    });

    if (!blog) {
      return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    }

    const comment = await Comment.create({
      blogId: blog._id,
      name,
      content,
    });

    return NextResponse.json({ success: true, data: comment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
