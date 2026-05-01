import { NextRequest, NextResponse } from "next/server";
import { reportStore } from "@/app/lib/reportStore";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const success = reportStore.markAsReviewed(id);
    
    if (!success) {
      return NextResponse.json(
        { error: "Report not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Report marked as reviewed" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating report review status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
