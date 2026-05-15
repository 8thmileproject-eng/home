import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/app/lib/jwt";
import { getCounts, incrementCount } from "@/app/lib/countStore";

async function getUser(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return null;
  return verifyJwt(token);
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const counts = await getCounts(user.email);
    return NextResponse.json({
      registrationCount: counts?.registrationCount || 0,
      nursingCount: counts?.nursingCount || 0,
      doctorCount: counts?.doctorCount || 0,
    }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { type } = await request.json();
    if (!["registration", "nursing", "doctor"].includes(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    await incrementCount(user.email, user.name, type);

    const counts = await getCounts(user.email);
    return NextResponse.json({
      registrationCount: counts?.registrationCount || 0,
      nursingCount: counts?.nursingCount || 0,
      doctorCount: counts?.doctorCount || 0,
    }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
