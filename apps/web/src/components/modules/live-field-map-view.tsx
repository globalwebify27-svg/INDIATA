"use client";

import React, { useState } from "react";
import {
  Radio,
  Compass,
  Maximize2,
} from "lucide-react";
import { useToast } from "@/context/toast-context";

interface MapPinItem {
  id: string;
  type: "karyakarta" | "issue" | "swing-booth" | "slip-cluster";
  title: string;
  subtitle: string;
  coordinates: { x: number; y: number };
  status: string;
  assignee?: string;
  contact?: string;
  urgency?: "high" | "normal";
}

const MAP_MARKERS: MapPinItem[] = [
  {
    id: "pin-01",
    type: "karyakarta",
    title: "Pooja J. (Squad Alpha)",
    subtitle: "Ward 12, Booth 101 Canvassing",
    coordinates: { x: 180, y: 120 },
    status: "32 Households Verified Today",
    assignee: "Pooja Santosh Jagtap",
    contact: "+91 98901 22334",
  },
  {
    id: "pin-02",
    type: "karyakarta",
    title: "Ganesh P. (Squad Bravo)",
    subtitle: "Ward 14, Booth 106 Canvassing",
    coordinates: { x: 310, y: 150 },
    status: "45 Households Verified Today",
    assignee: "Ganesh P. Bhosale",
    contact: "+91 97654 00987",
  },
  {
    id: "pin-03",
    type: "swing-booth",
    title: "Booth #108 - Deccan Gymkhana",
    subtitle: "Critical Swing Station (44% Slip Delivery)",
    coordinates: { x: 420, y: 180 },
    status: "Reinforcements Dispatched",
    urgency: "high",
  },
  {
    id: "pin-04",
    type: "issue",
    title: "TKT-9210: Low Water Pressure",
    subtitle: "Dahanukar Colony Lane 3 Grievance",
    coordinates: { x: 230, y: 220 },
    status: "Open - 5 Days Reported",
    urgency: "high",
  },
  {
    id: "pin-05",
    type: "slip-cluster",
    title: "Slip Distribution Hub #4",
    subtitle: "Navbharat High School Dispatch Center",
    coordinates: { x: 140, y: 90 },
    status: "1,200 Slips Ready for Delivery",
  },
];

export function LiveFieldMapView() {
  const { showToast } = useToast();
  const [activeFilter, setActiveFilter] = useState<"all" | "karyakarta" | "issue" | "swing">("all");
  const [selectedPin, setSelectedPin] = useState<MapPinItem>(MAP_MARKERS[0]!);

  const filteredPins = MAP_MARKERS.filter((pin) => {
    if (activeFilter === "karyakarta") return pin.type === "karyakarta";
    if (activeFilter === "issue") return pin.type === "issue";
    if (activeFilter === "swing") return pin.type === "swing-booth";
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Map Control Bar */}
      <section className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-brand-600 text-white">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-800 dark:text-white">
                Live Field GPS &amp; Constituency Boundary Telemetry
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-600">
                14 GPS Feeds
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
              Kasba Peth Constituency (AC-215) &bull; Polygon Ward Overlays &bull; Karyakarta Locations
            </p>
          </div>
        </div>

        {/* Map Filter Controls */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === "all"
                ? "bg-[#17243B] text-white"
                : "bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-slate-800"
            }`}
          >
            All Pins (5)
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("karyakarta")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === "karyakarta"
                ? "bg-brand-600 text-white"
                : "bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-slate-800"
            }`}
          >
            Active Squads (2)
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("swing")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === "swing"
                ? "bg-[#F2A93B] text-white"
                : "bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-slate-800"
            }`}
          >
            Swing Booths (1)
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("issue")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === "issue"
                ? "bg-[#E06068] text-white"
                : "bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-slate-800"
            }`}
          >
            Grievances (1)
          </button>
        </div>
      </section>

      {/* Main Interactive Map Canvas + Inspection Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Large Vector Canvas (Span 2) */}
        <div className="lg:col-span-2 relative h-[500px] sm:h-[580px] rounded-xl bg-slate-50 dark:bg-[#0B111D] border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center shadow-premium-xs">
          {/* Subtle Grid Lines */}
          <div
            className="absolute inset-0 opacity-40 dark:opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(#98A2B3 1px, transparent 1px), radial-gradient(#98A2B3 1px, transparent 1px)",
              backgroundSize: "24px 24px",
              backgroundPosition: "0 0, 12px 12px",
            }}
          />

          {/* SVG Map Canvas with Interactive Marker Pins */}
          <svg className="w-full h-full absolute inset-0" viewBox="0 0 600 350" preserveAspectRatio="xMidYMid meet">
            {/* Ward 12 (Kothrud) Polygon */}
            <polygon
              points="100,50 240,65 210,190 70,165"
              fill="#5146D8"
              fillOpacity="0.1"
              stroke="#5146D8"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
            <text x="110" y="75" fill="#5146D8" fontSize="10" fontWeight="bold">
              Ward 12 (Kothrud)
            </text>

            {/* Ward 14 (Erandwane) Polygon */}
            <polygon
              points="245,70 380,85 345,225 215,195"
              fill="#0DAD9B"
              fillOpacity="0.1"
              stroke="#0DAD9B"
              strokeWidth="2"
            />
            <text x="255" y="95" fill="#0DAD9B" fontSize="10" fontWeight="bold">
              Ward 14 (Erandwane)
            </text>

            {/* Ward 18 (Deccan - Swing Zone) */}
            <polygon
              points="385,90 510,105 470,240 350,230"
              fill="#F2A93B"
              fillOpacity="0.12"
              stroke="#F2A93B"
              strokeWidth="2"
            />
            <text x="395" y="115" fill="#F2A93B" fontSize="10" fontWeight="bold">
              Ward 18 (Deccan Swing)
            </text>

            {/* Canvassing Trajectory Path */}
            <path
              d="M 90,170 C 170,70 270,210 370,130 S 470,110 530,180"
              fill="none"
              stroke="#7867E9"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="6 3"
              className="opacity-70"
            />

            {/* Interactive Pins */}
            {filteredPins.map((pin) => {
              const isSelected = selectedPin?.id === pin.id;
              const color =
                pin.type === "karyakarta"
                  ? "#5146D8"
                  : pin.type === "swing-booth"
                  ? "#F2A93B"
                  : pin.type === "issue"
                  ? "#E06068"
                  : "#0DAD9B";

              return (
                <g
                  key={pin.id}
                  onClick={() => setSelectedPin(pin)}
                  className="cursor-pointer group"
                >
                  <circle
                    cx={pin.coordinates.x}
                    cy={pin.coordinates.y}
                    r={isSelected ? "14" : "10"}
                    fill={color}
                    fillOpacity="0.25"
                    className="animate-ping"
                  />
                  <circle
                    cx={pin.coordinates.x}
                    cy={pin.coordinates.y}
                    r={isSelected ? "8" : "6"}
                    fill={color}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                  <text
                    x={pin.coordinates.x + 10}
                    y={pin.coordinates.y + 4}
                    fill="#17243B"
                    fontSize="9.5"
                    fontWeight="bold"
                    className="select-none bg-white/80"
                  >
                    {pin.title.split("(")[0]}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Floating Map Compass & Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button
              type="button"
              className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-slate-800 dark:text-white hover:bg-slate-50"
              title="Recenter Map"
            >
              <Compass className="w-4 h-4 text-brand-600" />
            </button>
            <button
              type="button"
              className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-slate-800 dark:text-white hover:bg-slate-50"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          {/* Map Overlay Bottom Strip */}
          <div className="absolute bottom-3 left-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0DAD9B] animate-pulse" />
              <span>Real-Time GPS Satellite Dispatch: Active</span>
            </span>
            <span className="font-semibold text-slate-800 dark:text-white">
              Kasba Peth AC-215 Bound
            </span>
          </div>
        </div>

        {/* Selected Marker Detail Drawer (Span 1) */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-premium-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Inspection Dossier
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  selectedPin.type === "karyakarta"
                    ? "bg-brand-50 text-brand-600"
                    : selectedPin.type === "swing-booth"
                    ? "bg-amber-50 text-amber-600"
                    : selectedPin.type === "issue"
                    ? "bg-rose-50 text-rose-600"
                    : "bg-emerald-50 text-emerald-600"
                }`}
              >
                {selectedPin.type.toUpperCase()}
              </span>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">
                  {selectedPin.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedPin.subtitle}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="text-xs">
                  <span className="text-slate-500 block">Operational Telemetry:</span>
                  <span className="font-bold text-slate-800 dark:text-white">
                    {selectedPin.status}
                  </span>
                </div>

                {selectedPin.assignee && (
                  <div className="text-xs pt-1 border-t border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 block">Squad Lead:</span>
                    <span className="font-semibold text-slate-800 dark:text-white">
                      {selectedPin.assignee}
                    </span>
                  </div>
                )}

                {selectedPin.contact && (
                  <div className="text-xs pt-1 border-t border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 block">Direct Contact:</span>
                    <span className="font-mono font-medium text-brand-600">
                      {selectedPin.contact}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-800 dark:text-white">
                  Tactical Action Options:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      showToast("info", "GPS Route Dispatched", `Routing Karyakarta team to ${selectedPin.title}.`)
                    }
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-center cursor-pointer"
                  >
                    Reroute Squad
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      showToast("success", "Voter Slips Assigned", `Allocated 500 voter slip packets.`)
                    }
                    className="p-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold text-center cursor-pointer"
                  >
                    Assign Slips
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-center justify-between">
            <span>Coordinates: {selectedPin.coordinates.x}, {selectedPin.coordinates.y}</span>
            <span className="text-emerald-600 font-semibold">100% Signal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
