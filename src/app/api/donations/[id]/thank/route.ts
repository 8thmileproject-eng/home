import { NextRequest, NextResponse } from "next/server";
import { donationStore } from "@/app/lib/donationStore";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const success = donationStore.markAsThanked(id);
    
    if (!success) {
      return NextResponse.json(
        { error: "Donation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Thank you status updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating thank you status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
