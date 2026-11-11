import { NextRequest, NextResponse } from "next/server";
import { superAdminStore } from "../store";

export async function GET() {
  const licenses = superAdminStore.getLicenses();
  return NextResponse.json({
    success: true,
    total: licenses.length,
    data: licenses,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { candidateName, planName, amount } = body;

    if (!candidateName || !planName) {
      return NextResponse.json({ success: false, error: "Missing candidateName or planName" }, { status: 400 });
    }

    const newLic = superAdminStore.generateLicense(candidateName, planName, amount || "₹2,50,000");
    return NextResponse.json({ success: true, data: newLic }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
