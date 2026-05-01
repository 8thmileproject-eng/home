import { NextRequest, NextResponse } from "next/server";
import { reportStore } from "@/app/lib/reportStore";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { communityName, location, reporterName, phone, description, disclaimerAccepted } = body;
    
    if (!communityName || !location || !reporterName || !phone || !description || !disclaimerAccepted) {
      return NextResponse.json(
        { error: "Please fill in all required fields and accept the disclaimer" },
        { status: 400 }
      );
    }

    // Save report to store
    const report = reportStore.add({
      communityName,
      location,
      reporterName,
      phone,
      email: body.email || undefined,
      description,
    });

    return NextResponse.json(
      { 
        message: "Report submitted successfully. Thank you for helping us identify communities in need.",
        report: {
          id: report.id,
          communityName: report.communityName,
          createdAt: report.createdAt,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing community report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const reports = reportStore.getAll();
    const stats = reportStore.getStats();
    
    return NextResponse.json(
      { 
        reports,
        stats,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
