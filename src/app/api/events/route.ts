import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Event from "@/models/Event";
import slugify from "slugify";
import { logActivity } from "@/lib/audit";

// GET /api/events - Fetch all events
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const upcoming = searchParams.get("upcoming") === "true";
    const isAdmin = req.headers.get("x-user-role") === "admin" || req.headers.get("x-user-role") === "editor";

    // Public gets only published, Admin/Editor gets all for management
    const query: any = isAdmin ? {} : { status: "published" };
    
    if (upcoming) {
      query.date = { $gte: new Date() };
    }

    const events = await Event.find(query).sort({ date: 1 });

    return NextResponse.json({ success: true, data: events });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST /api/events - Create a new event
export async function POST(req: NextRequest) {
  try {
    const adminId = req.headers.get("x-user-id");
    const adminEmail = req.headers.get("x-user-email");

    await connectDB();
    const body = await req.json();
    
    if (!body.title || !body.date) {
      return NextResponse.json({ success: false, message: "Title and date are required" }, { status: 400 });
    }

    const slug = slugify(body.title, { lower: true, strict: true });
    const event = await Event.create({ 
      ...body, 
      slug, 
      createdBy: adminId || "60d5f9b4f1b2c34d5e6f7a8b" 
    });

    // Log Activity
    if (adminId && adminEmail) {
      await logActivity({
        userId: adminId,
        userEmail: adminEmail,
        action: "created_event",
        entityType: "event",
        entityId: event._id.toString(),
        details: `Created event: ${event.title}`,
      });
    }

    return NextResponse.json({ success: true, data: event }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
