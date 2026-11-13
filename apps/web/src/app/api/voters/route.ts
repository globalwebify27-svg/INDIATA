import { NextRequest, NextResponse } from "next/server";
import { centralVoterStore } from "@/lib/voters/central-voter-store";
import { createVoterProfileSchema } from "@rajtantra/validation";

// GET /api/voters?q=...&booth=...&limit=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const booth = searchParams.get("booth");
    const orgId = searchParams.get("organizationId") || undefined;
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 15;

    const boothNumbers = booth && booth !== "all" ? [booth] : undefined;

    if (query.trim()) {
      const searchResults = centralVoterStore.searchVoters(query, {
        organizationId: orgId,
        boothNumbers,
        limit,
      });

      return NextResponse.json({
        success: true,
        count: searchResults.length,
        data: searchResults,
      });
    }

    // If no query, return scoped voters list
    const voters = centralVoterStore.getAllVoters(orgId, boothNumbers);
    return NextResponse.json({
      success: true,
      count: voters.length,
      data: voters.slice(0, limit),
    });
  } catch (error) {
    console.error("GET /api/voters error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to search voter registry" },
      { status: 500 }
    );
  }
}

// POST /api/voters - Create new central voter profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = createVoterProfileSchema.safeParse(body);

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed on voter profile input",
          fieldErrors,
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // Extract authentication / karyakarta context if present in headers or payload
    const karyakartaId =
      request.headers.get("x-karyakarta-id") ||
      validatedData.assignedKaryakartaId ||
      "KAR-2026-001";
    const organizationId =
      request.headers.get("x-organization-id") ||
      validatedData.organizationId ||
      "org-kasba-peth-2026";

    const { voter, isDuplicateWarning, duplicateOfId } = centralVoterStore.createVoter(
      validatedData,
      {
        karyakartaId,
        organizationId,
      }
    );

    return NextResponse.json(
      {
        success: true,
        data: voter,
        isDuplicateWarning,
        duplicateOfId,
        message: isDuplicateWarning
          ? "Voter profile already registered with this EPIC ID; flagged for quarantine review without overwriting."
          : "New central voter profile created successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/voters error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error creating voter profile" },
      { status: 500 }
    );
  }
}
