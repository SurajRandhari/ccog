import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Song from "@/models/Song";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category");
    const language = searchParams.get("language");
    const isLive = searchParams.get("isLive") === "true";
    
    const query: any = { status: "published" };
    
    if (isLive) {
      query.isLive = true;
    } else {
      if (category && category !== "all") query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { lyrics: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }
    if (language && language !== "all") query.language = language;

    const songs = await Song.find(query)
      .select("title slug songNumber author category language tags createdAt")
      .sort({ title: 1 });

    return NextResponse.json({
      success: true,
      data: songs,
    });
  } catch (error) {
    console.error("Fetch public songs error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to fetch songs" } },
      { status: 500 }
    );
  }
}
