import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { Resend } from "resend";
import { getAllDonations } from "@/app/lib/donationStore";
import { getAllPartners } from "@/app/lib/partnerStore";
import { getActiveProject } from "@/app/lib/projectStore";

const resend = new Resend(process.env.supportmail);

async function getDb() {
  const client = await clientPromise;
  return client.db("8thmileproject");
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    const db = await getDb();
    
    // Fetch volunteers from MongoDB
    const volFilter: Record<string, any> = {};
    if (projectId) volFilter.projectId = projectId;
    const volunteers = await db.collection("volunteer_applications").find(volFilter, { projection: { fullName: 1, email: 1, roleTitle: 1, status: 1 } }).toArray();
    
    // Fetch partners and donors from MongoDB stores
    const partners = await getAllPartners(projectId);
    const donors = await getAllDonations(projectId);

    // Format for the UI
    const contacts = [
      ...volunteers.filter(v => v.email).map(v => ({ id: v._id.toString(), type: 'volunteer', name: v.fullName, email: v.email, detail: `${v.roleTitle} (${v.status || 'pending'})`, status: v.status || 'pending' })),
      ...partners.filter(p => p.email).map(p => ({ id: p._id!, type: 'partner', name: p.name, email: p.email, detail: p.partnershipType })),
      // Deduplicate donors by email
      ...Array.from(new Map(donors.filter(d => d.email).map(d => [d.email, { id: d._id!, type: 'donor', name: d.name, email: d.email, detail: 'Donor' }])).values())
    ];

    return NextResponse.json({ contacts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { recipients, subject, message } = await request.json();

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ error: "Recipients are required" }, { status: 400 });
    }
    if (!subject || !message) {
      return NextResponse.json({ error: "Subject and message are required" }, { status: 400 });
    }

    const validRecipients = recipients.filter((r: any) => r && r.email);
    if (validRecipients.length === 0) {
      return NextResponse.json({ error: "No valid email addresses provided" }, { status: 400 });
    }

    // Send emails in batches of 50 to avoid hitting limits or timeouts
    const BATCH_SIZE = 50;
    let successCount = 0;
    
    for (let i = 0; i < validRecipients.length; i += BATCH_SIZE) {
      const batch = validRecipients.slice(i, i + BATCH_SIZE);
      
      const emailPromises = batch.map(recipient => {
        const email = recipient.email;
        const firstName = recipient.name ? recipient.name.split(' ')[0] : 'there';
        const personalizedMessage = message
          .replace(/\[Name\]/gi, firstName)
          .replace(/\[Volunteer’s Name\]/gi, firstName)
          .replace(/\[Volunteer's Name\]/gi, firstName);

        return resend.emails.send({
          from: "The 8th Mile Project <volunteer@support.the8thmileproject.org>",
          to: email,
          subject: subject,
          html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
              <div style="background: #1a3d2e; padding: 24px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 20px;">The 8th Mile Project</h1>
              </div>
              <div style="padding: 32px 24px; color: #4a5568; line-height: 1.6;">
                ${personalizedMessage}
              </div>
              <div style="background: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; margin: 0; font-size: 12px;">© ${new Date().getFullYear()} The 8th Mile Project. All rights reserved.</p>
                <p style="color: #6b7280; margin: 4px 0 0; font-size: 12px;">Abuja, Nigeria</p>
              </div>
            </div>
          `
        });
      });

      const results = await Promise.all(emailPromises);
      
      for (const res of results) {
        if (res.error) {
          console.error("Resend API Error:", res.error);
        } else if (res.data) {
          successCount++;
        }
      }
    }

    if (successCount === 0) {
      return NextResponse.json({ error: "Failed to send emails. Check your Resend domain configuration." }, { status: 500 });
    }

    try {
      const activeProject = await getActiveProject();
      const db = await getDb();
      await db.collection("communication_history").insertOne({
        projectId: activeProject?._id || null,
        projectName: activeProject?.name || null,
        subject,
        message, // The template message with [Name] placeholders
        recipientCount: successCount,
        totalAttempted: validRecipients.length,
        sentTo: validRecipients.map((r: any) => ({ name: r.name, email: r.email, type: r.type })),
        createdAt: new Date()
      });
    } catch (err) {
      console.error("Failed to save communication history:", err);
    }

    return NextResponse.json({ message: `Successfully sent ${successCount} out of ${validRecipients.length} emails` }, { status: 200 });
  } catch (error) {
    console.error("Error sending emails:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
