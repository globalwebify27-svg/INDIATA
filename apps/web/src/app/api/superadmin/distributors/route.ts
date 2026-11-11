import { NextRequest, NextResponse } from "next/server";
import { superAdminStore } from "../store";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || undefined;
  const list = superAdminStore.getDistributors(search);
  return NextResponse.json({ success: true, total: list.length, data: list });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newDist = superAdminStore.addDistributor(body);
    return NextResponse.json({ success: true, data: newDist }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
