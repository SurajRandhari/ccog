import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PrayerRequest from "@/models/PrayerRequest";
import { logActivity } from "@/lib/audit";

// GET /api/prayer - Fetch prayer requests
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    // For now, allow all requests to be seen in admin. 
    // In a production environment, this would be guarded by session middleware.
    const requests = await PrayerRequest.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: requests });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST /api/prayer - Create a new prayer request
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    
    if (!body.name || !body.email || !body.request) {
      return NextResponse.json({ success: false, message: "Name, email and request are required" }, { status: 400 });
    }

    const prayerRequest = await PrayerRequest.create(body);

    return NextResponse.json({ success: true, data: prayerRequest }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
