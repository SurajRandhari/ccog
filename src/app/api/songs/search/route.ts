import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Song from "@/models/Song";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    if (!q) {
      return NextResponse.json({ success: true, data: [] });
    }

    const query: any = {
      status: "published",
      $or: [
        { title: { $regex: q, $options: "i" } },
        { language: { $regex: q, $options: "i" } },
      ],
    };

    // If q is a number, search by songNumber as well
    const songNumber = parseInt(q);
    if (!isNaN(songNumber)) {
      query.$or.push({ songNumber: songNumber });
    }

    const songs = await Song.find(query)
      .sort({ songNumber: 1, title: 1 })
      .limit(20);

    return NextResponse.json({
      success: true,
      data: songs,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
