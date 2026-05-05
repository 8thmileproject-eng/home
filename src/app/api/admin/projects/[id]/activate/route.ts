import { NextRequest, NextResponse } from "next/server";
import { setActiveProject, deactivateProject, getProjectById } from "@/app/lib/projectStore";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const activate = body.activate !== false; // default to true

    if (activate) {
      const success = await setActiveProject(id);
      if (success) {
        const project = await getProjectById(id);
        return NextResponse.json({ message: `Project "${project?.name}" is now active`, project }, { status: 200 });
      }
    } else {
      const success = await deactivateProject(id);
      if (success) {
        return NextResponse.json({ message: "Project deactivated" }, { status: 200 });
      }
    }

    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  } catch (error) {
    console.error("Error toggling project status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
