import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Song from "@/models/Song";
import { songSchema } from "@/lib/validations/song";
import { generateSlug } from "@/lib/slug";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category");
    const language = searchParams.get("language");
    
    const query: any = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { lyrics: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }
    if (category) query.category = category;
    if (language) query.language = language;

    const songs = await Song.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Song.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: {
        songs,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Fetch songs error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to fetch songs" } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "User ID missing" } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const result = songSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: result.error.issues[0]?.message || "Invalid input",
          },
        },
        { status: 400 }
      );
    }

    await dbConnect();

    const songData = result.data;
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
      createdBy: userId,
    });

    return NextResponse.json({
      success: true,
      data: song,
    });
  } catch (error) {
    console.error("Create song error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to create song" } },
      { status: 500 }
    );
  }
}
