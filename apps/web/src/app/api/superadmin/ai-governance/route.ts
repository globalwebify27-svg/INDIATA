import { NextRequest, NextResponse } from "next/server";
import { superAdminStore } from "../store";

export async function GET() {
  const stats = superAdminStore.getAiGovernanceStats();
  return NextResponse.json({ success: true, data: stats });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, additionalSeats } = body;

    if (!id || typeof additionalSeats !== "number") {
      return NextResponse.json({ success: false, error: "Missing id or additionalSeats" }, { status: 400 });
    }

    const updated = superAdminStore.updateAiTenantQuota(id, additionalSeats);
    if (!updated) {
      return NextResponse.json({ success: false, error: "AI tenant record not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
