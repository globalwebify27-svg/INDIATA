import { NextRequest, NextResponse } from "next/server";
import { centralVoterStore } from "@/lib/voters/central-voter-store";
import { createIssueTicketSchema } from "@rajtantra/validation";

// GET /api/issues?booth=...&organizationId=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const booth = searchParams.get("booth");
    const orgId = searchParams.get("organizationId") || undefined;

    const boothNumbers = booth && booth !== "all" ? [booth] : undefined;
    const tickets = centralVoterStore.getAllTickets(orgId, boothNumbers);

    return NextResponse.json({
      success: true,
      count: tickets.length,
      data: tickets,
    });
  } catch (error) {
    console.error("GET /api/issues error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch issue tickets" },
      { status: 500 }
    );
  }
}

// POST /api/issues - Create new ticket associated with voter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = createIssueTicketSchema.safeParse(body);

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed on ticket payload",
          fieldErrors,
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    const karyakartaId =
      request.headers.get("x-karyakarta-id") ||
      validatedData.karyakartaId ||
      "KAR-2026-001";
    const karyakartaName =
      request.headers.get("x-karyakarta-name") ||
      validatedData.karyakartaName ||
      "Sachin D. Mane";
    const organizationId =
      request.headers.get("x-organization-id") ||
      validatedData.organizationId ||
      "org-kasba-peth-2026";

    // Create ticket atomically in store
    const ticket = centralVoterStore.createTicket(
      {
        ...validatedData,
        voterId: validatedData.voterId ?? null,
      },
      {
        karyakartaId,
        karyakartaName,
        organizationId,
      }
    );

    return NextResponse.json(
      {
        success: true,
        data: ticket,
        message: `Issue ticket ${ticket.ticketNumber} created successfully.`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/issues error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error creating issue ticket" },
      { status: 500 }
    );
  }
}
