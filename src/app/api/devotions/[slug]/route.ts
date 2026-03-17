import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Devotion from "@/models/Devotion";

// GET /api/devotions/[slug] - Fetch single published devotion
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;
    const devotion = await Devotion.findOne({ slug, status: "published" });

    if (!devotion) {
      return NextResponse.json({ success: false, message: "Devotion not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: devotion });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
