import { NextResponse } from "next/server";
import { getAdminByEmail } from "@/app/lib/adminStore";
import { signJwt } from "@/app/lib/jwt";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const admin = await getAdminByEmail(email);

    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);

    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await signJwt({
      email: admin.email,
      name: admin.name,
      role: admin.role,
      subRole: admin.subRole,
      permissions: admin.permissions || [],
    });

    const response = NextResponse.json(
      { success: true, user: { email: admin.email, name: admin.name, role: admin.role, subRole: admin.subRole, permissions: admin.permissions || [] } },
      { status: 200 }
    );

    // Set cookie
    response.cookies.set({
      name: "admin_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
