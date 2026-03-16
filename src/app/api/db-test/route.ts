import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    // Perform a simple operation to verify the connection
    const dbName = mongoose.connection.name;
    
    return NextResponse.json({
      success: true,
      message: "MongoDB connected successfully",
      database: dbName,
    }, { status: 200 });
  } catch (error: any) {
    console.error("Database connection test error:", error);
    return NextResponse.json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    }, { status: 500 });
  }
}
