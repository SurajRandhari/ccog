import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Song from "@/models/Song";
import { songSchema } from "@/lib/validations/song";
import { generateSlug } from "@/lib/slug";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const song = await Song.findById(id);

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
    console.error("Fetch song error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to fetch song" } },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
    if (songData.title && !songData.slug) {
        songData.slug = generateSlug(songData.title);
    }

    // If slug changed or is new, ensure uniqueness
    if (songData.slug) {
        let finalSlug = songData.slug;
        let counter = 1;
        while (await Song.exists({ slug: finalSlug, _id: { $ne: id } })) {
          finalSlug = `${songData.slug}-${counter}`;
          counter++;
        }
        songData.slug = finalSlug;
    }

    const song = await Song.findByIdAndUpdate(id, songData, { new: true });

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
    console.error("Update song error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to update song" } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const song = await Song.findByIdAndDelete(id);

    if (!song) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Song not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { message: "Song deleted successfully" },
    });
  } catch (error) {
    console.error("Delete song error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to delete song" } },
      { status: 500 }
    );
  }
}
