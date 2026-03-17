import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Song from "@/models/Song";
import slugify from "slugify";
import { logActivity } from "@/lib/audit";

// GET /api/songs - Fetch all songs with filters and sorting
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    
    const sortField = searchParams.get("sort") || "songNumber"; 
    const sortOrder = searchParams.get("order") === "desc" ? -1 : 1;
    const lang = searchParams.get("lang") || "";
    const category = searchParams.get("category") || "";

    const query: any = { status: "published" };

    if (lang) {
      query.language = { $regex: new RegExp(`^${lang}$`, "i") };
    }

    if (category) {
      query.category = category;
    }

    let sortOptions: any = {};
    if (sortField === "title") {
      sortOptions = { title: sortOrder };
    } else if (sortField === "language") {
      sortOptions = { language: sortOrder, songNumber: 1 };
    } else {
      // Default to number sorting
      sortOptions = { songNumber: sortOrder, title: 1 };
    }

    const songs = await Song.find(query).sort(sortOptions);

    return NextResponse.json({
      success: true,
      data: songs,
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
