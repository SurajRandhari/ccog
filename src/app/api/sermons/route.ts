import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Sermon from "@/models/Sermon";
import slugify from "slugify";
import { logActivity } from "@/lib/audit";
import { revalidatePath } from "next/cache";

// GET /api/sermons - List all sermons
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const speaker = searchParams.get("speaker");

    const query: any = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    if (speaker) {
      query.speaker = speaker;
    }

    const sermons = await Sermon.find(query).sort({ date: -1 });

    return NextResponse.json({ success: true, data: sermons });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST /api/sermons - Create a new sermon
export async function POST(req: NextRequest) {
  try {
    const adminId = req.headers.get("x-user-id");
    const adminEmail = req.headers.get("x-user-email");

    await connectDB();
    const body = await req.json();
    
    if (!body.title) {
      return NextResponse.json({ success: false, message: "Title is required" }, { status: 400 });
    }

    if (!body.videoUrl && !body.content) {
      return NextResponse.json({ success: false, message: "Either video URL or text content is required" }, { status: 400 });
    }

    const slug = slugify(body.title, { lower: true, strict: true });
    
    // Ensure createdBy is a valid string ID
    const createdBy = (typeof adminId === 'string' && adminId.length === 24) 
      ? adminId 
      : "60d5f9b4f1b2c34d5e6f7a8b";

    const sermon = await Sermon.create({
      ...body,
      slug,
      createdBy
    });

    // Log Activity
    if (adminId && adminEmail) {
      await logActivity({
        userId: adminId,
        userEmail: adminEmail,
        action: "created_sermon",
        entityType: "sermon",
        entityId: sermon._id.toString(),
        details: `Created sermon: ${sermon.title}`,
      });
    }

    revalidatePath("/resources/sermons");

    return NextResponse.json({ success: true, data: sermon }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
