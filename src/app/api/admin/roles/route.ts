import { NextRequest, NextResponse } from "next/server";
import { getAllRoles, insertRole, updateRole, deleteRole } from "@/app/lib/adminStore";
import fs from "fs";
import path from "path";

// Function to dynamically find all admin pages
function getAdminPages() {
  const adminDir = path.join(process.cwd(), "src/app/admin");
  try {
    const entries = fs.readdirSync(adminDir, { withFileTypes: true });
    const pages = [];
    
    for (const entry of entries) {
      if (entry.isDirectory() && entry.name !== "login") {
        const pagePath = path.join(adminDir, entry.name, "page.tsx");
        if (fs.existsSync(pagePath)) {
          const label = entry.name.charAt(0).toUpperCase() + entry.name.slice(1);
          pages.push({ id: entry.name, label });
        }
        // Scan patient-record sub-pages
        if (entry.name === "patient-record") {
          const prDir = path.join(adminDir, "patient-record");
          try {
            const prEntries = fs.readdirSync(prDir, { withFileTypes: true });
            for (const prEntry of prEntries) {
              if (prEntry.isDirectory()) {
                const prPagePath = path.join(prDir, prEntry.name, "page.tsx");
                if (fs.existsSync(prPagePath) && prEntry.name !== "add") {
                  const label = prEntry.name.charAt(0).toUpperCase() + prEntry.name.slice(1);
                  pages.push({ id: `patient-record-${prEntry.name}`, label: `Patient - ${label}` });
                }
              }
            }
          } catch {}
        }
      }
    }
    
    return pages.sort((a, b) => a.label.localeCompare(b.label));
  } catch (error) {
    console.error("Error reading admin directory:", error);
    return [];
  }
}

export async function GET() {
  try {
    const roles = await getAllRoles();
    const pages = getAdminPages();
    return NextResponse.json({ roles, pages }, { status: 200 });
  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, permissions } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Role name is required" }, { status: 400 });
    }

    const success = await insertRole({
      name,
      permissions: permissions || [],
      createdAt: new Date(),
    });

    if (!success) {
      return NextResponse.json({ error: "A role with this name already exists" }, { status: 409 });
    }

    return NextResponse.json({ message: "Role created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating role:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, permissions } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Role ID is required" }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if (name !== undefined) updates.name = name;
    if (permissions !== undefined) updates.permissions = permissions;

    const success = await updateRole(id, updates);

    if (!success) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Role updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating role:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Role ID is required" }, { status: 400 });
    }

    const success = await deleteRole(id);

    if (!success) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Role deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting role:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
