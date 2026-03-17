import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Devotion from "@/models/Devotion";

// GET /api/admin/devotions/[id] - Fetch single devotion for admin
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const devotion = await Devotion.findById(id);

    if (!devotion) {
      return NextResponse.json({ success: false, message: "Devotion not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: devotion });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT /api/admin/devotions/[id] - Update a devotion
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    
    const devotion = await Devotion.findByIdAndUpdate(id, body, { new: true, runValidators: true });

    if (!devotion) {
      return NextResponse.json({ success: false, message: "Devotion not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: devotion });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE /api/admin/devotions/[id] - Delete a devotion
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const devotion = await Devotion.findByIdAndDelete(id);

    if (!devotion) {
      return NextResponse.json({ success: false, message: "Devotion not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Devotion deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
