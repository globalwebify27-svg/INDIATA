import { NextRequest, NextResponse } from "next/server";
import { superAdminStore } from "../../store";

export async function GET() {
  const settlements = superAdminStore.getSettlements();
  return NextResponse.json({ success: true, data: settlements });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing settlement id" }, { status: 400 });
    }

    const updated = superAdminStore.verifySettlement(id);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Settlement batch not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
