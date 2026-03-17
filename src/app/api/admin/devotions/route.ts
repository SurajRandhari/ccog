import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Devotion from "@/models/Devotion";

// GET /api/admin/devotions - Fetch all devotions for admin
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    // In a real app, you'd check session/role here. 
    // Assuming middleware handles auth for /api/admin/*
    const devotions = await Devotion.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: devotions });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST /api/admin/devotions - Create a new devotion
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    
    // Simple slug generation if not provided
    if (!body.slug && body.title) {
        body.slug = body.title.toLowerCase().replace(/[^a-z0-0]+/g, "-").replace(/(^-|-$)/g, "");
    }

    // Temporary: use a placeholder for createdBy until session is fully integrated
    // In actual use, this should come from the user's session
    if (!body.createdBy) {
        // Need to find a fallback admin user ID or ensure it's provided
        // For now, let's assume it's passed or handled by the caller
    }

    const devotion = await Devotion.create(body);
    return NextResponse.json({ success: true, data: devotion }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
