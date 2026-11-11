import { NextRequest, NextResponse } from "next/server";
import { superAdminStore } from "../store";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const party = searchParams.get("party") || "ALL";
  const electionType = searchParams.get("electionType") || "ALL";
  const status = searchParams.get("status") || "ALL";
  const search = searchParams.get("search") || "";

  const list = superAdminStore.getCandidates({ party, electionType, status, search });
  return NextResponse.json({
    success: true,
    total: list.length,
    data: list,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newCand = superAdminStore.addCandidate(body);
    return NextResponse.json({ success: true, data: newCand }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
