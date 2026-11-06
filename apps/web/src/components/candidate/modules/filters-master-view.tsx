"use client";

import React, { useState } from "react";
import {
  Filter,
  Plus,
  Search,
  Trash2,
  Sparkles,
  X,
} from "lucide-react";
import { useToast } from "@/context/toast-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TaxonomyItem {
  id: string;
  name: string;
  marathiName: string;
  category: "caste" | "occupation" | "scheme" | "qualification" | "custom";
  voterCount: number;
  percentage: string;
  description: string;
  status: "Active" | "Draft";
}

const INITIAL_TAXONOMY: TaxonomyItem[] = [
  // Caste / Community
  { id: "c-1", category: "caste", name: "Maratha", marathiName: "मराठा", voterCount: 68400, percentage: "27.5%", description: "General demographic cluster across Wards 9, 12, 14", status: "Active" },
  { id: "c-2", category: "caste", name: "Brahmin", marathiName: "ब्राह्मण", voterCount: 42100, percentage: "16.9%", description: "Dense cluster in Sadashiv Peth, Shanipar, Deccan", status: "Active" },
  { id: "c-3", category: "caste", name: "OBC - Mali", marathiName: "ओबीसी (माळी)", voterCount: 28900, percentage: "11.6%", description: "Traditional artisan and agrarian families in Gaothan", status: "Active" },
  { id: "c-4", category: "caste", name: "OBC - Dhangar", marathiName: "ओबीसी (धनगर)", voterCount: 16500, percentage: "6.6%", description: "Community clusters in Kothrud Depot & Erandwane", status: "Active" },
  { id: "c-5", category: "caste", name: "Scheduled Caste (SC)", marathiName: "अनुसूचित जाती", voterCount: 31200, percentage: "12.5%", description: "Dr. Ambedkar Nagar, Mangalwar Peth clusters", status: "Active" },
  { id: "c-6", category: "caste", name: "Jain", marathiName: "जैन", voterCount: 18200, percentage: "7.3%", description: "Prominent mercantile and business community in Raviwar Peth", status: "Active" },
  { id: "c-7", category: "caste", name: "Muslim", marathiName: "मुस्लिम", voterCount: 22800, percentage: "9.2%", description: "Bhavani Peth, Nana Peth constituent voters", status: "Active" },

  // Occupation
  { id: "o-1", category: "occupation", name: "Retail Trader / Merchant", marathiName: "व्यापारी / दुकानदार", voterCount: 45200, percentage: "18.2%", description: "Market stalls, grocery stores, textile shops in City core", status: "Active" },
  { id: "o-2", category: "occupation", name: "IT & Software Engineer", marathiName: "आयटी / सॉफ्टवेअर व्यावसायिक", voterCount: 38400, percentage: "15.4%", description: "Hinjawadi/Magarpatta commuters residing in modern apartments", status: "Active" },
  { id: "o-3", category: "occupation", name: "Government & Municipal Staff", marathiName: "शासकीय / महापालिका कर्मचारी", voterCount: 24600, percentage: "9.9%", description: "PMC staff, state administrative employees, teachers", status: "Active" },
  { id: "o-4", category: "occupation", name: "Student & First-Time Voter", marathiName: "विद्यार्थी / नवमतदार", voterCount: 33100, percentage: "13.3%", description: "College students in Ferguson, SP College, Modern College", status: "Active" },
  { id: "o-5", category: "occupation", name: "Homemaker", marathiName: "गृहिणी", voterCount: 54200, percentage: "21.8%", description: "Key demographic for welfare and Ladki Bahin outreach", status: "Active" },
  { id: "o-6", category: "occupation", name: "Retired Senior Citizen", marathiName: "निवृत्त नागरिक", voterCount: 29800, percentage: "12.0%", description: "Pensioners, society committee members, morning walk clubs", status: "Active" },

  // Government Schemes
  { id: "s-1", category: "scheme", name: "Mukhyamantri Ladki Bahin Yojana", marathiName: "मुख्यमंत्री माझी लाडकी बहीण योजना", voterCount: 48900, percentage: "19.7%", description: "Monthly financial aid to eligible women beneficiaries", status: "Active" },
  { id: "s-2", category: "scheme", name: "Pradhan Mantri Awas Yojana (PMAY)", marathiName: "प्रधानमंत्री आवास योजना", voterCount: 14200, percentage: "5.7%", description: "Subsidized housing beneficiaries in redevelopment zones", status: "Active" },
  { id: "s-3", category: "scheme", name: "Ayushman Bharat - PMJAY", marathiName: "आयुष्मान भारत - पीएमजय", voterCount: 36700, percentage: "14.8%", description: "Free healthcare cashless coverage up to ₹5 Lakhs", status: "Active" },
  { id: "s-4", category: "scheme", name: "Sanjay Gandhi Niradhar Yojana", marathiName: "संजय गांधी निराधार योजना", voterCount: 8900, percentage: "3.6%", description: "Special welfare pension for destitute elderly and widows", status: "Active" },

  // Qualification
  { id: "q-1", category: "qualification", name: "Graduate (Degree Holder)", marathiName: "पदवीधर", voterCount: 89000, percentage: "35.8%", description: "BA, BCom, BSc, Engineering degree holders", status: "Active" },
  { id: "q-2", category: "qualification", name: "Post-Graduate / Professional", marathiName: "पदव्युत्तर / व्यावसायिक", voterCount: 41500, percentage: "16.7%", description: "Doctors, Lawyers, CAs, Masters degree holders", status: "Active" },
  { id: "q-3", category: "qualification", name: "Higher Secondary (12th Passed)", marathiName: "इयत्ता १२ वी उत्तीर्ण", voterCount: 62400, percentage: "25.1%", description: "Intermediate diploma and 12th certificate holders", status: "Active" },

  // Custom Segments
  { id: "u-1", category: "custom", name: "Ganesh Mandal Office Bearer", marathiName: "गणेशोत्सव मंडळ पदाधिकारी", voterCount: 4200, percentage: "1.7%", description: "High-influence local youth leaders across 180 mandals", status: "Active" },
  { id: "u-2", category: "custom", name: "Housing Society Chairman / Secretary", marathiName: "सोसायटी अध्यक्ष / सचिव", voterCount: 1850, percentage: "0.7%", description: "Gatekeepers for gated society slip distribution and meetings", status: "Active" },
  { id: "u-3", category: "custom", name: "Senior Citizen Morning Club Member", marathiName: "ज्येष्ठ नागरिक संघ सदस्य", voterCount: 6800, percentage: "2.7%", description: "Active members of garden laughter clubs & pensioners bodies", status: "Active" },
];

export function FiltersMasterView() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"caste" | "occupation" | "scheme" | "qualification" | "custom">("caste");
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<TaxonomyItem[]>(INITIAL_TAXONOMY);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Category State
  const [newName, setNewName] = useState("");
  const [newMarathiName, setNewMarathiName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const filteredItems = items.filter(
    (item) =>
      item.category === activeTab &&
      (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.marathiName.includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newItem: TaxonomyItem = {
      id: `custom-${Date.now()}`,
      category: activeTab,
      name: newName.trim(),
      marathiName: newMarathiName.trim() || newName.trim(),
      voterCount: 0,
      percentage: "0.0%",
      description: newDescription.trim() || "Configured master classification option",
      status: "Active",
    };

    setItems((prev) => [newItem, ...prev]);
    setShowAddModal(false);
    setNewName("");
    setNewMarathiName("");
    setNewDescription("");

    showToast(
      "success",
      "Classification Option Added",
      `"${newItem.name}" is now active and automatically available in Total Voters & Campaign Audience filters.`
    );
  };

  const handleDeleteItem = (id: string, name: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    showToast("info", "Option Removed", `"${name}" removed from ${activeTab.toUpperCase()} master classification.`);
  };

  return (
    <div className="space-y-5">
      {/* Module Title Header */}
      <section className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-2.5 py-0.5 rounded-full">
              Module 04: Master Classification
            </span>
            <Badge variant="teal">Total Voters Synchronized</Badge>
            <Badge variant="neutral">AC-215 Bound</Badge>
          </div>
          <h1 className="text-[22px] font-bold text-slate-800 dark:text-white tracking-tight">
            Filters &amp; Demographic Segmentation Master
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-0.5">
            Configure master classification options (Caste, Occupation, Schemes, Influencer Tags) that dynamically populate Total Voters and Campaign Audience filters.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="primary" size="md" onClick={() => setShowAddModal(true)}>
            <Plus className="w-3.5 h-3.5" />
            <span>Add Classification Option</span>
          </Button>
        </div>
      </section>

      {/* Synchronized Notice Banner */}
      <div className="bg-brand-50/70 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-900/50 rounded-xl p-3.5 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
        <div className="text-xs text-brand-900 dark:text-brand-200">
          <p className="font-semibold">Dynamic Elector Cross-Indexing Active</p>
          <p className="text-[11px] text-brand-700 dark:text-brand-300 mt-0.5">
            Any classification option created or updated here immediately populates the <strong>Advanced Filter Drawer</strong> in <strong>Total Voters (Module 07)</strong> and the <strong>Audience Segmentation Builder</strong> in <strong>Campaign Control (Module 13)</strong>.
          </p>
        </div>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-premium-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              type="button"
              onClick={() => setActiveTab("caste")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                activeTab === "caste"
                  ? "bg-brand-600 text-white shadow-premium-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              Caste &amp; Community ({items.filter((i) => i.category === "caste").length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("occupation")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                activeTab === "occupation"
                  ? "bg-brand-600 text-white shadow-premium-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              Occupation &amp; Trade ({items.filter((i) => i.category === "occupation").length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("scheme")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                activeTab === "scheme"
                  ? "bg-brand-600 text-white shadow-premium-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              Govt Welfare Schemes ({items.filter((i) => i.category === "scheme").length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("qualification")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                activeTab === "qualification"
                  ? "bg-brand-600 text-white shadow-premium-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              Qualifications ({items.filter((i) => i.category === "qualification").length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("custom")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                activeTab === "custom"
                  ? "bg-brand-600 text-white shadow-premium-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              Custom Influencer Tags ({items.filter((i) => i.category === "custom").length})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search category values..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Taxonomy Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-300 dark:hover:border-brand-700 transition-all flex flex-col justify-between gap-3 shadow-2xs"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                      <span>{item.name}</span>
                      <span className="text-xs font-normal text-slate-500">({item.marathiName})</span>
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                  <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {item.status}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-200">
                    {item.voterCount.toLocaleString()} Electors
                  </span>
                  <span className="text-[10px] text-slate-400 ml-1.5 font-medium">({item.percentage})</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(item.id, item.name)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Remove classification"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400">
              <Filter className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs font-semibold">No classification options matched your search.</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Click &quot;Add Classification Option&quot; above to create one.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Classification Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">
                  Add {activeTab.toUpperCase()} Classification
                </h3>
                <p className="text-xs text-slate-500">
                  Option will be instantly available in Total Voters filter drawer.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Option Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Ladki Bahin Beneficiary, IT Professional"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Marathi / Local Script Name
                </label>
                <input
                  type="text"
                  value={newMarathiName}
                  onChange={(e) => setNewMarathiName(e.target.value)}
                  placeholder="e.g. लाडकी बहीण लाभार्थी"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Description / Outreach Purpose
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe which electors belong to this segment..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Save &amp; Activate Option
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
