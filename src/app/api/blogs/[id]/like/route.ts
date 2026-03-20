import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import mongoose from "mongoose";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    if (!id) {
        return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
    }

    await connectDB();

    // 1. Determine Identifier (User ID or IP)
    const userId = req.headers.get("x-user-id");
    const forwarded = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    let ip = "anonymous";
    if (forwarded) {
        ip = forwarded.split(',')[0].trim();
    } else if (realIp) {
        ip = realIp;
    }
    const identifier = userId || ip || "anonymous";

    // 2. Find the Blog using lean() to avoid model/schema caching issues
    const blog = await Blog.findOne({
      $or: [
        { _id: mongoose.isValidObjectId(id) ? id : null },
        { slug: id }
      ]
    }).lean().select('_id likedBy likes');

    if (!blog) {
      return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    }

    // 3. Determine if liked
    // Since we used .lean(), likedBy is a plain array or undefined
    const likedBy = Array.isArray(blog.likedBy) ? blog.likedBy : [];
    const hasLiked = likedBy.includes(identifier);

    // 4. Atomic Update
    const update = hasLiked 
      ? { $pull: { likedBy: identifier }, $inc: { likes: -1 } }
      : { $addToSet: { likedBy: identifier }, $inc: { likes: 1 } };

    const result = await Blog.findByIdAndUpdate(blog._id, update, { new: true, lean: true });

    if (!result) {
        return NextResponse.json({ success: false, message: "Update failed" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      likes: result.likes || 0,
      hasLiked: !hasLiked
    });
  } catch (error: any) {
    console.error(`[LIKE ERROR]`, error);
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}
