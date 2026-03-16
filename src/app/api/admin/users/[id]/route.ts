import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { logActivity } from "@/lib/audit";

// PUT /api/admin/users/[id] - Update a user (Admin only)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const role = req.headers.get("x-user-role");
    const adminId = req.headers.get("x-user-id");
    const adminEmail = req.headers.get("x-user-email") || "admin";

    if (role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const userToEdit = await User.findById(id);
    if (!userToEdit) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Protection: Root admin email cannot be changed, and root admin cannot be downgraded
    if (userToEdit.email === "admin@calvarycogindia.com") {
      if (body.email && body.email !== userToEdit.email) {
        return NextResponse.json({ success: false, message: "Cannot change root admin email" }, { status: 403 });
      }
      if (body.role && body.role !== "admin") {
        return NextResponse.json({ success: false, message: "Cannot downgrade root admin role" }, { status: 403 });
      }
    }

    if (body.password) {
      body.password = await bcrypt.hash(body.password, 12);
    }

    const user = await User.findByIdAndUpdate(id, body, { new: true, runValidators: true }).select("-password");

    // Log Activity
    await logActivity({
      userId: adminId!,
      userEmail: adminEmail,
      action: "updated_user",
      entityType: "user",
      entityId: id,
      details: `Updated user ${user?.email}`,
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE /api/admin/users/[id] - Delete a user (Admin only)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const role = req.headers.get("x-user-role");
    const adminId = req.headers.get("x-user-id");
    const adminEmail = req.headers.get("x-user-email") || "admin";

    if (role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    await connectDB();
    const { id } = await params;

    const userToDelete = await User.findById(id);
    if (!userToDelete) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    if (userToDelete.email === "admin@calvarycogindia.com") {
      return NextResponse.json({ success: false, message: "Cannot delete the root admin" }, { status: 403 });
    }

    if (userToDelete._id.toString() === adminId) {
      return NextResponse.json({ success: false, message: "You cannot delete yourself" }, { status: 403 });
    }

    await User.findByIdAndDelete(id);

    // Log Activity
    await logActivity({
      userId: adminId!,
      userEmail: adminEmail,
      action: "deleted_user",
      entityType: "user",
      entityId: id,
      details: `Deleted user ${userToDelete.email}`,
    });

    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

