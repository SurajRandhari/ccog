import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import slugify from "slugify";
import mongoose from "mongoose";
import { logActivity } from "@/lib/audit";

// GET /api/blogs/[id] - Fetch a single blog
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    
    // We can fetch by ID or Slug
    const blog = await Blog.findOne({ $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { slug: id }] });

    if (!blog) {
      return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: blog });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT /api/blogs/[id] - Update a blog
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const adminId = req.headers.get("x-user-id");
    const adminEmail = req.headers.get("x-user-email");

    await connectDB();
    const { id } = await params;
    const body = await req.json();

    if (body.title && !body.slug) {
      body.slug = slugify(body.title, { lower: true });
      if (!body.slug) {
        body.slug = `post-${Date.now()}`;
      }
    }

    const blog = await Blog.findByIdAndUpdate(id, body, { new: true, runValidators: true });

    if (!blog) {
      return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    }

    // Log Activity
    if (adminId && adminEmail) {
      await logActivity({
        userId: adminId,
        userEmail: adminEmail,
        action: "updated_blog",
        entityType: "blog",
        entityId: blog._id.toString(),
        details: `Updated blog: ${blog.title}`,
      });
    }

    return NextResponse.json({ success: true, data: blog });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE /api/blogs/[id] - Delete a blog
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const adminId = req.headers.get("x-user-id");
    const adminEmail = req.headers.get("x-user-email");

    await connectDB();
    const { id } = await params;
    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    }

    // Log Activity
    if (adminId && adminEmail) {
      await logActivity({
        userId: adminId,
        userEmail: adminEmail,
        action: "deleted_blog",
        entityType: "blog",
        entityId: id,
        details: `Deleted blog: ${blog.title}`,
      });
    }

    return NextResponse.json({ success: true, message: "Blog deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
