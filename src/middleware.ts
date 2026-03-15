import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "");

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip login page
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", payload.userId as string);
      requestHeaders.set("x-user-role", payload.role as string);

      return NextResponse.next({
        request: { headers: requestHeaders },
      });
    } catch {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Protect admin API routes (require auth)
  if (pathname.startsWith("/api/v1/admin")) {
    const token = request.cookies.get("auth_token")?.value;
    const bearerToken = request.headers
      .get("authorization")
      ?.replace("Bearer ", "");
    const authToken = token || bearerToken;

    if (!authToken) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "UNAUTHORIZED", message: "Authentication required" },
        },
        { status: 401 }
      );
    }

    try {
      const { payload } = await jwtVerify(authToken, JWT_SECRET);
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", payload.userId as string);
      requestHeaders.set("x-user-role", payload.role as string);

      return NextResponse.next({
        request: { headers: requestHeaders },
      });
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: { code: "UNAUTHORIZED", message: "Invalid or expired token" },
        },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/v1/admin/:path*"],
};
