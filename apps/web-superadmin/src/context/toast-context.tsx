"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "warning" | "error" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newToast: ToastMessage = { id, type, message };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      {/* Toast container floating at bottom right */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((item) => (
          <div
            key={item.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border shadow-lg text-xs font-medium transition-all animate-in slide-in-from-bottom-2 ${
              item.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
                : item.type === "error"
                ? "bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200"
                : item.type === "warning"
                ? "bg-amber-50 dark:bg-amber-950/80 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200"
                : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200"
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {item.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
              {item.type === "error" && <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />}
              {item.type === "warning" && <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
              {item.type === "info" && <Info className="w-4 h-4 text-sky-600 dark:text-sky-400" />}
            </div>
            <div className="flex-1 leading-relaxed">{item.message}</div>
            <button
              onClick={() => removeToast(item.id)}
              className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
