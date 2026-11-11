import { NextRequest, NextResponse } from "next/server";
import { superAdminStore } from "../../../store";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const updated = superAdminStore.toggleDistributorStatus(id);
  if (!updated) {
    return NextResponse.json({ success: false, error: "Distributor not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: updated });
}
