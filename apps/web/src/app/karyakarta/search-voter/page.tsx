"use client";

import React from "react";
import { useKaryakartaAuth } from "@/karyakarta/context/karyakarta-auth-context";
import { VoterManagementView } from "@/components/candidate/modules/voter-management-view";

export default function SearchVoterPage() {
  const { user, assignedBooths } = useKaryakartaAuth();

  return (
    <div className="space-y-6">
      <VoterManagementView
        portalMode="KARYAKARTA"
        assignedBooths={assignedBooths}
        cadreUserName={user ? `${user.name} (${user.role})` : undefined}
        cadreUserId={user?.id}
      />
    </div>
  );
}
