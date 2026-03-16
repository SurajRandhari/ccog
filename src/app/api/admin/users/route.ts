import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { logActivity } from "@/lib/audit";

// GET /api/admin/users - List all users (Admin only)
export async function GET(req: NextRequest) {
  try {
    const role = req.headers.get("x-user-role");
    if (role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    await connectDB();
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST /api/admin/users - Create a new user (Admin only)
export async function POST(req: NextRequest) {
  try {
    const role = req.headers.get("x-user-role");
    const adminId = req.headers.get("x-user-id");
    const adminEmail = req.headers.get("x-user-email") || "admin"; // Fallback if needed

    if (role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    await connectDB();
    const body = await req.json();

    if (!body.email || !body.password || !body.name || !body.role) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email: body.email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ success: false, message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(body.password, 12);
    
    const user = await User.create({
      ...body,
      email: body.email.toLowerCase(),
      password: hashedPassword
    });

    const { password: _, ...userResponse } = user.toObject();

    // Log Activity
    await logActivity({
      userId: adminId!,
      userEmail: adminEmail,
      action: "created_user",
      entityType: "user",
      entityId: user._id.toString(),
      details: `Created user ${user.email} with role ${user.role}`,
    });

    return NextResponse.json({ success: true, data: userResponse }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
