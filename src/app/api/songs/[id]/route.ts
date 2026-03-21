import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Song from "@/models/Song";
import { songSchema } from "@/lib/validations/song";
import { generateSlug } from "@/lib/slug";
import { logActivity } from "@/lib/audit";

// GET /api/songs/[id] - Fetch a single song by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const song = await Song.findById(id);

    if (!song) {
      return NextResponse.json(
        { success: false, message: "Song not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: song });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/songs/[id] - Update a song
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminId = req.headers.get("x-user-id");
    const adminEmail = req.headers.get("x-user-email");

    await connectDB();
    const { id } = await params;
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

    const songData: any = result.data;

    // Auto-generate slug from title if title changed
    if (songData.title && !songData.slug) {
      songData.slug = generateSlug(songData.title);
    }

    // If slug is set, ensure uniqueness (excluding current doc)
    if (songData.slug) {
      let finalSlug = songData.slug;
      let counter = 1;
      while (await Song.exists({ slug: finalSlug, _id: { $ne: id } })) {
        finalSlug = `${songData.slug}-${counter}`;
        counter++;
      }
      songData.slug = finalSlug;
    }

    // Track who updated
    if (adminId) {
      songData.updatedBy = adminId;
    }

    const song = await Song.findByIdAndUpdate(id, songData, {
      new: true,
      runValidators: true,
    });

    if (!song) {
      return NextResponse.json(
        { success: false, message: "Song not found" },
        { status: 404 }
      );
    }

    // Log Activity
    if (adminId && adminEmail) {
      await logActivity({
        userId: adminId,
        userEmail: adminEmail,
        action: "updated_song",
        entityType: "song",
        entityId: song._id.toString(),
        details: `Updated song: ${song.title}`,
      });
    }

    return NextResponse.json({ success: true, data: song });
  } catch (error: any) {
    console.error("Update song error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/songs/[id] - Soft delete a song
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminId = req.headers.get("x-user-id");
    const adminEmail = req.headers.get("x-user-email");

    await connectDB();
    const { id } = await params;

    const song = await Song.findByIdAndUpdate(
      id,
      { status: "deleted", updatedBy: adminId || undefined },
      { new: true }
    );

    if (!song) {
      return NextResponse.json(
        { success: false, message: "Song not found" },
        { status: 404 }
      );
    }

    // Log Activity
    if (adminId && adminEmail) {
      await logActivity({
        userId: adminId,
        userEmail: adminEmail,
        action: "deleted_song",
        entityType: "song",
        entityId: id,
        details: `Soft-deleted song: ${song.title}`,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Song deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete song error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
