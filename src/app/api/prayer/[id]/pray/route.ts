import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PrayerRequest from "@/models/PrayerRequest";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const prayerRequest = await PrayerRequest.findByIdAndUpdate(
      id,
      { $inc: { prayingCount: 1 } },
      { new: true }
    );

    if (!prayerRequest) {
      return NextResponse.json(
        { success: false, message: "Prayer request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, count: prayerRequest.prayingCount });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
