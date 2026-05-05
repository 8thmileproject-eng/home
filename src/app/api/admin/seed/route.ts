import { NextResponse } from "next/server";
import { insertAdmin, getAdminByEmail } from "@/app/lib/adminStore";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    // In a real production app, protect this endpoint with a master key
    // or remove it after the first use.
    
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 });
    }

    const existingAdmin = await getAdminByEmail(email);
    if (existingAdmin) {
      return NextResponse.json({ error: "Admin already exists" }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const success = await insertAdmin({
      email,
      passwordHash,
      name,
      role: "super_admin",
      permissions: ["dashboard", "donations", "partners", "volunteers", "reports", "communications", "settings"],
      disabled: false,
      createdAt: new Date(),
    });

    if (success) {
      return NextResponse.json({ success: true, message: "Super admin created" }, { status: 201 });
    } else {
      return NextResponse.json({ error: "Failed to create admin" }, { status: 500 });
    }
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
