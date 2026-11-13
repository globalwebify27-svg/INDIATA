import { NextRequest, NextResponse } from "next/server";
import { centralVoterStore } from "@/lib/voters/central-voter-store";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/voters/[id]
export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    let voter = centralVoterStore.getVoterById(id);

    // Fallback search by EPIC if not matched by ID
    if (!voter) {
      voter = centralVoterStore.getVoterByEpic(id);
    }

    if (!voter) {
      return NextResponse.json(
        { success: false, error: `Voter record not found for ID/EPIC: ${id}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: voter,
    });
  } catch (error) {
    console.error("GET /api/voters/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve voter record" },
      { status: 500 }
    );
  }
}

// PATCH /api/voters/[id]
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const updated = centralVoterStore.updateVoter(id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: `Voter record not found for ID: ${id}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Voter profile updated successfully.",
    });
  } catch (error) {
    console.error("PATCH /api/voters/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update voter record" },
      { status: 500 }
    );
  }
}
