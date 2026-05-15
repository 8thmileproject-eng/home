import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin") || pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const token = request.cookies.get("admin_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default-secret-key-for-development-only-change-me");
    const { payload } = await jwtVerify(token, secret);

    const role = payload.role as string;
    const permissions = (payload.permissions as string[]) || [];

    if (role === "super_admin") {
      return NextResponse.next();
    }

    const segments = pathname.split("/").filter(Boolean);
    const topLevel = segments[1];
    const subPage = segments.length > 2 ? segments[segments.length - 1] : "";
    const prPermission = `patient-record-${subPage}`;

    if (topLevel === "patient-record") {
      if (permissions.includes("patient-record") || permissions.includes(prPermission)) {
        return NextResponse.next();
      }
    }

    if (topLevel && permissions.includes(topLevel)) {
      return NextResponse.next();
    }

    const firstPage = permissions.find((p: string) => !p.startsWith("patient-record-"));
    const firstPrPage = permissions.find((p: string) => p.startsWith("patient-record-"));
    if (firstPage) {
      return NextResponse.redirect(new URL(`/admin/${firstPage}`, request.url));
    }
    if (firstPrPage) {
      return NextResponse.redirect(new URL(`/admin/patient-record/${firstPrPage.replace("patient-record-", "")}`, request.url));
    }

    const response = NextResponse.redirect(new URL("/admin/login", request.url));
    response.cookies.delete("admin_token");
    return response;
  } catch {
    const response = NextResponse.redirect(new URL("/admin/login", request.url));
    response.cookies.delete("admin_token");
    return response;
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
