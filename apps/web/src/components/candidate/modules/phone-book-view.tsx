"use client";

import React, { useState } from "react";
import {
  Phone,
  MessageSquare,
  Search,
  Download,
  Users,
  Shield,
  BadgeCheck,
  UserCheck,
} from "lucide-react";
import { useToast } from "@/context/toast-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ContactEntry {
  id: string;
  name: string;
  marathiName?: string;
  phone: string;
  category: "voter" | "workforce" | "member" | "blo";
  subtitle: string;
  ward: string;
  booth: string;
  meta: string;
}

const SAMPLE_CONTACTS: ContactEntry[] = [
  // Electors
  {
    id: "cnt-v1",
    name: "Rajesh Kumar Verma",
    marathiName: "राजेश कुमार वर्मा",
    phone: "+91 98221 44001",
    category: "voter",
    subtitle: "EPIC: WXE4829102 • Family Head (3 Members)",
    ward: "Ward 12 (Kothrud)",
    booth: "Booth #101",
    meta: "House 14, Lane 3",
  },
  {
    id: "cnt-v2",
    name: "Sunita Rajesh Verma",
    marathiName: "सुनिता राजेश वर्मा",
    phone: "+91 98221 44002",
    category: "voter",
    subtitle: "EPIC: WXE9821443 • Ladki Bahin Beneficiary",
    ward: "Ward 12 (Kothrud)",
    booth: "Booth #101",
    meta: "House 14, Lane 3",
  },
  {
    id: "cnt-v3",
    name: "Pooja Santosh Deshmukh",
    marathiName: "पूजा संतोष देशमुख",
    phone: "+91 97654 32110",
    category: "voter",
    subtitle: "EPIC: WXE3109244 • Youth / First-Time Elector",
    ward: "Ward 14 (Erandwane)",
    booth: "Booth #107",
    meta: "Flat 402, Shiv Plaza",
  },
  {
    id: "cnt-v4",
    name: "Amit Baban Shinde",
    marathiName: "अमित बबन शिंदे",
    phone: "+91 98900 12345",
    category: "voter",
    subtitle: "EPIC: WXE1290384 • Trade Union Member",
    ward: "Ward 9 (Gaothan)",
    booth: "Booth #106",
    meta: "House 88, Gaothan",
  },

  // Workforce
  {
    id: "cnt-w1",
    name: "Vikas M. Jadhav",
    phone: "+91 98224 55441",
    category: "workforce",
    subtitle: "Ward Coordinator • Ward 12 & 14",
    ward: "Ward 12",
    booth: "Booths #101-104",
    meta: "Doorstep Target: 1040/1200 Completed",
  },
  {
    id: "cnt-w2",
    name: "Pooja Santosh Jagtap",
    phone: "+91 98901 22334",
    category: "workforce",
    subtitle: "Booth Captain • Navbharat High School",
    ward: "Ward 12",
    booth: "Booth #101",
    meta: "320 Slips Handed",
  },
  {
    id: "cnt-w3",
    name: "Ashok B. Shinde",
    phone: "+91 98220 11990",
    category: "workforce",
    subtitle: "Central Candidate Office Lead",
    ward: "Constituency HQ",
    booth: "All Booths",
    meta: "Desk Grievances & Visitor Liaison",
  },

  // Members / Volunteers
  {
    id: "cnt-m1",
    name: "Nilesh Prabhakar Patil",
    phone: "+91 98230 77665",
    category: "member",
    subtitle: "Ganesh Mandal Cadre Lead",
    ward: "Ward 12",
    booth: "Booth #102",
    meta: "Active Volunteer • Reg #MEM-409",
  },
  {
    id: "cnt-m2",
    name: "Shrikant Anant Joshi",
    phone: "+91 99220 33441",
    category: "member",
    subtitle: "Society Management Volunteer",
    ward: "Ward 14",
    booth: "Booth #108",
    meta: "Active Volunteer • Reg #MEM-412",
  },

  // BLO Officers
  {
    id: "cnt-b1",
    name: "Sanjay K. Kulkarni",
    phone: "+91 98220 11234",
    category: "blo",
    subtitle: "Head Clerk • Revenue Dept Pune Tehsil",
    ward: "Ward 12",
    booth: "Booth #101 (Navbharat HS)",
    meta: "SDM City Division 2 Jurisdiction",
  },
  {
    id: "cnt-b2",
    name: "Asha V. More",
    phone: "+91 98220 54321",
    category: "blo",
    subtitle: "Primary Teacher • ZP Education Board",
    ward: "Ward 12",
    booth: "Booth #102 (Navbharat HS)",
    meta: "SDM City Division 2 Jurisdiction",
  },
];

export function PhoneBookView() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"voter" | "workforce" | "member" | "blo">("voter");
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = SAMPLE_CONTACTS.filter(
    (c) =>
      c.category === activeTab &&
      (c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm) ||
        c.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.booth.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCall = (contact: ContactEntry) => {
    showToast(
      "info",
      `Initiating Call to ${contact.name}`,
      `Dialing ${contact.phone} for ${contact.subtitle}.`
    );
  };

  const handleWhatsApp = (contact: ContactEntry) => {
    showToast(
      "success",
      `WhatsApp Chat Opened`,
      `Opening secure messaging session with ${contact.name} (${contact.phone}).`
    );
  };

  const handleExport = () => {
    showToast(
      "success",
      "Phone Book Exported",
      `Exported ${filtered.length} contacts from ${activeTab.toUpperCase()} tab to CSV/Excel.`
    );
  };

  return (
    <div className="space-y-5">
      {/* Module Title Header */}
      <section className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-2.5 py-0.5 rounded-full">
              Module 09: Contact Registry
            </span>
            <Badge variant="teal">Meta Cloud API Connected</Badge>
            <Badge variant="neutral">AC-215 Bound</Badge>
          </div>
          <h1 className="text-[22px] font-bold text-slate-800 dark:text-white tracking-tight">
            Phone Book Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-0.5">
            Unified contact directory across verified electors, field karyakartas, cadre members, and government BLOs with 1-click Call &amp; WhatsApp communication.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="md" onClick={handleExport}>
            <Download className="w-3.5 h-3.5" />
            <span>Export Phone Book</span>
          </Button>
        </div>
      </section>

      {/* Tabs & Search Controls */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          {/* Tab Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              type="button"
              onClick={() => setActiveTab("voter")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                activeTab === "voter"
                  ? "bg-brand-600 text-white shadow-premium-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Voter Contacts ({SAMPLE_CONTACTS.filter((c) => c.category === "voter").length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("workforce")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                activeTab === "workforce"
                  ? "bg-brand-600 text-white shadow-premium-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Workforce &amp; Staff ({SAMPLE_CONTACTS.filter((c) => c.category === "workforce").length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("member")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                activeTab === "member"
                  ? "bg-brand-600 text-white shadow-premium-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <BadgeCheck className="w-3.5 h-3.5" />
              <span>Members &amp; Cadre ({SAMPLE_CONTACTS.filter((c) => c.category === "member").length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("blo")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                activeTab === "blo"
                  ? "bg-brand-600 text-white shadow-premium-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>BLO Contacts ({SAMPLE_CONTACTS.filter((c) => c.category === "blo").length})</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, phone, booth..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Contacts Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Contact Person</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Jurisdiction &amp; Booth</th>
                <th className="py-3 px-4">Classification / Role</th>
                <th className="py-3 px-4 text-right">Instant Outreach</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filtered.map((contact) => (
                <tr key={contact.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                      <span>{contact.name}</span>
                      {contact.marathiName && (
                        <span className="text-[11px] font-normal text-slate-400">({contact.marathiName})</span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500">{contact.meta}</div>
                  </td>

                  <td className="py-3 px-4 font-mono font-semibold text-slate-700 dark:text-slate-300">
                    {contact.phone}
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-800 dark:text-white">{contact.booth}</div>
                    <div className="text-[10px] text-slate-400">{contact.ward}</div>
                  </td>

                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                    {contact.subtitle}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCall(contact)}
                        className="cursor-pointer text-brand-600 border-brand-200 hover:bg-brand-50"
                        title="Voice Call"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call</span>
                      </Button>

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleWhatsApp(contact)}
                        className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
                        title="WhatsApp Chat"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
