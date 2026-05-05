import { NextRequest, NextResponse } from "next/server";
import { getAllAdmins, insertAdmin, updateAdmin, deleteAdmin, getAdminByEmail } from "@/app/lib/adminStore";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const admins = await getAllAdmins();
    const safe = admins.map(({ passwordHash, ...rest }) => rest);
    return NextResponse.json({ admins: safe }, { status: 200 });
  } catch (error) {
    console.error("Error fetching admins:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role, permissions } = await request.json();

    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: "Email, password, name and role are required" }, { status: 400 });
    }

    const existing = await getAdminByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "An admin with this email already exists" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const success = await insertAdmin({
      email,
      passwordHash,
      name,
      role,
      disabled: false,
      permissions: permissions || [],
      createdAt: new Date(),
    });

    if (!success) {
      return NextResponse.json({ error: "Failed to create admin" }, { status: 500 });
    }

    return NextResponse.json({ message: "Admin created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating admin:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Admin ID is required" }, { status: 400 });
    }

    // If password is being changed, hash it
    if (updates.password) {
      updates.passwordHash = await bcrypt.hash(updates.password, 12);
      delete updates.password;
    }

    const success = await updateAdmin(id, updates);

    if (!success) {
      return NextResponse.json({ error: "Admin not found or no changes made" }, { status: 404 });
    }

    return NextResponse.json({ message: "Admin updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating admin:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Admin ID is required" }, { status: 400 });
    }

    const success = await deleteAdmin(id);

    if (!success) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Admin deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting admin:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
