import { NextResponse } from "next/server";
import { superAdminStore } from "../store";

export async function GET() {
  const overview = superAdminStore.getDashboardOverview();
  return NextResponse.json({ success: true, data: overview });
}
