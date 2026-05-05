import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const filter: Record<string, any> = {};
    if (projectId) filter.projectId = projectId;

    const client = await clientPromise;
    const db = client.db("8thmileproject");
    
    const history = await db.collection("communication_history")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ history }, { status: 200 });
  } catch (error) {
    console.error("Error fetching communication history:", error);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}
