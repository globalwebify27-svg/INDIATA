import { NextResponse } from "next/server";
import { superAdminStore } from "../store";

export async function GET() {
  const campaigns = superAdminStore.getCampaigns();
  const telemetry = superAdminStore.getCampaignTelemetry();
  return NextResponse.json({
    success: true,
    data: {
      campaigns,
      telemetry,
    },
  });
}
