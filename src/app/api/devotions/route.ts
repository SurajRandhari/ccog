import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Devotion from "@/models/Devotion";

// GET /api/devotions - Fetch published devotions
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    const devotions = await Devotion.find({ status: "published" })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Devotion.countDocuments({ status: "published" });

    return NextResponse.json({
      success: true,
      data: devotions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
