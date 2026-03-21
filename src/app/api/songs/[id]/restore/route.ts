import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Song from "@/models/Song";
import { logActivity } from "@/lib/audit";

// PATCH /api/songs/[id]/restore - Restore a soft-deleted song
export async function PATCH(
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
      { status: "active", updatedBy: adminId || undefined },
      { new: true }
    );

    if (!song) {
      return NextResponse.json(
        { success: false, message: "Song not found" },
        { status: 404 }
      );
    }

    if (adminId && adminEmail) {
      await logActivity({
        userId: adminId,
        userEmail: adminEmail,
        action: "restored_song",
        entityType: "song",
        entityId: id,
        details: `Restored song: ${song.title}`,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Song restored successfully",
      data: song,
    });
  } catch (error: any) {
    console.error("Restore song error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
