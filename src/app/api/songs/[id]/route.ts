import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Song from "@/models/Song";
import slugify from "slugify";
import { logActivity } from "@/lib/audit";

// GET /api/songs/[id] - Fetch a single song
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const song = await Song.findById(id);

    if (!song) {
      return NextResponse.json({ success: false, message: "Song not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: song });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT /api/songs/[id] - Update a song
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const adminId = req.headers.get("x-user-id");
    const adminEmail = req.headers.get("x-user-email");

    await connectDB();
    const { id } = await params;
    const body = await req.json();

    if (body.title) {
      body.slug = slugify(body.title, { lower: true, strict: true });
    }

    const song = await Song.findByIdAndUpdate(id, body, { new: true, runValidators: true });

    if (!song) {
      return NextResponse.json({ success: false, message: "Song not found" }, { status: 404 });
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
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE /api/songs/[id] - Delete a song
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const adminId = req.headers.get("x-user-id");
    const adminEmail = req.headers.get("x-user-email");

    await connectDB();
    const { id } = await params;
    const song = await Song.findByIdAndDelete(id);

    if (!song) {
      return NextResponse.json({ success: false, message: "Song not found" }, { status: 404 });
    }

    // Log Activity
    if (adminId && adminEmail) {
      await logActivity({
        userId: adminId,
        userEmail: adminEmail,
        action: "deleted_song",
        entityType: "song",
        entityId: id,
        details: `Deleted song: ${song.title}`,
      });
    }

    return NextResponse.json({ success: true, message: "Song deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
