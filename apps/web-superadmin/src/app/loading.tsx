import React from "react";

export default function Loading() {
  return (
    <div className="flex-1 p-6 max-w-6xl mx-auto w-full animate-pulse">
      <div className="h-10 bg-[var(--muted)] rounded-lg w-1/3 mb-8"></div>
      <div className="h-64 bg-[var(--muted)] rounded-xl w-full mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="h-28 bg-[var(--muted)] rounded-lg"></div>
        <div className="h-28 bg-[var(--muted)] rounded-lg"></div>
        <div className="h-28 bg-[var(--muted)] rounded-lg"></div>
        <div className="h-28 bg-[var(--muted)] rounded-lg"></div>
      </div>
    </div>
  );
}
