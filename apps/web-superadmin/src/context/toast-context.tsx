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
                ? "bg-[#B3EDD7]/20 dark:bg-[#062237] border-[#12CF94]/30 dark:border-[#01C588]/40 text-[#010627] dark:text-[#01C588]"
                : item.type === "error"
                ? "bg-[#FC7C36]/10 dark:bg-[#062237] border-[#FC7C36]/30 dark:border-[#F48637]/40 text-[#010627] dark:text-[#F48637]"
                : item.type === "warning"
                ? "bg-[#FC7C36]/10 dark:bg-[#062237] border-[#FC7C36]/30 dark:border-[#F48637]/40 text-[#010627] dark:text-[#F48637]"
                : "bg-[#FDFEFE] dark:bg-[#062237] border-[#ACB9D1] dark:border-[#0e3554] text-[#010627] dark:text-[#F5F6F6]"
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {item.type === "success" && <CheckCircle2 className="w-4 h-4 text-[#12CF94] dark:text-[#01C588]" />}
              {item.type === "error" && <AlertCircle className="w-4 h-4 text-[#FC7C36] dark:text-[#F48637]" />}
              {item.type === "warning" && <AlertTriangle className="w-4 h-4 text-[#FC7C36] dark:text-[#F48637]" />}
              {item.type === "info" && <Info className="w-4 h-4 text-[#2087FE] dark:text-[#0D79FD]" />}
            </div>
            <div className="flex-1 leading-relaxed">{item.message}</div>
            <button
              onClick={() => removeToast(item.id)}
              className="flex-shrink-0 text-[#717785] hover:text-[#010627] dark:text-[#94A3B8] dark:hover:text-[#F5F6F6]"
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
