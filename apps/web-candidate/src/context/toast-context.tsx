"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  durationMs?: number;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (type: ToastType, title: string, message?: string, durationMs?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastType, title: string, message?: string, durationMs = 4500) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = { id, type, title, message, durationMs };

      setToasts((prev) => [...prev, newToast]);

      if (durationMs > 0) {
        setTimeout(() => {
          removeToast(id);
        }, durationMs);
      }
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-lg shadow-lg border text-sm transition-all animate-in fade-in slide-in-from-bottom-2 ${
              toast.type === "success"
                ? "bg-white dark:bg-[#062237] border-[#12CF94] text-[#010627] dark:text-[#F5F6F6]"
                : toast.type === "error"
                  ? "bg-white dark:bg-[#062237] border-[#BA1A1A] text-[#010627] dark:text-[#F5F6F6]"
                  : toast.type === "warning"
                    ? "bg-white dark:bg-[#062237] border-[#FC7C36] text-[#010627] dark:text-[#F5F6F6]"
                    : "bg-white dark:bg-[#062237] border-[#2087FE] text-[#010627] dark:text-[#F5F6F6]"
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-[#12CF94]" />}
              {toast.type === "error" && <AlertCircle className="w-5 h-5 text-[#BA1A1A]" />}
              {toast.type === "warning" && <AlertTriangle className="w-5 h-5 text-[#FC7C36]" />}
              {toast.type === "info" && <Info className="w-5 h-5 text-[#2087FE]" />}
            </div>
            <div className="flex-1">
              <div className="font-semibold">{toast.title}</div>
              {toast.message && (
                <div className="text-xs text-[#717785] dark:text-[#94A3B8] mt-0.5">
                  {toast.message}
                </div>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#717785] hover:text-[#010627] dark:hover:text-[#F5F6F6] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
