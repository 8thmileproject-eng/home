import { NextRequest, NextResponse } from "next/server";
import { getAllProjects, insertProject, getActiveProject } from "@/app/lib/projectStore";

export async function GET() {
  try {
    const projects = await getAllProjects();
    const active = await getActiveProject();
    return NextResponse.json({ projects, activeProjectId: active?._id || null }, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, startDate, endDate, coverImage } = body;

    if (!name) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 });
    }

    const projectId = await insertProject({
      name,
      description: description || "",
      status: "inactive",
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      coverImage: coverImage || undefined,
      createdAt: new Date(),
    });

    if (projectId) {
      return NextResponse.json({ message: "Project created", projectId }, { status: 201 });
    }
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
