import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
import { Resend } from "resend";
import { getActiveProject } from "@/app/lib/projectStore";

const DB_NAME = "8thmileproject";
const COLLECTION = "volunteer_applications";
const resend = new Resend(process.env.supportmail);

async function sendConfirmationEmail(fullName: string, email: string, roleTitle: string) {
  try {
    await resend.emails.send({
      from: "The 8th Mile Project <volunteer@support.the8thmileproject.org>",
      to: email,
      subject: `Application Received — ${roleTitle}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: #1a3d2e; padding: 32px 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">The 8th Mile Project</h1>
            <p style="color: #4ade80; margin: 8px 0 0; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">Volunteer Application</p>
          </div>
          <div style="padding: 32px 24px;">
            <h2 style="color: #1a3d2e; margin: 0 0 16px; font-size: 20px;">Thank you, ${fullName}! 🎉</h2>
            <p style="color: #4a5568; line-height: 1.7; font-size: 15px;">
              We have received your application for the <strong style="color: #1a3d2e;">${roleTitle}</strong> position. 
              Our team will review your application and get back to you shortly.
            </p>
            <div style="background: #f0fdf4; border-left: 4px solid #4ade80; padding: 16px 20px; margin: 24px 0; border-radius: 0 8px 8px 0;">
              <p style="color: #1a3d2e; margin: 0; font-size: 14px; font-weight: 600;">What happens next?</p>
              <ul style="color: #4a5568; margin: 8px 0 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
                <li>Our team reviews your application (1–3 business days)</li>
                <li>You may be contacted for a brief conversation</li>
                <li>Once accepted, you'll receive onboarding details</li>
              </ul>
            </div>
            <p style="color: #4a5568; line-height: 1.7; font-size: 15px;">
              If you have any questions in the meantime, feel free to reach out at 
              <a href="mailto:info@the8thmileproject.org" style="color: #1a3d2e; font-weight: 600;">info@the8thmileproject.org</a>.
            </p>
            <p style="color: #4a5568; line-height: 1.7; font-size: 15px; margin-top: 24px;">
              God bless you for your willingness to serve! 🙏
            </p>
            <p style="color: #1a3d2e; font-weight: 600; font-size: 15px; margin-top: 8px;">— The 8th Mile Project Team</p>
          </div>
          <div style="background: #f7fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #a0aec0; font-size: 12px; margin: 0;">The 8th Mile Project © ${new Date().getFullYear()} · Abuja, Nigeria</p>
            <p style="color: #a0aec0; font-size: 12px; margin: 4px 0 0;">The missions' arm of YWAP — Matthew 25:35-40</p>
          </div>
        </div>
      `,
    });
    console.log("Confirmation email sent to:", email);
  } catch (emailErr) {
    console.error("Failed to send confirmation email:", emailErr);
    // Don't throw — email failure shouldn't block the application
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { roleId, roleTitle, fullName, email, phone, location, education, fieldOfStudy, motivation, uniqueValue, hoursPerWeek, availableStartDate } = body;

    if (!roleId || !fullName || !email || !phone || !location || !education || !fieldOfStudy || !motivation || !uniqueValue || !hoursPerWeek || !availableStartDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Get the active project
    const activeProject = await getActiveProject();

    const application = {
      projectId: activeProject?._id || null,
      projectName: activeProject?.name || null,
      roleId,
      roleTitle: roleTitle || roleId,
      fullName,
      email,
      phone,
      location,
      education,
      fieldOfStudy,
      occupation: body.occupation || null,
      motivation,
      uniqueValue,
      hoursPerWeek,
      availableStartDate,
      portfolioLinks: body.portfolioLinks || null,
      referenceName: body.referenceName || null,
      referenceRelationship: body.referenceRelationship || null,
      referenceContact: body.referenceContact || null,
      roleSpecificAnswers: body.roleSpecificAnswers || {},
      status: "pending",
      createdAt: new Date(),
    };

    const result = await db.collection(COLLECTION).insertOne(application);
    console.log("Volunteer application saved to MongoDB:", result.insertedId, fullName, roleTitle);

    // Send confirmation email (non-blocking)
    sendConfirmationEmail(fullName, email, application.roleTitle);

    return NextResponse.json(
      {
        message: "Volunteer application submitted successfully",
        application: {
          id: result.insertedId,
          fullName,
          roleTitle: application.roleTitle,
          createdAt: application.createdAt,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing volunteer application:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Support filtering by projectId
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const filter: Record<string, any> = {};
    if (projectId) filter.projectId = projectId;

    const applications = await db.collection(COLLECTION).find(filter).sort({ createdAt: -1 }).toArray();

    const total = applications.length;
    const pending = applications.filter(a => a.status === "pending").length;
    const accepted = applications.filter(a => a.status === "accepted").length;
    const rejected = applications.filter(a => a.status === "rejected").length;

    return NextResponse.json({
      applications,
      stats: { total, pending, accepted, rejected }
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching volunteer applications:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const result = await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Status updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating volunteer application:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
