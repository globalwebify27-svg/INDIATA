import { NextRequest, NextResponse } from "next/server";
import { centralVoterStore } from "@/lib/voters/central-voter-store";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/issues/[id]
export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const all = centralVoterStore.getAllTickets();
    const ticket = all.find((t) => t.id === id || t.ticketNumber === id);

    if (!ticket) {
      return NextResponse.json(
        { success: false, error: `Ticket record not found for ID: ${id}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    console.error("GET /api/issues/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve issue ticket" },
      { status: 500 }
    );
  }
}

// PATCH /api/issues/[id]
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const { followUpNote, ...updates } = body;
    const updated = centralVoterStore.updateTicket(id, updates, followUpNote);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: `Ticket record not found for ID: ${id}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Ticket updated successfully.",
    });
  } catch (error) {
    console.error("PATCH /api/issues/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update ticket" },
      { status: 500 }
    );
  }
}
