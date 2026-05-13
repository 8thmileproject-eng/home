import { NextRequest, NextResponse } from "next/server";
import { getAllDataEntries, insertDataEntry } from "@/app/lib/dataEntryStore";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId") || undefined;
    const entries = await getAllDataEntries(projectId);
    return NextResponse.json({ entries }, { status: 200 });
  } catch (error) {
    console.error("Error fetching data entries:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.fullName) {
      return NextResponse.json({ error: "Full name is required" }, { status: 400 });
    }

    const entryId = await insertDataEntry({
      ...body,
      date: body.date || new Date().toISOString().split("T")[0],
      createdAt: new Date(),
    });

    if (entryId) {
      return NextResponse.json({ message: "Entry created", entryId }, { status: 201 });
    }
    return NextResponse.json({ error: "Failed to create entry" }, { status: 500 });
  } catch (error) {
    console.error("Error creating data entry:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
