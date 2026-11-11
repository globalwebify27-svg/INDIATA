import { NextRequest, NextResponse } from "next/server";
import { superAdminStore } from "../store";

export async function GET() {
  const settings = superAdminStore.getSettings();
  const notifications = superAdminStore.getNotifications();
  return NextResponse.json({
    success: true,
    data: {
      settings,
      notifications,
      telemetry: {
        apiLatencyMs: 18,
        databaseClusterStatus: "HEALTHY",
        redisClusterStatus: "HEALTHY",
        activeReplicas: 3,
        lastReplicationSync: "12m ago",
      },
    },
  });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = superAdminStore.updateSettings(body);
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
