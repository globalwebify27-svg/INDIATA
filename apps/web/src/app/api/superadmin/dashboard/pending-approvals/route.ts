import { NextRequest, NextResponse } from "next/server";
import { superAdminStore } from "../../store";

export async function GET() {
  const approvals = superAdminStore.getPendingApprovals();
  return NextResponse.json({ success: true, data: approvals });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, action } = body;

    if (!id || !action) {
      return NextResponse.json({ success: false, error: "Missing id or action" }, { status: 400 });
    }

    const updated = superAdminStore.handleApprovalAction(id, action);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
