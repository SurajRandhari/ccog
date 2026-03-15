import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { loginSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: result.error.issues[0]?.message || "Invalid input",
          },
        },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    // Hardcoded static login for development/testing
    const STATIC_EMAIL = "calvarycogindia@gmail.com";
    const STATIC_PASSWORD = "password@123";

    if (email.toLowerCase() === STATIC_EMAIL && password === STATIC_PASSWORD) {
      const token = jwt.sign(
        { userId: "static_admin", role: "admin" },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );

      const response = NextResponse.json({
        success: true,
        data: {
          user: {
            id: "static_admin",
            name: "Calvary Admin",
            email: STATIC_EMAIL,
            role: "admin",
          },
          token,
        },
      });

      response.cookies.set("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return response;
    }

    await dbConnect();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "INVALID_CREDENTIALS", message: "Invalid credentials" },
        },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "INVALID_CREDENTIALS", message: "Invalid credentials" },
        },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    await User.findByIdAndUpdate(user._id, { lastLoginAt: new Date() });

    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token, // For mobile clients
      },
    });

    // Set cookie for web clients
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        success: false,
        error: { code: "SERVER_ERROR", message: "Internal server error" },
      },
      { status: 500 }
    );
  }
}
