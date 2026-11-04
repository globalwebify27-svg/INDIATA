import { PortalType, UserRole, PortalAccessInfo } from "@rajtantra/common-types";

declare const process: {
  env: Record<string, string | undefined>;
};

/**
 * Standard environment-aware portal URL mapping.
 */
export function getPortalBaseUrl(portal: PortalType): string {
  if (typeof window === "undefined") {
    switch (portal) {
      case "SUPER_ADMIN":
        return process.env.NEXT_PUBLIC_SUPERADMIN_URL || "http://localhost:3000";
      case "CANDIDATE_WAR_ROOM":
        return process.env.NEXT_PUBLIC_CANDIDATE_URL || "http://localhost:3001";
      case "DISTRIBUTOR_PARTNER":
        return process.env.NEXT_PUBLIC_DISTRIBUTOR_URL || "http://localhost:3002";
      case "KARYAKARTA_FIELD":
        return process.env.NEXT_PUBLIC_KARYAKARTA_URL || "http://localhost:3003";
    }
  }

  // Client-side execution
  switch (portal) {
    case "SUPER_ADMIN":
      return (
        process.env.NEXT_PUBLIC_SUPERADMIN_URL ||
        (window.location.hostname.includes("vercel.app")
          ? "https://rajtantra-web-superadmin.vercel.app"
          : "http://localhost:3000")
      );
    case "CANDIDATE_WAR_ROOM":
      return (
        process.env.NEXT_PUBLIC_CANDIDATE_URL ||
        (window.location.hostname.includes("vercel.app")
          ? "https://rajtantra-web-candidate.vercel.app"
          : "http://localhost:3001")
      );
    case "DISTRIBUTOR_PARTNER":
      return (
        process.env.NEXT_PUBLIC_DISTRIBUTOR_URL ||
        (window.location.hostname.includes("vercel.app")
          ? "https://rajtantra-web-distributor.vercel.app"
          : "http://localhost:3002")
      );
    case "KARYAKARTA_FIELD":
      return (
        process.env.NEXT_PUBLIC_KARYAKARTA_URL ||
        (window.location.hostname.includes("vercel.app")
          ? "https://rajtantra-web-karyakarta.vercel.app"
          : "http://localhost:3003")
      );
  }
}

/**
 * Evaluates default portal descriptors for a verified user role.
 */
export function buildDefaultPortalInfo(
  role: UserRole,
  organizationName?: string | null,
  constituencyName?: string | null,
): PortalAccessInfo[] {
  const portals: PortalAccessInfo[] = [];

  if (role === UserRole.SUPER_ADMIN) {
    portals.push({
      portalKey: "SUPER_ADMIN",
      title: "Super Admin Platform Command",
      subtitle: "Multi-tenant War Room Infrastructure, KYC & Licencing",
      url: getPortalBaseUrl("SUPER_ADMIN"),
      role: UserRole.SUPER_ADMIN,
      isDefault: true,
    });
    // Super admin also has supervisory preview access into candidate war rooms
    portals.push({
      portalKey: "CANDIDATE_WAR_ROOM",
      title: "Candidate War Room (Supervisory Mode)",
      subtitle: "Inspect live booth readiness & GIS telemetry across constituencies",
      url: `${getPortalBaseUrl("CANDIDATE_WAR_ROOM")}/dashboard`,
      role: UserRole.SUPER_ADMIN,
      isDefault: false,
    });
    return portals;
  }

  if (role === UserRole.CANDIDATE_ADMIN) {
    portals.push({
      portalKey: "CANDIDATE_WAR_ROOM",
      title: organizationName || "Constituency War Room",
      subtitle: constituencyName ? `Constituency: ${constituencyName}` : "Voter intelligence, GIS telemetry & cadre command",
      url: `${getPortalBaseUrl("CANDIDATE_WAR_ROOM")}/dashboard`,
      role: UserRole.CANDIDATE_ADMIN,
      organizationName,
      constituencyName,
      isDefault: true,
    });
    return portals;
  }

  if (role === UserRole.DISTRIBUTOR) {
    portals.push({
      portalKey: "DISTRIBUTOR_PARTNER",
      title: "Distributor Partner Network",
      subtitle: "Agency onboarding, candidate allocation & commission ledger",
      url: getPortalBaseUrl("DISTRIBUTOR_PARTNER"),
      role: UserRole.DISTRIBUTOR,
      isDefault: true,
    });
    return portals;
  }

  // Karyakarta
  portals.push({
    portalKey: "KARYAKARTA_FIELD",
    title: "Field Karyakarta Canvassing",
    subtitle: "Booth voter slip handoff & family survey check-ins",
    url: getPortalBaseUrl("KARYAKARTA_FIELD"),
    role: UserRole.KARYAKARTA,
    isDefault: true,
  });

  return portals;
}
