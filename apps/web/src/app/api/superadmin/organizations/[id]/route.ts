import { NextRequest, NextResponse } from "next/server";
import { superAdminStore } from "../../store";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const org = superAdminStore.getOrganizationById(id);
  if (!org) {
    return NextResponse.json({ success: false, error: "Organization not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: org });
}
