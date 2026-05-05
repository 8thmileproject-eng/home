import { NextRequest, NextResponse } from "next/server";
import { addPartner, getAllPartners, getPartnerStats } from "@/app/lib/partnerStore";
import { getActiveProject } from "@/app/lib/projectStore";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { name, email, partnershipType } = body;
    
    if (!name || !email || !partnershipType) {
      return NextResponse.json(
        { error: "Name, email, and partnership type are required" },
        { status: 400 }
      );
    }

    const activeProject = await getActiveProject();

    const partner = await addPartner({
      projectId: activeProject?._id || null,
      projectName: activeProject?.name || null,
      name,
      email,
      phone: body.phone || undefined,
      birthday: body.birthday || undefined,
      partnershipType,
      description: body.description || undefined,
    });

    return NextResponse.json(
      { 
        message: "Application submitted successfully",
        partner: {
          id: partner._id,
          name: partner.name,
          email: partner.email,
          createdAt: partner.createdAt,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing partner application:", error);
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

    const partners = await getAllPartners(projectId);
    const stats = await getPartnerStats(projectId);
    
    return NextResponse.json(
      { 
        partners,
        stats,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching partners:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
