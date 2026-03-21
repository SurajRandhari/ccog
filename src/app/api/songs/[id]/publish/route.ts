import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Song from "@/models/Song";
import { logActivity } from "@/lib/audit";

// PATCH /api/songs/[id]/publish - Toggle publish status
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminId = req.headers.get("x-user-id");
    const adminEmail = req.headers.get("x-user-email");

    await connectDB();
    const { id } = await params;

    const song = await Song.findById(id);
    if (!song) {
      return NextResponse.json(
        { success: false, message: "Song not found" },
        { status: 404 }
      );
    }

    song.isPublished = !song.isPublished;
    if (adminId) {
      song.updatedBy = adminId as any;
    }
    await song.save();

    if (adminId && adminEmail) {
      await logActivity({
        userId: adminId,
        userEmail: adminEmail,
        action: song.isPublished ? "published_song" : "unpublished_song",
        entityType: "song",
        entityId: id,
        details: `${song.isPublished ? "Published" : "Unpublished"} song: ${song.title}`,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Song ${song.isPublished ? "published" : "unpublished"} successfully`,
      data: song,
    });
  } catch (error: any) {
    console.error("Toggle publish error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
