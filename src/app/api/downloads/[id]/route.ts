import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Download from "@/models/Download";
import { logActivity } from "@/lib/audit";

// GET /api/downloads/[id] - Fetch a single download
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    
    // We update the download count when fetching the details
    const download = await Download.findByIdAndUpdate(
      id,
      { $inc: { downloadCount: 1 } },
      { new: true }
    );

    if (!download) {
      return NextResponse.json({ success: false, message: "Download not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: download });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT /api/downloads/[id] - Update a download
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const adminId = req.headers.get("x-user-id");
    const adminEmail = req.headers.get("x-user-email");

    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const download = await Download.findByIdAndUpdate(id, body, { new: true, runValidators: true });

    if (!download) {
      return NextResponse.json({ success: false, message: "Download not found" }, { status: 404 });
    }

    // Log Activity
    if (adminId && adminEmail) {
      await logActivity({
        userId: adminId,
        userEmail: adminEmail,
        action: "updated_download",
        entityType: "download",
        entityId: download._id.toString(),
        details: `Updated download: ${download.title}`,
      });
    }

    return NextResponse.json({ success: true, data: download });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE /api/downloads/[id] - Delete a download
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const adminId = req.headers.get("x-user-id");
    const adminEmail = req.headers.get("x-user-email");

    await connectDB();
    const { id } = await params;
    const download = await Download.findByIdAndDelete(id);

    if (!download) {
      return NextResponse.json({ success: false, message: "Download not found" }, { status: 404 });
    }

    // Log Activity
    if (adminId && adminEmail) {
      await logActivity({
        userId: adminId,
        userEmail: adminEmail,
        action: "deleted_download",
        entityType: "download",
        entityId: id,
        details: `Deleted download: ${download.title}`,
      });
    }

    return NextResponse.json({ success: true, message: "Download deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
