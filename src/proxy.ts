import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes, excluding /admin/login
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get("admin_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default-secret-key-for-development-only-change-me");
      const { payload } = await jwtVerify(token, secret);
      
      const role = payload.role as string;
      const permissions = (payload.permissions as string[]) || [];
      const pageId = pathname.split("/").pop() || "";

      // Super admins get access to everything
      if (role === "super_admin") {
        return NextResponse.next();
      }

      // Regular admins: block access to dashboard and root /admin
      if (pageId === "admin" || pageId === "dashboard" || !permissions.includes(pageId)) {
        if (permissions.length > 0) {
          // Redirect them to their first assigned page
          return NextResponse.redirect(new URL(`/admin/${permissions[0]}`, request.url));
        }
        // If they have no permissions, kick them to login
        const response = NextResponse.redirect(new URL("/admin/login", request.url));
        response.cookies.delete("admin_token");
        return response;
      }

      return NextResponse.next();
    } catch (error) {
      // Invalid token
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete("admin_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
