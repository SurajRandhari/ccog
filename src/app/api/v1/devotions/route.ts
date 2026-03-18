import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Devotion from "@/models/Devotion";

// GET /api/v1/devotions - Mobile API to fetch published devotions
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const query = { status: "published" };

    const devotions = await Devotion.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .select("-__v"); 

    const total = await Devotion.countDocuments(query);

    return NextResponse.json({ 
      success: true, 
      data: devotions,
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
