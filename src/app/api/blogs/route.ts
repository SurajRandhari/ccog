import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import slugify from "slugify";
import { logActivity } from "@/lib/audit";

// GET /api/blogs - Fetch all blogs
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const tag = searchParams.get("tag") || "";
    const search = searchParams.get("search") || "";
    const isAdmin = req.headers.get("x-user-role") === "admin" || req.headers.get("x-user-role") === "editor";

    // Public gets only published, Admin/Editor gets all
    const query: any = isAdmin ? {} : { published: true };

    if (tag) {
      query.tags = tag;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } }
      ];
    }

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments(query);

    return NextResponse.json({ 
      success: true, 
      data: blogs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST /api/blogs - Create a new blog
export async function POST(req: NextRequest) {
  try {
    const adminId = req.headers.get("x-user-id");
    const adminEmail = req.headers.get("x-user-email");

    await connectDB();
    const body = await req.json();
    
    if (!body.title || !body.content) {
      return NextResponse.json({ success: false, message: "Title and content are required" }, { status: 400 });
    }

    const slug = body.slug || slugify(body.title, { lower: true, strict: true });
    
    const blog = await Blog.create({ 
      ...body, 
      slug, 
      createdBy: adminId || "60d5f9b4f1b2c34d5e6f7a8b" 
    });

    // Log Activity
    if (adminId && adminEmail) {
      await logActivity({
        userId: adminId,
        userEmail: adminEmail,
        action: "created_blog",
        entityType: "blog",
        entityId: blog._id.toString(),
        details: `Created blog: ${blog.title}`,
      });
    }

    return NextResponse.json({ success: true, data: blog }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
