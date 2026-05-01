import { NextRequest, NextResponse } from "next/server";
import { partnerStore } from "@/app/lib/partnerStore";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { name, email, partnershipType } = body;
    
    if (!name || !email || !partnershipType) {
      return NextResponse.json(
        { error: "Name, email, and partnership type are required" },
        { status: 400 }
      );
    }

    // Save partner to store
    const partner = partnerStore.add({
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
          id: partner.id,
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

export async function GET() {
  try {
    const partners = partnerStore.getAll();
    const stats = partnerStore.getStats();
    
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
