import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import dbConnect from "./mongodb";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET!;
const COOKIE_NAME = "auth_token";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface JWTPayload {
  userId: string;
  role: "admin" | "editor";
  iat?: number;
  exp?: number;
}

export async function login(email: string, password: string) {
  await dbConnect();

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { userId: user._id.toString(), role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: MAX_AGE,
    path: "/",
  });

  // Update last login
  await User.findByIdAndUpdate(user._id, { lastLoginAt: new Date() });

  return { success: true, user: { id: user._id, name: user.name, role: user.role } };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });
}

export function verifyToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    throw new Error("Invalid or expired token");
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = verifyToken(token);
    await dbConnect();
    const user = await User.findById(payload.userId).select("-passwordHash");
    return user;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}
