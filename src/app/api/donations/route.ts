import { NextRequest, NextResponse } from "next/server";
import { donationStore } from "@/app/lib/donationStore";

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

    // Save donation to store
    const donation = donationStore.add({
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
          id: donation.id,
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

export async function GET() {
  try {
    const donations = donationStore.getAll();
    const stats = donationStore.getStats();
    
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
