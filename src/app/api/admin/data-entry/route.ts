import { NextRequest, NextResponse } from "next/server";
import { getAllDataEntries, insertDataEntry } from "@/app/lib/dataEntryStore";
import type { RecordStage } from "@/app/lib/dataEntryStore";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId") || undefined;
    const stage = searchParams.get("stage") as RecordStage | null;
    const entries = await getAllDataEntries({ projectId, stage: stage || undefined });
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

    const { stage: _stage, completedStages: _cs, createdAt: _ca, updatedAt: _ua, _id: _id, ...cleanBody } = body;

    const entryId = await insertDataEntry({
      ...cleanBody,
      stage: "registration",
      completedStages: {},
      date: body.date || new Date().toISOString().split("T")[0],
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
