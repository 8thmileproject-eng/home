import { NextRequest, NextResponse } from "next/server";
import { advanceRecordStage, getDataEntryById, updateDataEntry } from "@/app/lib/dataEntryStore";
import type { RecordStage } from "@/app/lib/dataEntryStore";
import { verifyJwt } from "@/app/lib/jwt";

async function getUser(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return null;
  return verifyJwt(token);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { stage, ...fields } = body;

    if (stage && ["nursing", "doctor", "complete"].includes(stage)) {
      const success = await advanceRecordStage(
        id,
        stage as RecordStage,
        fields,
        { id: user.email || "unknown", name: user.name || "Unknown" }
      );
      if (!success) {
        return NextResponse.json({ error: "Record not found" }, { status: 404 });
      }
      return NextResponse.json({ message: "Record updated" }, { status: 200 });
    }

    const success = await updateDataEntry(id, fields);
    if (!success) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Record updated" }, { status: 200 });
  } catch (error) {
    console.error("Error updating data entry:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const entry = await getDataEntryById(id);
    if (!entry) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ entry }, { status: 200 });
  } catch (error) {
    console.error("Error fetching data entry:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
