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
    const isAdmin = req.headers.get("x-user-role") === "admin" || req.headers.get("x-user-role") === "editor";
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const sortField = searchParams.get("sort") || "songNumber";
    const sortOrder = searchParams.get("order") === "desc" ? -1 : 1;
    const lang = searchParams.get("lang") || "Hindi";
    const category = searchParams.get("category") || "";

    const query: any = isAdmin ? {} : { status: "published" };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { lyrics: { $regex: search, $options: "i" } }
      ];
    }

    if (lang) {
      // Use exact match for language
      query.language = lang;
    }

    if (category && category !== "All Library") {
      query.category = category;
    }

    let sortOptions: any = {};
    if (sortField === "title") {
      sortOptions = { title: sortOrder };
    } else if (sortField === "language") {
      sortOptions = { language: sortOrder, songNumber: 1 };
    } else {
      sortOptions = { songNumber: sortOrder, title: 1 };
    }

    const songs = await Song.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const total = await Song.countDocuments(query);

    // Get counts for all categories in the current language
    const currentLangCategories = ["Worship", "Praise", "Christmas", "Lent", "Hymn", "Special Songs", "Live"];
    const counts: Record<string, number> = {};

    // Total for 'All Library'
    counts["All Library"] = await Song.countDocuments({ language: lang, status: "published" });
    
    const categoryCounts = await Song.aggregate([
      { $match: { language: lang, status: "published" } },
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    currentLangCategories.forEach(cat => {
      const found = categoryCounts.find(c => c._id === cat);
      counts[cat] = found ? found.count : 0;
    });

    return NextResponse.json({
      success: true,
      data: songs,
      counts,
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

    let slug = slugify(body.title, { lower: true });
    if (!slug) {
      slug = `song-${Date.now()}`;
    }
    
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
