import { NextRequest, NextResponse } from "next/server";
import { superAdminStore } from "../../../store";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, reason } = body;

    if (!status) {
      return NextResponse.json({ success: false, error: "Missing status" }, { status: 400 });
    }

    const updated = superAdminStore.updateOrganizationStatus(id, status, reason);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Organization not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
