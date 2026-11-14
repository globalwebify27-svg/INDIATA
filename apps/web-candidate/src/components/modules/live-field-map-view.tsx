"use client";

import React, { useState } from "react";
import {
  Radio,
  Compass,
  Maximize2,
  Layers,
  Check,
  ChevronDown,
  ChevronUp,
  MapPin,
  Users,
  FileText,
  Navigation,
  Phone,
} from "lucide-react";
import { useToast } from "@/context/toast-context";

export type MapPinType =
  | "karyakarta"
  | "issue"
  | "focus-booth"
  | "slip-cluster"
  | "slips-delivered"
  | "whatsapp-slips";

export interface MapPinItem {
  id: string;
  type: MapPinType;
  title: string;
  subtitle: string;
  coordinates: { x: number; y: number; lat: string; lng: string };
  status: string;
  assignee?: string;
  contact?: string;
  urgency?: "high" | "normal";
  metric?: string;
}

const ALL_MAP_MARKERS: MapPinItem[] = [
  {
    id: "pin-01",
    type: "karyakarta",
    title: "Pooja J. (Squad Alpha)",
    subtitle: "Ward 12, Booth 101 Canvassing",
    coordinates: { x: 180, y: 120, lat: "18.5224° N", lng: "73.8528° E" },
    status: "32 Households Verified Today",
    assignee: "Pooja Santosh Jagtap",
    contact: "+91 98901 22334",
    metric: "Battery 88% • GPS Active",
  },
  {
    id: "pin-02",
    type: "karyakarta",
    title: "Ganesh P. (Squad Bravo)",
    subtitle: "Ward 14, Booth 106 Canvassing",
    coordinates: { x: 310, y: 150, lat: "18.5245° N", lng: "73.8552° E" },
    status: "45 Households Verified Today",
    assignee: "Ganesh P. Bhosale",
    contact: "+91 97654 00987",
    metric: "Battery 64% • GPS Active",
  },
  {
    id: "pin-03",
    type: "focus-booth",
    title: "Booth #108 - Deccan Gymkhana",
    subtitle: "Critical Focus Station (44% Slip Delivery)",
    coordinates: { x: 420, y: 180, lat: "18.5258° N", lng: "73.8576° E" },
    status: "Reinforcements Dispatched • 2 Agents On-Site",
    urgency: "high",
    metric: "Target: 1,450 Voters",
  },
  {
    id: "pin-04",
    type: "issue",
    title: "TKT-9210: Low Water Pressure",
    subtitle: "Dahanukar Colony Lane 3 Grievance",
    coordinates: { x: 230, y: 220, lat: "18.5218° N", lng: "73.8540° E" },
    status: "Open - 5 Days Reported • PMC Escalated",
    urgency: "high",
    metric: "14 Households Affected",
  },
  {
    id: "pin-05",
    type: "slip-cluster",
    title: "Slip Distribution Hub #4",
    subtitle: "Navbharat High School Dispatch Center",
    coordinates: { x: 140, y: 90, lat: "18.5210° N", lng: "73.8515° E" },
    status: "1,200 Slips Ready for Field Dispatch",
    metric: "Batch #4 Ready",
  },
  {
    id: "pin-06",
    type: "slips-delivered",
    title: "Sector 4 Physical Slips",
    subtitle: "Appa Balwant Chowk Residential Wing",
    coordinates: { x: 260, y: 110, lat: "18.5238° N", lng: "73.8546° E" },
    status: "94% Physical Voter Slips In-Hand Verified",
    metric: "842 of 895 Slips",
  },
  {
    id: "pin-07",
    type: "whatsapp-slips",
    title: "Sector 1 Digital Blast Hub",
    subtitle: "Shanipar Chowk Online Delivery Hub",
    coordinates: { x: 380, y: 125, lat: "18.5251° N", lng: "73.8568° E" },
    status: "3,400 Digital Slips Pushed via Official API",
    metric: "98.2% Delivery Rate",
  },
];

interface LayerToggles {
  slipsDelivered: boolean;
  whatsappSlips: boolean;
  issues: boolean;
  workers: boolean;
  booths: boolean;
  clusters: boolean;
}

export function LiveFieldMapView() {
  const { showToast } = useToast();
  const [selectedPin, setSelectedPin] = useState<MapPinItem>(ALL_MAP_MARKERS[0]!);
  const [isLayerPanelOpen, setIsLayerPanelOpen] = useState(true);

  // 6 persistent map layers specified in Section 4
  const [layers, setLayers] = useState<LayerToggles>({
    slipsDelivered: true,
    whatsappSlips: true,
    issues: true,
    workers: true,
    booths: true,
    clusters: true,
  });

  const toggleLayer = (layerKey: keyof LayerToggles) => {
    setLayers((prev) => ({
      ...prev,
      [layerKey]: !prev[layerKey],
    }));
  };

  const filteredPins = ALL_MAP_MARKERS.filter((pin) => {
    if (pin.type === "karyakarta" && !layers.workers) return false;
    if (pin.type === "focus-booth" && !layers.booths) return false;
    if (pin.type === "issue" && !layers.issues) return false;
    if (pin.type === "slips-delivered" && !layers.slipsDelivered) return false;
    if (pin.type === "whatsapp-slips" && !layers.whatsappSlips) return false;
    if (pin.type === "slip-cluster" && !layers.clusters) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Map Control Bar (No obscuring filter chips) */}
      <section className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-brand-600 text-white shadow-sm">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-800 dark:text-white">
                Live Field GPS &amp; Constituency Boundary Telemetry
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                14 GPS Feeds Active
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Kasba Peth Constituency (AC-215) &bull; Polygon Ward Overlays &bull; Karyakarta Live Tracks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 hidden sm:inline">
            Grid: 18.5220° N, 73.8540° E
          </span>
          <button
            type="button"
            onClick={() =>
              showToast("info", "Satellite Sync Refreshed", "GPS satellite links re-synced across 14 field units.")
            }
            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold transition-all cursor-pointer"
          >
            Refresh Telemetry
          </button>
        </div>
      </section>

      {/* Main Interactive Map Canvas + Inspection Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Large Vector Canvas (Span 2) */}
        <div className="lg:col-span-2 relative h-[520px] sm:h-[620px] rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center shadow-premium-xs select-none">
          {/* Subtle Radar/Grid Background */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(#6256D9 1px, transparent 1px), radial-gradient(#6256D9 1px, transparent 1px)",
              backgroundSize: "28px 28px",
              backgroundPosition: "0 0, 14px 14px",
            }}
          />

          {/* Geodetic Latitude & Longitude Coordinate Marks along Viewport Edges */}
          <div className="absolute top-2 left-6 right-6 flex justify-between text-[9.5px] font-mono text-slate-400 pointer-events-none z-10">
            <span>18.5210° N</span>
            <span>18.5230° N</span>
            <span>18.5250° N</span>
            <span>18.5270° N</span>
          </div>

          <div className="absolute bottom-10 left-6 right-6 flex justify-between text-[9.5px] font-mono text-slate-400 pointer-events-none z-10">
            <span>73.8500° E</span>
            <span>73.8525° E</span>
            <span>73.8550° E</span>
            <span>73.8575° E</span>
          </div>

          <div className="absolute top-10 bottom-14 left-2 flex flex-col justify-between text-[9.5px] font-mono text-slate-400 pointer-events-none z-10 [writing-mode:vertical-lr] rotate-180">
            <span>LAT 18.5204°</span>
            <span>LAT 18.5242°</span>
            <span>LAT 18.5280°</span>
          </div>

          <div className="absolute top-10 bottom-14 right-2 flex flex-col justify-between text-[9.5px] font-mono text-slate-400 pointer-events-none z-10 [writing-mode:vertical-lr]">
            <span>LON 73.8510°</span>
            <span>LON 73.8548°</span>
            <span>LON 73.8586°</span>
          </div>

          {/* SVG Map Canvas with Interactive Marker Pins */}
          <svg className="w-full h-full absolute inset-0" viewBox="0 0 600 350" preserveAspectRatio="xMidYMid meet">
            {/* Grid Crosshairs */}
            <line x1="0" y1="175" x2="600" y2="175" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
            <line x1="300" y1="0" x2="300" y2="350" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />

            {/* Ward 12 (Kothrud) Polygon */}
            <polygon
              points="100,50 240,65 210,190 70,165"
              fill="#6256D9"
              fillOpacity="0.12"
              stroke="#6256D9"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
            <text x="110" y="75" fill="#A5B4FC" fontSize="10" fontWeight="bold">
              Ward 12 (Kothrud Zone)
            </text>

            {/* Ward 14 (Erandwane) Polygon */}
            <polygon
              points="245,70 380,85 345,225 215,195"
              fill="#0DAD9B"
              fillOpacity="0.12"
              stroke="#0DAD9B"
              strokeWidth="2"
            />
            <text x="255" y="95" fill="#5EEAD4" fontSize="10" fontWeight="bold">
              Ward 14 (Erandwane Zone)
            </text>

            {/* Ward 18 (Deccan Focus Zone - Purged Swing) */}
            <polygon
              points="385,90 510,105 470,240 350,230"
              fill="#F59E0B"
              fillOpacity="0.14"
              stroke="#F59E0B"
              strokeWidth="2"
            />
            <text x="395" y="115" fill="#FCD34D" fontSize="10" fontWeight="bold">
              Ward 18 (Deccan Focus Zone)
            </text>

            {/* Canvassing Trajectory Path */}
            <path
              d="M 90,170 C 170,70 270,210 370,130 S 470,110 530,180"
              fill="none"
              stroke="#818CF8"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="6 3"
              className="opacity-60"
            />

            {/* Interactive Pins */}
            {filteredPins.map((pin) => {
              const isSelected = selectedPin?.id === pin.id;
              let color = "#6256D9";
              if (pin.type === "focus-booth") color = "#F59E0B";
              if (pin.type === "issue") color = "#EF4444";
              if (pin.type === "slips-delivered") color = "#10B981";
              if (pin.type === "whatsapp-slips") color = "#06B6D4";
              if (pin.type === "slip-cluster") color = "#8B5CF6";

              return (
                <g
                  key={pin.id}
                  onClick={() => setSelectedPin(pin)}
                  className="cursor-pointer group"
                >
                  <circle
                    cx={pin.coordinates.x}
                    cy={pin.coordinates.y}
                    r={isSelected ? "15" : "10"}
                    fill={color}
                    fillOpacity="0.3"
                    className="animate-ping"
                  />
                  <circle
                    cx={pin.coordinates.x}
                    cy={pin.coordinates.y}
                    r={isSelected ? "9" : "6.5"}
                    fill={color}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                  <text
                    x={pin.coordinates.x + 10}
                    y={pin.coordinates.y + 4}
                    fill="#F8FAFC"
                    fontSize="9.5"
                    fontWeight="bold"
                    className="select-none drop-shadow-sm"
                  >
                    {pin.title.split("(")[0]}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Floating Semi-Transparent Layer Toggle Panel (Section 4 Requirement) */}
          <div className="absolute top-3 right-3 z-20 w-60 bg-slate-900/85 backdrop-blur-md rounded-xl border border-slate-700/80 shadow-2xl overflow-hidden transition-all text-xs">
            <div
              onClick={() => setIsLayerPanelOpen(!isLayerPanelOpen)}
              className="px-3 py-2.5 bg-slate-800/80 hover:bg-slate-800 flex items-center justify-between cursor-pointer border-b border-slate-700/60"
            >
              <div className="flex items-center gap-2 text-white font-bold">
                <Layers className="w-3.5 h-3.5 text-brand-400" />
                <span>Map Layers (6)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 font-mono">
                  {Object.values(layers).filter(Boolean).length}/6
                </span>
                {isLayerPanelOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>
            </div>

            {isLayerPanelOpen && (
              <div className="p-2.5 space-y-1.5">
                {/* 1. Slips Delivered */}
                <button
                  type="button"
                  onClick={() => toggleLayer("slipsDelivered")}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all text-left cursor-pointer ${
                    layers.slipsDelivered
                      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                      : "bg-slate-800/40 text-slate-400 hover:bg-slate-800 border border-transparent"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Slips Delivered</span>
                  </span>
                  {layers.slipsDelivered && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>

                {/* 2. WhatsApp Slips */}
                <button
                  type="button"
                  onClick={() => toggleLayer("whatsappSlips")}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all text-left cursor-pointer ${
                    layers.whatsappSlips
                      ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                      : "bg-slate-800/40 text-slate-400 hover:bg-slate-800 border border-transparent"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span>WhatsApp Slips</span>
                  </span>
                  {layers.whatsappSlips && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </button>

                {/* 3. Issues */}
                <button
                  type="button"
                  onClick={() => toggleLayer("issues")}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all text-left cursor-pointer ${
                    layers.issues
                      ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                      : "bg-slate-800/40 text-slate-400 hover:bg-slate-800 border border-transparent"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    <span>Grievances / Issues</span>
                  </span>
                  {layers.issues && <Check className="w-3.5 h-3.5 text-rose-400" />}
                </button>

                {/* 4. Workers */}
                <button
                  type="button"
                  onClick={() => toggleLayer("workers")}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all text-left cursor-pointer ${
                    layers.workers
                      ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
                      : "bg-slate-800/40 text-slate-400 hover:bg-slate-800 border border-transparent"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400" />
                    <span>Workers (Karyakartas)</span>
                  </span>
                  {layers.workers && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </button>

                {/* 5. Booths */}
                <button
                  type="button"
                  onClick={() => toggleLayer("booths")}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all text-left cursor-pointer ${
                    layers.booths
                      ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                      : "bg-slate-800/40 text-slate-400 hover:bg-slate-800 border border-transparent"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Focus Polling Booths</span>
                  </span>
                  {layers.booths && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </button>

                {/* 6. Clusters */}
                <button
                  type="button"
                  onClick={() => toggleLayer("clusters")}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all text-left cursor-pointer ${
                    layers.clusters
                      ? "bg-purple-500/15 text-purple-300 border border-purple-500/30"
                      : "bg-slate-800/40 text-slate-400 hover:bg-slate-800 border border-transparent"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>Distribution Clusters</span>
                  </span>
                  {layers.clusters && <Check className="w-3.5 h-3.5 text-purple-400" />}
                </button>
              </div>
            )}
          </div>

          {/* Map Compass & Quick Actions Controls (Left Edge) */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            <button
              type="button"
              onClick={() => showToast("info", "Map Recentered", "Centered on Kasba Peth Sector 4.")}
              className="p-2 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700 text-white hover:bg-slate-800 transition-all cursor-pointer shadow-md"
              title="Recenter Map"
            >
              <Compass className="w-4 h-4 text-brand-400" />
            </button>
            <button
              type="button"
              onClick={() => showToast("info", "Full Screen Mode", "Press Esc to exit full screen.")}
              className="p-2 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700 text-slate-300 hover:bg-slate-800 transition-all cursor-pointer shadow-md"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Map Overlay Bottom Strip */}
          <div className="absolute bottom-2 left-4 right-4 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800 shadow-xl flex items-center justify-between text-xs text-slate-400 z-10">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-200">Real-Time GPS Satellite Dispatch: Active</span>
            </span>
            <span className="font-semibold text-white">
              Showing {filteredPins.length} of {ALL_MAP_MARKERS.length} Spatial Nodes
            </span>
          </div>
        </div>

        {/* Selected Marker Detail Drawer (Span 1) */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-premium-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Inspection Dossier
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  selectedPin.type === "karyakarta"
                    ? "bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400"
                    : selectedPin.type === "focus-booth"
                    ? "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"
                    : selectedPin.type === "issue"
                    ? "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400"
                    : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
                }`}
              >
                {selectedPin.type.replace("-", " ").toUpperCase()}
              </span>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">
                    {selectedPin.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 pl-6">
                  {selectedPin.subtitle}
                </p>
              </div>

              {/* Geodetic Coordinates Card */}
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Geodetic GPS:</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                    {selectedPin.coordinates.lat}, {selectedPin.coordinates.lng}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 block">Operational Telemetry:</span>
                  <span className="font-bold text-slate-800 dark:text-white mt-0.5 block">
                    {selectedPin.status}
                  </span>
                </div>

                {selectedPin.metric && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Telemetry Metric:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {selectedPin.metric}
                    </span>
                  </div>
                )}

                {selectedPin.assignee && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> Assigned Lead:
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-white">
                      {selectedPin.assignee}
                    </span>
                  </div>
                )}

                {selectedPin.contact && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" /> Direct Contact:
                    </span>
                    <a
                      href={`tel:${selectedPin.contact}`}
                      className="font-mono font-medium text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      {selectedPin.contact}
                    </a>
                  </div>
                )}
              </div>

              {/* Tactical Actions */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-800 dark:text-white">
                  Field Command Actions:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      showToast(
                        "info",
                        "GPS Reroute Dispatched",
                        `Routing available canvassers to coordinates ${selectedPin.coordinates.lat}.`
                      )
                    }
                    className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 text-center flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Navigation className="w-3.5 h-3.5 text-slate-500" />
                    Reroute Squad
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      showToast(
                        "success",
                        "Voter Slips Assigned",
                        `Allocated 500 physical voter slip packets to ${selectedPin.title}.`
                      )
                    }
                    className="p-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold text-center flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-sm"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Assign Slips
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Grid: X:{selectedPin.coordinates.x} Y:{selectedPin.coordinates.y}</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              100% Sat Signal
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
