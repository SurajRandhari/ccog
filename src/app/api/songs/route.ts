import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Song from "@/models/Song";
import slugify from "slugify";
import { logActivity } from "@/lib/audit";

// GET /api/songs - Fetch all songs with filters and pagination
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const language = searchParams.get("language") || "";
    const category = searchParams.get("category") || "";
    const skip = (page - 1) * limit;

    const query: any = { status: "published" };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { lyrics: { $regex: search, $options: "i" } }
      ];
    }

    if (language) {
      query.language = language;
    }

    if (category) {
      query.category = category;
    }

    const songs = await Song.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Song.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: songs,
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

// POST /api/songs - Create a new song (Admin)
export async function POST(req: NextRequest) {
  try {
    const adminId = req.headers.get("x-user-id");
    const adminEmail = req.headers.get("x-user-email");

    await connectDB();
    const body = await req.json();
    
    // In a real app, you'd verify the user's role here
    // For now, we assume the requester is authorized or we'll add auth middleware later
    
    if (!body.title) {
      return NextResponse.json({ success: false, message: "Title is required" }, { status: 400 });
    }

    const slug = slugify(body.title, { lower: true, strict: true });
    
    const song = await Song.create({
      ...body,
      slug,
      createdBy: adminId || "60d5f9b4f1b2c34d5e6f7a8b" 
    });

    // Log Activity
    if (adminId && adminEmail) {
      await logActivity({
        userId: adminId,
        userEmail: adminEmail,
        action: "created_song",
        entityType: "song",
        entityId: song._id.toString(),
        details: `Created song: ${song.title}`,
      });
    }

    return NextResponse.json({ success: true, data: song }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ success: false, message: "A song with this title already exists" }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
