import { NextRequest, NextResponse } from "next/server";
import { superAdminStore } from "../store";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "ALL";
  const electionType = searchParams.get("electionType") || "ALL";
  const search = searchParams.get("search") || "";

  const list = superAdminStore.getOrganizations({ status, electionType, search });
  return NextResponse.json({
    success: true,
    total: list.length,
    data: list,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newOrg = superAdminStore.addOrganization(body);
    return NextResponse.json({ success: true, data: newOrg }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
