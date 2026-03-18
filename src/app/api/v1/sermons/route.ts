import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Sermon from "@/models/Sermon";

// GET /api/v1/sermons - Mobile API to fetch published sermons
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const query = { status: "published" };

    const sermons = await Sermon.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .select("-__v"); // Exclude mongoose version key

    const total = await Sermon.countDocuments(query);

    return NextResponse.json({ 
      success: true, 
      data: sermons,
      meta: {
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
