import { NextRequest, NextResponse } from "next/server";
import { addReport, getAllReports, getReportStats } from "@/app/lib/reportStore";
import { getActiveProject } from "@/app/lib/projectStore";

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

    const activeProject = await getActiveProject();

    const report = await addReport({
      projectId: activeProject?._id || null,
      projectName: activeProject?.name || null,
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
          id: report._id,
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    const reports = await getAllReports(projectId);
    const stats = await getReportStats(projectId);
    
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
