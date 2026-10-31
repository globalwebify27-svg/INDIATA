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
        return <Users className="w-3.5 h-3.5 text-[#2087FE] dark:text-[#0D79FD]" />;
      case "billing":
        return <CreditCard className="w-3.5 h-3.5 text-[#FC7C36] dark:text-[#F48637]" />;
      default:
        return <Shield className="w-3.5 h-3.5 text-[#12CF94] dark:text-[#01C588]" />;
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
      <div className="absolute right-4 top-16 z-50 w-80 sm:w-96 rounded-xl border border-[#ACB9D1] dark:border-[#0e3554] bg-[#FDFEFE] dark:bg-[#062237] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center justify-between p-4 border-b border-[#ACB9D1] dark:border-[#0e3554] bg-[#E0EDFE]/50 dark:bg-[#072439]">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#2087FE] dark:text-[#0D79FD]" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#010627] dark:text-[#F5F6F6]">
              Administrative Alerts
            </h4>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E0EDFE] text-[#2087FE] dark:bg-[#0D79FD]/15 dark:text-[#0D79FD]">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllRead}
                className="text-[11px] font-medium text-[#2087FE] hover:text-[#2087FE]/80 dark:text-[#0D79FD] flex items-center gap-1 mr-2"
              >
                <Check className="w-3 h-3" /> Mark read
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-[#717785] hover:text-[#010627] dark:text-[#94A3B8] dark:hover:text-[#F5F6F6] p-0.5 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="divide-y divide-[#ACB9D1]/30 dark:divide-[#0e3554]/50 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#717785] dark:text-[#94A3B8]">
              No recent administrative alerts.
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectNotification && onSelectNotification(item)}
                className={`p-3.5 hover:bg-[#E0EDFE]/40 dark:hover:bg-[#072439] cursor-pointer transition-colors flex gap-3 ${
                  !item.read ? "bg-[#E0EDFE]/20 dark:bg-[#0D79FD]/10" : ""
                }`}
              >
                <div className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-md bg-[#E0EDFE] dark:bg-[#072439] flex items-center justify-center">
                  {getCategoryIcon(item.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-xs font-semibold text-[#010627] dark:text-[#F5F6F6] truncate">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-[#717785] dark:text-[#94A3B8] flex-shrink-0">
                      {item.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-[#717785] dark:text-[#94A3B8] leading-normal line-clamp-2">
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
