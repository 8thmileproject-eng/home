import { NextResponse } from "next/server";
import { getActiveProject } from "@/app/lib/projectStore";

export async function GET() {
  try {
    const project = await getActiveProject();
    if (!project) {
      return NextResponse.json({ project: null, message: "No active project" }, { status: 200 });
    }
    return NextResponse.json({ project }, { status: 200 });
  } catch (error) {
    console.error("Error fetching active project:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
