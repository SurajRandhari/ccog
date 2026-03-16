import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-key-change-in-production"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // Allow login API and public routes
  if (pathname === "/api/admin/login" || !pathname.startsWith("/admin") && !pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Define protected API routes and Page routes
  const isAdminApi = pathname.startsWith("/api/admin");
  const isContentApi = pathname.startsWith("/api/songs") || 
                        pathname.startsWith("/api/sermons") || 
                        pathname.startsWith("/api/events") || 
                        pathname.startsWith("/api/blogs");
  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";

  // If it's a protected route, verify the token
  if (isAdminApi || isContentApi || isAdminPage) {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const role = (payload.role as string) || "viewonly";

      // RBAC LOGIC
      
      // 1. User Management (Admin Only)
      if (pathname.startsWith("/api/admin/users")) {
        if (role !== "admin") {
          return NextResponse.json({ success: false, message: "Admin privileges required" }, { status: 403 });
        }
      }

      // 2. Content API Permissions
      if (isContentApi) {
        // GET requests are allowed for viewonly (internal admin view)
        // POST, PUT, DELETE are restricted
        if (method !== "GET") {
          if (role === "viewonly") {
            return NextResponse.json({ success: false, message: "Modification not allowed for your role" }, { status: 403 });
          }
        }
      }

      // 3. Admin Page Access
      // (role viewonly, editor, admin can all see the dashboard, but their UI should reflect permissions)
      
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", payload.userId as string);
      requestHeaders.set("x-user-email", payload.email as string);
      requestHeaders.set("x-user-role", role);

      return NextResponse.next({
        request: { headers: requestHeaders },
      });
    } catch (error) {
      console.error("Middleware Auth Error:", error);
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/songs/:path*",
    "/api/sermons/:path*",
    "/api/events/:path*",
    "/api/blogs/:path*",
  ],
};
