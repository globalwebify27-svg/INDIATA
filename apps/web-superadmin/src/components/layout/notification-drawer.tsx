"use client";

import React from "react";
import { X, Check, Bell, Shield, Users, CreditCard } from "lucide-react";
import { NotificationItem } from "../../types/superadmin.types";

export interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onSelectNotification?: (item: NotificationItem) => void;
}

export function NotificationDrawer({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onSelectNotification,
}: NotificationDrawerProps) {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getCategoryIcon = (category: NotificationItem["category"]) => {
    switch (category) {
      case "candidate":
        return <Users className="w-3.5 h-3.5 text-[#2087FE]" />;
      case "billing":
        return <CreditCard className="w-3.5 h-3.5 text-[#FC7C36]" />;
      default:
        return <Shield className="w-3.5 h-3.5 text-[#12CF94]" />;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-2xs md:hidden"
        onClick={onClose}
      />

      {/* Popover / Drawer */}
      <div className="absolute right-4 top-16 z-50 w-80 sm:w-96 rounded-xl border border-[#ACB9D1] dark:border-slate-800 bg-[#FDFEFE] dark:bg-slate-900 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center justify-between p-4 border-b border-[#ACB9D1] dark:border-slate-800 bg-[#E0EDFE]/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#2087FE] dark:text-sky-400" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#010627] dark:text-slate-200">
              Administrative Alerts
            </h4>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E0EDFE] text-[#2087FE] dark:bg-sky-950 dark:text-sky-300">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllRead}
                className="text-[11px] font-medium text-[#2087FE] hover:text-[#2087FE]/80 dark:text-sky-400 flex items-center gap-1 mr-2"
              >
                <Check className="w-3 h-3" /> Mark read
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-[#717785] hover:text-[#010627] dark:hover:text-slate-200 p-0.5 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="divide-y divide-[#ACB9D1]/30 dark:divide-slate-800 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#717785]">
              No recent administrative alerts.
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectNotification && onSelectNotification(item)}
                className={`p-3.5 hover:bg-[#E0EDFE]/40 dark:hover:bg-slate-800/60 cursor-pointer transition-colors flex gap-3 ${
                  !item.read ? "bg-[#E0EDFE]/20 dark:bg-sky-950/20" : ""
                }`}
              >
                <div className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-md bg-[#E0EDFE] dark:bg-slate-800 flex items-center justify-center">
                  {getCategoryIcon(item.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-xs font-semibold text-[#010627] dark:text-slate-100 truncate">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-[#717785] flex-shrink-0">
                      {item.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-[#717785] dark:text-slate-400 leading-normal line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
