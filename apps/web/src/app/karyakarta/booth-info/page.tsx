"use client";

import React from "react";
import {
  MapPin,
  Phone,
  MessageCircle,
  Users,
  Navigation,
  Building,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { useKaryakartaAuth } from "../../../karyakarta/context/karyakarta-auth-context";
import { useKaryakartaLanguage } from "../../../karyakarta/context/karyakarta-language-context";
import { MOCK_BOOTHS } from "../../../karyakarta/data/mock-karyakarta-data";
import { PollingBooth } from "../../../karyakarta/types/karyakarta.types";

export default function BoothInfoPage() {
  const { user } = useKaryakartaAuth();
  const { t } = useKaryakartaLanguage();

  // Filter booths assigned to the current Karyakarta
  const assignedBooths = MOCK_BOOTHS.filter((b) => {
    if (!user?.assignedBooths?.length) return true;
    return user.assignedBooths.includes(b.boothNumber);
  });

  const totalAssignedVoters = assignedBooths.reduce((acc, b) => acc + b.totalVoters, 0);
  const totalMaleVoters = assignedBooths.reduce((acc, b) => acc + b.maleVoters, 0);
  const totalFemaleVoters = assignedBooths.reduce((acc, b) => acc + b.femaleVoters, 0);

  const handleOpenBloWhatsApp = (blo: PollingBooth) => {
    const cleanPhone = blo.bloPhone.replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(
      `सादर नमस्कार ${blo.bloName} सर/मॅडम (BLO, Booth ${blo.boothNumber}),\n\nमी ${user?.name || "Sachin Mane"} (स्थानिक बूथ कार्यकर्ता). आगामी निवडणुकीच्या मतदार यादी अद्ययावतीकरण व मतदार स्लिप वाटपासंदर्भात आपणास संपर्क करत आहे.\n\nधन्यवाद.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400">
              ECI Polling Station Roll
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Constituency: {user?.constituencyName || "215 - Kasba Peth Assembly"}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Building className="w-6 h-6 text-[#2087fe]" />
            {t("booth.title", "Booth Information & BLO Registry")}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Official Election Commission polling station coordinates, voter roll statistics, and direct contact details for Booth Level Officers (BLO).
          </p>
        </div>

        {/* Assigned Area Tag */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl">
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Assigned Field Sector:
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">
            {user?.assignedArea || "Shaniwar Peth & Raviwar Peth"}
          </div>
        </div>
      </div>

      {/* Aggregate Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-500 font-medium mb-1">Allocated Booths</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>{assignedBooths.length}</span>
            <span className="text-xs font-mono font-normal text-slate-400">Stations</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-500 font-medium mb-1">Total Roll Strength</div>
          <div className="text-2xl font-black text-[#2087fe] flex items-center gap-2">
            <span>{totalAssignedVoters.toLocaleString()}</span>
            <span className="text-xs font-normal text-slate-400">Electors</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-500 font-medium mb-1">Male Electors</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {totalMaleVoters.toLocaleString()}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-500 font-medium mb-1">Female Electors</div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
            {totalFemaleVoters.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Booth Cards List */}
      <div className="space-y-6">
        {assignedBooths.map((booth) => {
          return (
            <div
              key={booth.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-shadow"
            >
              {/* Card Top Banner */}
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#2087fe] to-[#6256d9] text-white flex flex-col items-center justify-center font-black">
                    <span className="text-[10px] uppercase tracking-wider opacity-80 leading-none">Booth</span>
                    <span className="text-base leading-none mt-0.5">{booth.boothNumber}</span>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      {booth.boothName}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{booth.partNumber}</span>
                      <span>•</span>
                      <span>Centre: {booth.pollingCentre}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={booth.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-blue-50 dark:bg-blue-950 text-[#2087fe] hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Google Maps Directions
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                </div>
              </div>

              {/* Card Content Grid */}
              <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Column 1: Polling Station Location & Coordinates */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5 text-[#2087fe]" />
                    Location & Physical Facility
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 text-xs space-y-2">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">
                        Full Address:
                      </span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        {booth.pollingAddress}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-slate-500">
                      <span>GPS Coordinates:</span>
                      <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                        {booth.latitude}, {booth.longitude}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Station Amenities:
                      </span>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800">
                          ✓ Wheelchair Ramp
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800">
                          ✓ Drinking Water
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800">
                          ✓ CCTV Surveillance
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2: Demographic Roll Metrics */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wider">
                    <Users className="w-3.5 h-3.5 text-purple-600" />
                    Voter Roll Demographics
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">Total Electors:</span>
                      <span className="text-base font-extrabold text-slate-900 dark:text-white">
                        {booth.totalVoters}
                      </span>
                    </div>

                    {/* Progress Bar Male vs Female */}
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-blue-600 font-semibold">
                          Male: {booth.maleVoters} ({Math.round((booth.maleVoters / booth.totalVoters) * 100)}%)
                        </span>
                        <span className="text-purple-600 font-semibold">
                          Female: {booth.femaleVoters} ({Math.round((booth.femaleVoters / booth.totalVoters) * 100)}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-purple-200 dark:bg-purple-950 overflow-hidden flex">
                        <div
                          className="h-full bg-blue-500"
                          style={{
                            width: `${Math.round((booth.maleVoters / booth.totalVoters) * 100)}%`,
                          }}
                        />
                        <div
                          className="h-full bg-purple-500"
                          style={{
                            width: `${Math.round((booth.femaleVoters / booth.totalVoters) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500">
                      <span>Assigned Field Cadre:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {booth.assignedKaryakartas.join(", ")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Column 3: Booth Level Officer (BLO) Profile */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Booth Level Officer (BLO)
                  </div>
                  <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-50/60 via-slate-50 to-white dark:from-emerald-950/20 dark:via-slate-800/40 dark:to-slate-800/20 border border-emerald-200/80 dark:border-emerald-800/60 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                          BLO
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white">
                            {booth.bloName}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {booth.bloDesignation}
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5" />
                        {booth.bloPhone}
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-emerald-100 dark:border-emerald-900/40 grid grid-cols-2 gap-2">
                      <a
                        href={`tel:${booth.bloPhone.replace(/[^0-9+]/g, "")}`}
                        className="py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Call BLO
                      </a>
                      <button
                        type="button"
                        onClick={() => handleOpenBloWhatsApp(booth)}
                        className="py-1.5 px-2 rounded-lg bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
