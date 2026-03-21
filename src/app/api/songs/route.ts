import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Song from "@/models/Song";
import { songSchema } from "@/lib/validations/song";
import { generateSlug } from "@/lib/slug";
import { logActivity } from "@/lib/audit";

// GET /api/songs - Fetch songs with filters, search, sorting, pagination
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const isAdmin =
      req.headers.get("x-user-role") === "admin" ||
      req.headers.get("x-user-role") === "editor";

    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const sortField = searchParams.get("sort") || "songNo";
    const sortOrder = searchParams.get("order") === "desc" ? -1 : 1;
    const lang = searchParams.get("lang") || "";
    const category = searchParams.get("category") || "";
    const publishedFilter = searchParams.get("published"); // "true" | "false" | null
    const showDeleted = searchParams.get("showDeleted") === "true";

    // Build query
    const query: any = {};

    if (isAdmin) {
      // Admin: show active by default, show deleted if requested
      if (showDeleted) {
        query.status = "deleted";
      } else {
        query.status = "active";
      }
      // Admin can filter by published status
      if (publishedFilter === "true") query.isPublished = true;
      if (publishedFilter === "false") query.isPublished = false;
    } else {
      // Public: only active + published songs
      query.status = "active";
      query.isPublished = true;
    }

    if (search) {
      const songNo = parseInt(search);
      const searchConditions: any[] = [
        { title: { $regex: search, $options: "i" } },
        { lyrics: { $regex: search, $options: "i" } },
      ];
      if (!isNaN(songNo)) {
        searchConditions.push({ songNo: songNo });
      }
      query.$or = searchConditions;
    }

    if (lang && lang !== "All") {
      query.language = lang;
    }

    if (category && category !== "All Library") {
      query.category = category;
    }

    // Sort options
    let sortOptions: any = {};
    if (sortField === "title") {
      sortOptions = { title: sortOrder };
    } else if (sortField === "language") {
      sortOptions = { language: sortOrder, songNo: 1 };
    } else if (sortField === "createdAt") {
      sortOptions = { createdAt: sortOrder };
    } else {
      sortOptions = { songNo: sortOrder, title: 1 };
    }

    const songs = await Song.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const total = await Song.countDocuments(query);

    // Category counts (for public view, scoped to current language)
    let counts: Record<string, number> = {};
    if (!isAdmin && lang) {
      const baseFilter: any = { status: "active", isPublished: true };
      if (lang !== "All") baseFilter.language = lang;

      counts["All Library"] = await Song.countDocuments(baseFilter);

      const categoryCounts = await Song.aggregate([
        { $match: baseFilter },
        { $group: { _id: "$category", count: { $sum: 1 } } },
      ]);

      const allCategories = ["Worship", "Praise", "Christmas", "Lent", "Hymn", "Special Songs"];
      allCategories.forEach((cat) => {
        const found = categoryCounts.find((c) => c._id === cat);
        counts[cat] = found ? found.count : 0;
      });
    }

    return NextResponse.json({
      success: true,
      data: songs,
      counts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Fetch songs error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST /api/songs - Create a new song (Admin)
export async function POST(req: NextRequest) {
  try {
    const adminId = req.headers.get("x-user-id");
    const adminEmail = req.headers.get("x-user-email");

    const body = await req.json();
    const result = songSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.error.issues[0]?.message || "Invalid input",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const songData = result.data;

    // Auto-generate slug from title
    if (!songData.slug) {
      songData.slug = generateSlug(songData.title);
    }

    // Ensure slug is unique
    let finalSlug = songData.slug;
    let counter = 1;
    while (await Song.exists({ slug: finalSlug })) {
      finalSlug = `${songData.slug}-${counter}`;
      counter++;
    }

    const song = await Song.create({
      ...songData,
      slug: finalSlug,
      createdBy: adminId || "60d5f9b4f1b2c34d5e6f7a8b",
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
      return NextResponse.json(
        { success: false, message: "A song with this title already exists" },
        { status: 400 }
      );
    }
    console.error("Create song error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
