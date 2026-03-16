import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Song from "@/models/Song";
import Sermon from "@/models/Sermon";
import Event from "@/models/Event";
import Blog from "@/models/Blog";
import PrayerRequest from "@/models/PrayerRequest";

// GET /api/admin/stats - Get collection counts for dashboard
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const role = req.headers.get("x-user-role");

    // Only allow Admin/Editor to view stats
    if (role === "viewonly") {
      // Viewer can see stats, but maybe limited?
      // For now, allow all roles but just read-only.
    }

    const [songs, sermons, events, blogs, prayer] = await Promise.all([
      Song.countDocuments(),
      Sermon.countDocuments(),
      Event.countDocuments({ date: { $gte: new Date() } }), // Count upcoming events
      Blog.countDocuments(),
      PrayerRequest.countDocuments(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalSongs: songs,
        totalSermons: sermons,
        upcomingEvents: events,
        totalBlogs: blogs,
        prayerRequests: prayer,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
