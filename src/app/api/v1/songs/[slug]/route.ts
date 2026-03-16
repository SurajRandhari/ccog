import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Song from "@/models/Song";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await dbConnect();
    const song = await Song.findOne({ slug, status: "published" });

    if (!song) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Song not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: song,
    });
  } catch (error) {
    console.error("Fetch public song error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to fetch song" } },
      { status: 500 }
    );
  }
}
