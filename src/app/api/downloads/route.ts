import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Download from "@/models/Download";
import { logActivity } from "@/lib/audit";

// GET /api/downloads - Fetch all downloads
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const isAdmin = req.headers.get("x-user-role") === "admin" || req.headers.get("x-user-role") === "editor";

    // Public gets only published, Admin/Editor gets all
    const query: any = isAdmin ? {} : { status: "published" };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    const downloads = await Download.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Download.countDocuments(query);

    return NextResponse.json({ 
      success: true, 
      data: downloads,
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

// POST /api/downloads - Create a new download
export async function POST(req: NextRequest) {
  try {
    const adminId = req.headers.get("x-user-id");
    const adminEmail = req.headers.get("x-user-email");

    await connectDB();
    const body = await req.json();
    
    if (!body.title || !body.fileUrl) {
      return NextResponse.json({ success: false, message: "Title and file URL are required" }, { status: 400 });
    }

    const download = await Download.create({ 
      ...body, 
      createdBy: adminId || "60d5f9b4f1b2c34d5e6f7a8b" 
    });

    // Log Activity
    if (adminId && adminEmail) {
      await logActivity({
        userId: adminId,
        userEmail: adminEmail,
        action: "created_download",
        entityType: "download",
        entityId: download._id.toString(),
        details: `Created download: ${download.title}`,
      });
    }

    return NextResponse.json({ success: true, data: download }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
