"use client";

import React, { useState } from "react";
import { Search, Phone, Plus, X } from "lucide-react";
import { useToast } from "@/context/toast-context";

export interface BloOfficer {
  id: string;
  name: string;
  phone: string;
  designation: string;
  department: string;
  boothNumber: number;
  pollingStation: string;
  constituency: string;
  status: "ACTIVE" | "ON_LEAVE" | "REPLACED";
  lastVerifiedDate: string;
}

export const CONSTITUENCY_BOOTHS = [
  { boothNumber: 101, name: "Navbharat High School, Room 1" },
  { boothNumber: 102, name: "Navbharat High School, Room 2" },
  { boothNumber: 103, name: "Dr. Babasaheb Ambedkar Samaj Mandir" },
  { boothNumber: 104, name: "Pune Municipal Primary School No. 18" },
  { boothNumber: 105, name: "Abasaheb Garware College, Hall B" },
  { boothNumber: 106, name: "Modern High School, Wing A" },
  { boothNumber: 107, name: "Ferguson Junior College Library" },
  { boothNumber: 108, name: "Gokhale Memorial Community Hall" },
];

export const SEED_BLOS: BloOfficer[] = [
  {
    id: "blo-01",
    name: "Sanjay K. Kulkarni",
    phone: "+91 98220 11234",
    designation: "Assistant Teacher, Pune ZP",
    department: "School Education Dept",
    boothNumber: 101,
    pollingStation: "Navbharat High School, Room 1",
    constituency: "34 - Pune",
    status: "ACTIVE",
    lastVerifiedDate: "2024-04-10",
  },
  {
    id: "blo-02",
    name: "Asha V. More",
    phone: "+91 98220 54321",
    designation: "Junior Clerk, Taluka Office",
    department: "Revenue Department",
    boothNumber: 102,
    pollingStation: "Navbharat High School, Room 2",
    constituency: "34 - Pune",
    status: "ACTIVE",
    lastVerifiedDate: "2024-04-11",
  },
  {
    id: "blo-03",
    name: "Rameshwar P. Mane",
    phone: "+91 94220 98765",
    designation: "Headmaster, PMC Primary School",
    department: "PMC Education Board",
    boothNumber: 103,
    pollingStation: "Dr. Babasaheb Ambedkar Samaj Mandir",
    constituency: "34 - Pune",
    status: "ACTIVE",
    lastVerifiedDate: "2024-04-08",
  },
  {
    id: "blo-04",
    name: "Geeta N. Salunkhe",
    phone: "+91 98901 23456",
    designation: "Gramsevak, Haveli Taluka",
    department: "Rural Development",
    boothNumber: 104,
    pollingStation: "Pune Municipal Primary School No. 18",
    constituency: "34 - Pune",
    status: "ACTIVE",
    lastVerifiedDate: "2024-04-12",
  },
  {
    id: "blo-05",
    name: "Dattatraya Shinde",
    phone: "+91 97632 11098",
    designation: "Clerk, Registration Office",
    department: "Stamps & Registration",
    boothNumber: 105,
    pollingStation: "Abasaheb Garware College, Hall B",
    constituency: "34 - Pune",
    status: "ON_LEAVE",
    lastVerifiedDate: "2024-04-02",
  },
  {
    id: "blo-06",
    name: "Nitin B. Jagtap",
    phone: "+91 98505 44321",
    designation: "Junior Engineer, MSEDCL",
    department: "Power & Energy Dept",
    boothNumber: 106,
    pollingStation: "Modern High School, Wing A",
    constituency: "34 - Pune",
    status: "ACTIVE",
    lastVerifiedDate: "2024-04-09",
  },
  {
    id: "blo-07",
    name: "Madhavi R. Joshi",
    phone: "+91 98231 77654",
    designation: "Senior Teacher, Kanya Shala",
    department: "School Education Dept",
    boothNumber: 107,
    pollingStation: "Ferguson Junior College Library",
    constituency: "34 - Pune",
    status: "ACTIVE",
    lastVerifiedDate: "2024-04-14",
  },
  {
    id: "blo-08",
    name: "Pravin S. Gaikwad",
    phone: "+91 99224 88321",
    designation: "Tax Collector, PMC Zone 3",
    department: "Municipal Administration",
    boothNumber: 108,
    pollingStation: "Gokhale Memorial Community Hall",
    constituency: "34 - Pune",
    status: "REPLACED",
    lastVerifiedDate: "2024-04-05",
  },
];

export function BloDirectoryView() {
  const { showToast } = useToast();
  const [blos, setBlos] = useState<BloOfficer[]>(SEED_BLOS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showModal, setShowModal] = useState(false);

  // Form states for new BLO
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [designation, setDesignation] = useState("Primary School Teacher");
  const [department, setDepartment] = useState("School Education Department");
  const [boothNumber, setBoothNumber] = useState<number>(101);
  const [pollingStation, setPollingStation] = useState("Navbharat High School, Room 1");

  // Sync polling station when booth number changes in dropdown
  const handleBoothChange = (newBooth: number) => {
    setBoothNumber(newBooth);
    const matched = CONSTITUENCY_BOOTHS.find((b) => b.boothNumber === newBooth);
    if (matched) {
      setPollingStation(matched.name);
    }
  };

  const filteredBlos = blos.filter((blo) => {
    const matchesSearch =
      blo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blo.phone.includes(searchTerm) ||
      blo.boothNumber.toString().includes(searchTerm) ||
      blo.pollingStation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blo.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || blo.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRegisterBlo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const newRecord: BloOfficer = {
      id: `blo-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      phone: phone.trim(),
      designation: designation.trim() || "Government Employee",
      department: department.trim() || "State Administration",
      boothNumber,
      pollingStation: pollingStation.trim(),
      constituency: "34 - Pune",
      status: "ACTIVE",
      lastVerifiedDate: "Today",
    };

    setBlos([newRecord, ...blos]);
    setShowModal(false);
    showToast("success", "BLO Registered", `BLO record for ${name} (Booth #${boothNumber}) registered.`);
    setName("");
    setPhone("");
    setDesignation("Primary School Teacher");
    setDepartment("School Education Department");
    setBoothNumber(101);
    setPollingStation("Navbharat High School, Room 1");
  };

  const handleCallBlo = (officerName: string, officerPhone: string) => {
    showToast("info", "Calling BLO", `Click-to-Call triggered for Booth Level Officer ${officerName} (${officerPhone})`);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in select-none">
      {/* HEADER CARD */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              ECI Field Officers
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Government Appointees
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-1">
            Booth Level Officer (BLO) Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Official ECI designated teachers and revenue personnel managing voter additions, deletions, and polling stations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add / Update BLO</span>
        </button>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search BLO name, phone number, booth, or polling station..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800"
          />
        </div>

        <div className="w-full sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active in Booth</option>
            <option value="ON_LEAVE">On Leave</option>
            <option value="REPLACED">Replaced</option>
          </select>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Booth #</th>
                <th className="py-3 px-4">BLO Name & Designation</th>
                <th className="py-3 px-4">Govt Parent Department</th>
                <th className="py-3 px-4">Direct Phone</th>
                <th className="py-3 px-4">Polling Station Location</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4 text-right">Contact Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredBlos.map((blo) => (
                <tr key={blo.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue-600">
                    Booth #{blo.boothNumber}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{blo.name}</span>
                    <span className="text-[11px] text-slate-500">{blo.designation}</span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {blo.department}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-700">
                    {blo.phone}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {blo.pollingStation}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        blo.status === "ACTIVE"
                          ? "bg-blue-100 text-blue-800"
                          : blo.status === "ON_LEAVE"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {blo.status}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Verified {blo.lastVerifiedDate}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleCallBlo(blo.name, blo.phone)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5 text-blue-600" />
                      <span>Call BLO</span>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredBlos.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No Booth Level Officers match your current filter or search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* REGISTER / UPDATE BLO MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden p-6 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">
                Register Booth Level Officer
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterBlo} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  BLO Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rameshwar P. Mane"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Direct Mobile Phone *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 94XXX XXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Assigned Booth Number
                  </label>
                  <select
                    value={boothNumber}
                    onChange={(e) => handleBoothChange(parseInt(e.target.value, 10))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 text-slate-800 cursor-pointer"
                  >
                    {CONSTITUENCY_BOOTHS.map((b) => (
                      <option key={b.boothNumber} value={b.boothNumber}>
                        Booth #{b.boothNumber}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Government Designation
                  </label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Parent Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Polling Station Building Name
                </label>
                <input
                  type="text"
                  value={pollingStation}
                  onChange={(e) => setPollingStation(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  Save BLO Information
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
