import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Song from "@/models/Song";

// GET /api/songs/suggestions?q= - Autocomplete suggestions
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    if (!q || q.length < 1) {
      return NextResponse.json({ success: true, data: [] });
    }

    const query: any = {
      status: "active",
      isPublished: true,
    };

    const searchConditions: any[] = [
      { title: { $regex: q, $options: "i" } },
      { lyrics: { $regex: q, $options: "i" } },
    ];

    const songNo = parseInt(q);
    if (!isNaN(songNo)) {
      searchConditions.push({ songNo: songNo });
    }

    query.$or = searchConditions;

    const songs = await Song.find(query)
      .select("title slug songNo")
      .sort({ songNo: 1, title: 1 })
      .limit(10);

    const suggestions = songs.map((s) => ({
      title: s.title,
      slug: s.slug,
      songNo: s.songNo,
    }));

    return NextResponse.json({ success: true, data: suggestions });
  } catch (error: any) {
    console.error("Suggestions error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
