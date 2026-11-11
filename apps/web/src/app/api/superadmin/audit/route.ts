import { NextRequest, NextResponse } from "next/server";
import { superAdminStore } from "../store";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || undefined;
  const moduleName = searchParams.get("module") || undefined;

  const audits = superAdminStore.getAudits(search, moduleName);
  return NextResponse.json({
    success: true,
    total: audits.length,
    data: audits,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { format } = body;

    // Log the statutory compliance export event
    superAdminStore.logAudit(
      "STATUTORY_AUDIT_LEDGER_EXPORTED",
      "Security Audit",
      `ECI Compliance Export (${format || "CSV"})`,
      `EXP-${Date.now().toString().slice(-4)}`
    );

    return NextResponse.json({
      success: true,
      message: `Audit ledger exported successfully in ${format || "CSV"} format.`,
      exportedAt: new Date().toISOString(),
      recordCount: superAdminStore.getAudits().length,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
