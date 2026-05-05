import { NextRequest, NextResponse } from "next/server";
import { addDonation, getAllDonations, getDonationStats } from "@/app/lib/donationStore";
import { getActiveProject } from "@/app/lib/projectStore";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { amount, frequency, name, email, phone, message, isAnonymous, coverFees } = body;
    
    if (!amount || !name || !email) {
      return NextResponse.json(
        { error: "Amount, name, and email are required" },
        { status: 400 }
      );
    }

    // Get the active project
    const activeProject = await getActiveProject();

    const donation = await addDonation({
      projectId: activeProject?._id || null,
      projectName: activeProject?.name || null,
      amount: Number(amount),
      frequency: frequency || "once",
      name,
      email,
      phone: phone || undefined,
      message: message || undefined,
      isAnonymous: isAnonymous || false,
      coverFees: coverFees || false,
    });

    return NextResponse.json(
      { 
        message: "Thank you for your generous donation! You will receive a confirmation email shortly.",
        donation: {
          id: donation._id,
          amount: donation.amount,
          name: donation.name,
          email: donation.email,
          createdAt: donation.createdAt,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing donation:", error);
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

    const donations = await getAllDonations(projectId);
    const stats = await getDonationStats(projectId);
    
    return NextResponse.json(
      { 
        donations,
        stats,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching donations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
