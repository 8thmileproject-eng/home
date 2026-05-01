import { NextRequest, NextResponse } from "next/server";
import { partnerStore } from "@/app/lib/partnerStore";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const success = partnerStore.markAsContacted(id);
    
    if (!success) {
      return NextResponse.json(
        { error: "Partner not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Partner marked as contacted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating partner contact status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
