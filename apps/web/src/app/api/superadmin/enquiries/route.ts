import { NextRequest, NextResponse } from "next/server";
import { superAdminStore } from "../store";

export async function GET() {
  const enquiries = superAdminStore.getEnquiries();
  return NextResponse.json({ success: true, data: enquiries });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, remarks } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: "Missing id or status" }, { status: 400 });
    }

    const updated = superAdminStore.updateEnquiryStatus(id, status, remarks);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Enquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
