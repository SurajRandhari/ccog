import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Event from "@/models/Event";

// GET /api/v1/events - Mobile API to fetch active events
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const query = { status: "active" };

    const events = await Event.find(query)
      .sort({ date: 1 }) // Future events first if filtered, otherwise sort by date ascending
      .skip(skip)
      .limit(limit)
      .select("-__v");

    const total = await Event.countDocuments(query);

    return NextResponse.json({ 
      success: true, 
      data: events,
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
