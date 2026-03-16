import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PrayerRequest from "@/models/PrayerRequest";
import { logActivity } from "@/lib/audit";

// GET /api/prayer/[id] - Fetch a single request
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const request = await PrayerRequest.findById(id);

    if (!request) {
      return NextResponse.json({ success: false, message: "Prayer request not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: request });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT /api/prayer/[id] - Update a request (Mark public/private)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const adminId = req.headers.get("x-user-id");
    const adminEmail = req.headers.get("x-user-email");

    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const request = await PrayerRequest.findByIdAndUpdate(id, body, { new: true });

    if (!request) {
      return NextResponse.json({ success: false, message: "Prayer request not found" }, { status: 404 });
    }

    // Log Activity
    if (adminId && adminEmail) {
      await logActivity({
        userId: adminId,
        userEmail: adminEmail,
        action: "updated_prayer_request",
        entityType: "prayer_request",
        entityId: request._id.toString(),
        details: `Updated prayer request from: ${request.name} (Public: ${request.isPublic})`,
      });
    }

    return NextResponse.json({ success: true, data: request });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE /api/prayer/[id] - Delete a request
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const adminId = req.headers.get("x-user-id");
    const adminEmail = req.headers.get("x-user-email");

    await connectDB();
    const { id } = await params;
    const request = await PrayerRequest.findByIdAndDelete(id);

    if (!request) {
      return NextResponse.json({ success: false, message: "Prayer request not found" }, { status: 404 });
    }

    // Log Activity
    if (adminId && adminEmail) {
      await logActivity({
        userId: adminId,
        userEmail: adminEmail,
        action: "deleted_prayer_request",
        entityType: "prayer_request",
        entityId: id,
        details: `Deleted prayer request from: ${request.name}`,
      });
    }

    return NextResponse.json({ success: true, message: "Prayer request deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
