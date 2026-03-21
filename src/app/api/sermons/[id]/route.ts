import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Sermon from "@/models/Sermon";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { logActivity } from "@/lib/audit";

// GET /api/sermons/[id] - Fetch a single sermon
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const sermon = await Sermon.findById(id);

    if (!sermon) {
      return NextResponse.json({ success: false, message: "Sermon not found" }, { status: 404 });
    }

    revalidatePath("/resources/sermons");
    revalidatePath(`/resources/sermons/${sermon.slug}`);

    return NextResponse.json({ success: true, data: sermon });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT /api/sermons/[id] - Update a sermon
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const adminId = req.headers.get("x-user-id");
    const adminEmail = req.headers.get("x-user-email");

    await connectDB();
    const { id } = await params;
    const body = await req.json();

    if (body.title) {
      body.slug = slugify(body.title, { lower: true });
      if (!body.slug) {
        body.slug = `sermon-${Date.now()}`;
      }
    }

    const sermon = await Sermon.findByIdAndUpdate(id, body, { new: true, runValidators: true });

    if (!sermon) {
      return NextResponse.json({ success: false, message: "Sermon not found" }, { status: 404 });
    }

    // Log Activity
    if (adminId && adminEmail) {
      await logActivity({
        userId: adminId,
        userEmail: adminEmail,
        action: "updated_sermon",
        entityType: "sermon",
        entityId: sermon._id.toString(),
        details: `Updated sermon: ${sermon.title}`,
      });
    }

    return NextResponse.json({ success: true, data: sermon });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE /api/sermons/[id] - Delete a sermon
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const adminId = req.headers.get("x-user-id");
    const adminEmail = req.headers.get("x-user-email");

    await connectDB();
    const { id } = await params;
    const sermon = await Sermon.findByIdAndDelete(id);

    if (!sermon) {
      return NextResponse.json({ success: false, message: "Sermon not found" }, { status: 404 });
    }

    // Log Activity
    if (adminId && adminEmail) {
      await logActivity({
        userId: adminId,
        userEmail: adminEmail,
        action: "deleted_sermon",
        entityType: "sermon",
        entityId: id,
        details: `Deleted sermon: ${sermon.title}`,
      });
    }

    return NextResponse.json({ success: true, message: "Sermon deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
