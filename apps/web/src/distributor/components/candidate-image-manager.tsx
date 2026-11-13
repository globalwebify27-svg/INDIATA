"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  RefreshCw,
  Trash2,
  Check,
  AlertCircle,
  Eye,
  Image as ImageIcon,
  Sparkles,
  Smartphone,
  FileText,
  Building,
  Vote,
  Loader2,
} from "lucide-react";
import { CandidateProfile, CandidateImageAssets, candidateStore } from "../data/candidate-store";

interface CandidateImageManagerProps {
  candidate: CandidateProfile;
  onImagesUpdated?: (updatedCandidate: CandidateProfile) => void;
}

interface ImageCardConfig {
  key: keyof CandidateImageAssets;
  title: string;
  subtitle: string;
  recommendedDimensions: string;
  aspectRatio: string;
  icon: React.ElementType;
  description: string;
  accept: string;
  maxSizeMb: number;
}

const IMAGE_CONFIGS: ImageCardConfig[] = [
  {
    key: "profilePhotoUrl",
    title: "Candidate Profile Photo",
    subtitle: "Official Headshot / Portrait",
    recommendedDimensions: "800 × 800 px (1:1 Ratio)",
    aspectRatio: "aspect-square",
    icon: ImageIcon,
    description: "Displayed on candidate web profile, Karyakarta workforce app, and voter search cards.",
    accept: "image/png, image/jpeg, image/webp",
    maxSizeMb: 5,
  },
  {
    key: "coverBannerUrl",
    title: "Candidate Cover Banner",
    subtitle: "Hero Profile & Campaign Banner",
    recommendedDimensions: "1920 × 640 px (3:1 Landscape)",
    aspectRatio: "aspect-3/1",
    icon: Sparkles,
    description: "Header backdrop for candidate public portal, campaign rally announcements, and mobile splash screen.",
    accept: "image/png, image/jpeg, image/webp",
    maxSizeMb: 5,
  },
  {
    key: "partyLogoUrl",
    title: "Party Official Logo / Flag",
    subtitle: "Political Party Branding",
    recommendedDimensions: "512 × 512 px (Transparent PNG)",
    aspectRatio: "aspect-square",
    icon: Building,
    description: "Official emblem of the political party or front shown across candidate materials.",
    accept: "image/png, image/jpeg, image/webp",
    maxSizeMb: 5,
  },
  {
    key: "partySymbolUrl",
    title: "Election Symbol (Chunav Chinha)",
    subtitle: "ECI Allocated Symbol",
    recommendedDimensions: "512 × 512 px (High-Contrast)",
    aspectRatio: "aspect-square",
    icon: Vote,
    description: "Official ballot symbol printed on voter slips and EVM voting simulation guides.",
    accept: "image/png, image/jpeg, image/webp",
    maxSizeMb: 5,
  },
  {
    key: "slipBannerUrl",
    title: "Voter Slip Header Banner",
    subtitle: "Print & PDF Voter Slip Header",
    recommendedDimensions: "1200 × 300 px (4:1 Panorama)",
    aspectRatio: "aspect-4/1",
    icon: FileText,
    description: "Top header banner printed on all 1-to-1 door-to-door voter slips and digital WhatsApp slips.",
    accept: "image/png, image/jpeg, image/webp",
    maxSizeMb: 5,
  },
  {
    key: "appIconUrl",
    title: "Candidate Mobile App Icon",
    subtitle: "Launcher Icon & App Identity",
    recommendedDimensions: "512 × 512 px (Squircle / Rounded)",
    aspectRatio: "aspect-square",
    icon: Smartphone,
    description: "Home screen launcher icon for the candidate's dedicated field Karyakarta app.",
    accept: "image/png, image/jpeg, image/webp",
    maxSizeMb: 5,
  },
];

export function CandidateImageManager({
  candidate,
  onImagesUpdated,
}: CandidateImageManagerProps) {
  // Staged image values (initialized from candidate)
  const [stagedImages, setStagedImages] = useState<CandidateImageAssets>(candidate.images);
  // Staged preview states
  const [fileErrors, setFileErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [previewModalUrl, setPreviewModalUrl] = useState<{ title: string; url: string } | null>(null);

  // Hidden file input references
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleFileSelect = (key: keyof CandidateImageAssets, file: File) => {
    // 1. File Type Validation
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      setFileErrors((prev) => ({
        ...prev,
        [key]: `Unsupported file type (${file.type}). Please upload PNG, JPG, or WEBP.`,
      }));
      return;
    }

    // 2. File Size Validation (<= 5MB)
    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setFileErrors((prev) => ({
        ...prev,
        [key]: `File size (${sizeMb} MB) exceeds maximum allowed size of 5 MB.`,
      }));
      return;
    }

    // Clear error
    setFileErrors((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });

    // Read and create client-side preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setStagedImages((prev) => ({
        ...prev,
        [key]: dataUrl,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (key: keyof CandidateImageAssets) => {
    setStagedImages((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  const handleRevertToDefault = (key: keyof CandidateImageAssets) => {
    setStagedImages((prev) => ({
      ...prev,
      [key]: candidate.images[key],
    }));
    setFileErrors((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const handleSaveChanges = () => {
    setIsSaving(true);
    setTimeout(() => {
      const updated = candidateStore.updateCandidateImages(candidate.id, stagedImages);
      setIsSaving(false);
      setSaveSuccess(true);
      if (updated && onImagesUpdated) {
        onImagesUpdated(updated);
      }
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 500);
  };

  // Count modified images
  const modifiedCount = Object.keys(stagedImages).filter(
    (k) => stagedImages[k as keyof CandidateImageAssets] !== candidate.images[k as keyof CandidateImageAssets]
  ).length;

  return (
    <div className="space-y-6">
      {/* Banner Header with Save Action */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-premium-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Major Assets &amp; Branding Studio
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Candidate: {candidate.name} ({candidate.id})
            </span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-white">
            Candidate Image &amp; Branding Assets
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Upload and update candidate profile photos, election banners, party logos, and ballot symbols.
            Changes saved here are instantly reflected on the candidate profile and live candidate apps.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {modifiedCount > 0 && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {modifiedCount} Pending Image Change{modifiedCount > 1 ? "s" : ""}
            </span>
          )}

          <button
            type="button"
            onClick={handleSaveChanges}
            disabled={isSaving || modifiedCount === 0}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
              modifiedCount > 0
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white ring-2 ring-blue-400/50 scale-102"
                : "bg-slate-800 text-slate-400 opacity-60 cursor-not-allowed"
            }`}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Applying Image Changes...</span>
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Images Saved!</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Save All Image Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid of 6 Major Image Asset Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {IMAGE_CONFIGS.map((config) => {
          const currentUrl = stagedImages[config.key];
          const isModified = currentUrl !== candidate.images[config.key];
          const Icon = config.icon;
          const error = fileErrors[config.key];

          return (
            <div
              key={config.key}
              className={`bg-white dark:bg-slate-900 rounded-3xl border transition-all shadow-premium-xs flex flex-col justify-between overflow-hidden ${
                isModified
                  ? "border-[#2087FE] dark:border-blue-500 ring-2 ring-blue-500/20"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            >
              <div>
                {/* Image Card Header */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#2087FE] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                        {config.title}
                      </h4>
                      <p className="text-[10.5px] text-slate-500 dark:text-slate-400">
                        {config.subtitle}
                      </p>
                    </div>
                  </div>

                  {isModified && (
                    <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      Edited
                    </span>
                  )}
                </div>

                {/* Image Preview Box */}
                <div className="p-4 bg-slate-50/70 dark:bg-slate-800/40">
                  <div
                    className={`relative w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center ${
                      config.key === "coverBannerUrl"
                        ? "h-36"
                        : config.key === "slipBannerUrl"
                        ? "h-28"
                        : "h-44"
                    }`}
                  >
                    {currentUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={currentUrl}
                        alt={config.title}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <div className="text-center p-4 text-slate-400">
                        <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-40" />
                        <span className="text-[11px]">No image assigned</span>
                      </div>
                    )}

                    {/* Preview overlay button */}
                    {currentUrl && (
                      <button
                        type="button"
                        onClick={() => setPreviewModalUrl({ title: config.title, url: currentUrl })}
                        className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-xs transition shadow-md cursor-pointer"
                        title="View Full Size"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Dimension guidance badge */}
                  <div className="mt-2.5 flex items-center justify-between text-[10.5px] text-slate-500 dark:text-slate-400">
                    <span>Target: <strong>{config.recommendedDimensions}</strong></span>
                    <span>Max: {config.maxSizeMb} MB</span>
                  </div>

                  {/* Inline Error Message */}
                  {error && (
                    <div className="mt-2 p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-[11px] flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="p-4 pt-3 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {config.description}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={(el) => {
                    fileInputRefs.current[config.key] = el;
                  }}
                  accept={config.accept}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(config.key, file);
                    e.target.value = ""; // Reset input so same file can be chosen again
                  }}
                  className="hidden"
                />

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => fileInputRefs.current[config.key]?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#2087FE] hover:bg-blue-600 text-white shadow-premium-xs transition cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{currentUrl ? "Replace" : "Upload"}</span>
                  </button>

                  {isModified && (
                    <button
                      type="button"
                      onClick={() => handleRevertToDefault(config.key)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      title="Revert to original image"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Revert</span>
                    </button>
                  )}
                </div>

                {currentUrl && (
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(config.key)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition cursor-pointer"
                    title="Remove Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox / Full Size Preview Modal */}
      {previewModalUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setPreviewModalUrl(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl p-4 max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {previewModalUrl.title} (Asset Preview)
              </h3>
              <button
                type="button"
                onClick={() => setPreviewModalUrl(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <AlertCircle className="w-4 h-4 hidden" />
                ✕
              </button>
            </div>
            <div className="max-h-[70vh] flex items-center justify-center bg-slate-50 dark:bg-slate-950 rounded-2xl p-4 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewModalUrl.url}
                alt={previewModalUrl.title}
                className="max-h-[60vh] max-w-full object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
