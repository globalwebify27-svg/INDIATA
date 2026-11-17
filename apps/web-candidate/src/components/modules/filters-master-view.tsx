"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Filter,
} from "lucide-react";
import { useToast } from "@/context/toast-context";

// ============================================================================
// DATA MODELS & 23 SEED FILTER OPTIONS (Matching Reference Exactly)
// ============================================================================

export type FilterCategory =
  | "Caste"
  | "Occupation"
  | "Scheme"
  | "Qualification"
  | "Custom Values";

export interface FilterOptionRecord {
  id: string;
  category: FilterCategory;
  name: string;
  code: string;
  usageCount: number;
  description: string;
}

export const CATEGORIES_LIST: FilterCategory[] = [
  "Caste",
  "Occupation",
  "Scheme",
  "Qualification",
  "Custom Values",
];

export const INITIAL_FILTER_OPTIONS: FilterOptionRecord[] = [
  // Caste (6)
  {
    id: "flt-c1",
    category: "Caste",
    name: "Maratha",
    code: "CST_MRT",
    usageCount: 48210,
    description: "Major agrarian & urban community across western Maharashtra",
  },
  {
    id: "flt-c2",
    category: "Caste",
    name: "Brahmin",
    code: "CST_BRH",
    usageCount: 22400,
    description: "Predominant demographic in Kothrud, Deccan & Erandwane segments",
  },
  {
    id: "flt-c3",
    category: "Caste",
    name: "OBC (Mali, Vanjari, Dhangar)",
    code: "CST_OBC",
    usageCount: 31200,
    description: "Crucial artisan and backward class voter clusters",
  },
  {
    id: "flt-c4",
    category: "Caste",
    name: "SC (Neo-Buddhist / Matang)",
    code: "CST_SC",
    usageCount: 19800,
    description: "Urban pocket communities with strong grassroots mobilization",
  },
  {
    id: "flt-c5",
    category: "Caste",
    name: "Muslim",
    code: "CST_MSL",
    usageCount: 14200,
    description: "Concentrated in central cantonment and Shivaji Nagar wards",
  },
  {
    id: "flt-c6",
    category: "Caste",
    name: "Jain / Marwari",
    code: "CST_JIN",
    usageCount: 9400,
    description: "Trading & merchant communities in commercial hubs",
  },

  // Occupation (6)
  {
    id: "flt-o1",
    category: "Occupation",
    name: "IT & Software Professional",
    code: "OCC_IT",
    usageCount: 38400,
    description: "Hinjawadi & Senapati Bapat Road tech workforce",
  },
  {
    id: "flt-o2",
    category: "Occupation",
    name: "Govt / PSU Employee",
    code: "OCC_GOV",
    usageCount: 16700,
    description: "Secretariat, Postal, Defense & Railway personnel",
  },
  {
    id: "flt-o3",
    category: "Occupation",
    name: "Business / Shop Owner",
    code: "OCC_BIZ",
    usageCount: 24500,
    description: "Retailers, small-scale enterprises & service providers",
  },
  {
    id: "flt-o4",
    category: "Occupation",
    name: "College Student",
    code: "OCC_STU",
    usageCount: 42100,
    description: "Youth voters across Pune's educational institutions",
  },
  {
    id: "flt-o5",
    category: "Occupation",
    name: "Homemaker",
    code: "OCC_HMK",
    usageCount: 51200,
    description: "Key demographic for family welfare schemes",
  },
  {
    id: "flt-o6",
    category: "Occupation",
    name: "Retired / Senior Citizen",
    code: "OCC_RET",
    usageCount: 29000,
    description: "High voter turnout demographic (>82% historical)",
  },

  // Scheme (4)
  {
    id: "flt-s1",
    category: "Scheme",
    name: "Mukhyamantri Majhi Ladki Bahin Yojana",
    code: "SCH_LBY",
    usageCount: 38900,
    description: "Direct benefit transfer of ₹1,500/month to eligible women",
  },
  {
    id: "flt-s2",
    category: "Scheme",
    name: "Mahatma Jyotirao Phule Jan Arogya Yojana",
    code: "SCH_MJP",
    usageCount: 29400,
    description: "Cashless medical insurance coverage up to ₹5 Lakh",
  },
  {
    id: "flt-s3",
    category: "Scheme",
    name: "PM Awas Yojana (Urban)",
    code: "SCH_PMAY",
    usageCount: 8200,
    description: "Subsidized housing loans & slum rehabilitation units",
  },
  {
    id: "flt-s4",
    category: "Scheme",
    name: "Sanjay Gandhi Niradhar Anudan",
    code: "SCH_SGNA",
    usageCount: 6500,
    description: "Pension for destitute, widows and disabled individuals",
  },

  // Qualification (4)
  {
    id: "flt-q1",
    category: "Qualification",
    name: "Post Graduate / Doctorate",
    code: "QLF_PG",
    usageCount: 24100,
    description: "Engineers, Doctors, MBAs, Academics",
  },
  {
    id: "flt-q2",
    category: "Qualification",
    name: "Graduate (Degree Holder)",
    code: "QLF_GRD",
    usageCount: 58200,
    description: "Bachelor degree holders in arts, commerce, sciences",
  },
  {
    id: "flt-q3",
    category: "Qualification",
    name: "Higher Secondary (12th Pass)",
    code: "QLF_HSC",
    usageCount: 34900,
    description: "Completed junior college",
  },
  {
    id: "flt-q4",
    category: "Qualification",
    name: "Secondary (10th Pass)",
    code: "QLF_SSC",
    usageCount: 28400,
    description: "Matriculation completed",
  },

  // Custom Values (3)
  {
    id: "flt-v1",
    category: "Custom Values",
    name: "Society Committee Member",
    code: "CST_RWA",
    usageCount: 4200,
    description: "RWA chairpersons and apartment management council",
  },
  {
    id: "flt-v2",
    category: "Custom Values",
    name: "Youth Club / Ganesh Mandal Worker",
    code: "CST_MND",
    usageCount: 8900,
    description: "Grassroots community festival organizers",
  },
  {
    id: "flt-v3",
    category: "Custom Values",
    name: "Senior Citizen Club Leader",
    code: "CST_SCC",
    usageCount: 2100,
    description: "Park morning groups & pensioners welfare circles",
  },
];

// ============================================================================
// MAIN COMPONENT: FILTERS MASTER VIEW
// ============================================================================

export function FiltersMasterView() {
  const { showToast } = useToast();

  const [options, setOptions] = useState<FilterOptionRecord[]>(INITIAL_FILTER_OPTIONS);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<FilterOptionRecord | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<FilterOptionRecord | null>(null);

  // Form Fields
  const [formCategory, setFormCategory] = useState<FilterCategory>("Caste");
  const [formName, setFormName] = useState<string>("");
  const [formCode, setFormCode] = useState<string>("");
  const [formDescription, setFormDescription] = useState<string>("");

  // Filtered List
  const filteredOptions = useMemo(() => {
    return options.filter((item) => {
      const matchCat = selectedCategory === "ALL" || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [options, selectedCategory, searchQuery]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormCategory("Caste");
    setFormName("");
    setFormCode("");
    setFormDescription("");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: FilterOptionRecord) => {
    setEditingItem(item);
    setFormCategory(item.category);
    setFormName(item.name);
    setFormCode(item.code);
    setFormDescription(item.description);
    setIsModalOpen(true);
  };

  // Save (Create or Update)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formCode.trim()) {
      showToast("error", "Validation Error", "Name and Code identifier are required.");
      return;
    }

    if (editingItem) {
      setOptions((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                category: formCategory,
                name: formName.trim(),
                code: formCode.trim().toUpperCase(),
                description: formDescription.trim(),
              }
            : item
        )
      );
      showToast("success", "Filter Updated", `Filter option "${formName}" updated successfully.`);
    } else {
      const newItem: FilterOptionRecord = {
        id: `flt-custom-${Date.now()}`,
        category: formCategory,
        name: formName.trim(),
        code: formCode.trim().toUpperCase(),
        usageCount: 0,
        description: formDescription.trim(),
      };
      setOptions((prev) => [newItem, ...prev]);
      showToast("success", "Filter Created", `New filter option "${formName}" created.`);
    }
    setIsModalOpen(false);
  };

  // Delete Action
  const handleDeleteConfirm = () => {
    if (deleteCandidate) {
      setOptions((prev) => prev.filter((item) => item.id !== deleteCandidate.id));
      showToast("info", "Filter Removed", `Filter option "${deleteCandidate.name}" removed.`);
      setDeleteCandidate(null);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-slate-800 dark:text-slate-100">
      {/* ===================================================================== */}
      {/* HEADER SECTION (Breadcrumb, Title, Subtitle, Add Button)              */}
      {/* ===================================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Classification Master
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Taxonomy Management
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Central Filter Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure Caste, Occupation, Welfare Schemes, Education Qualifications, and Custom tag values.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ + Add Filter Option</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* CATEGORY TABS & SEARCH BAR                                            */}
      {/* ===================================================================== */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        {/* Category Pills Bar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <button
            type="button"
            onClick={() => setSelectedCategory("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === "ALL"
                ? "bg-[#2563EB] text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            All Categories ({options.length})
          </button>

          {CATEGORIES_LIST.map((cat) => {
            const count = options.filter((item) => item.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#2563EB] text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search filter name, code, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* FILTER OPTIONS TABLE (MATCHING SCREENSHOTS 1, 2, 3)                   */}
      {/* ===================================================================== */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">CATEGORY</th>
                <th className="py-3 px-4">FILTER VALUE / NAME</th>
                <th className="py-3 px-4">CODE IDENTIFIER</th>
                <th className="py-3 px-4">ASSOCIATED VOTERS</th>
                <th className="py-3 px-4">DESCRIPTION / NOTES</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-200">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Category */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {item.category}
                      </span>
                    </td>

                    {/* Filter Value / Name */}
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {item.name}
                    </td>

                    {/* Code Identifier */}
                    <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {item.code}
                    </td>

                    {/* Associated Voters */}
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {item.usageCount.toLocaleString()} Voters
                    </td>

                    {/* Description / Notes */}
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-[11px] max-w-xs truncate" title={item.description}>
                      {item.description || "—"}
                    </td>

                    {/* Actions: Edit, Delete */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Edit Filter Option"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteCandidate(item)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Filter Option"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Filter className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    <p className="font-semibold text-xs text-slate-700 dark:text-slate-200">No filter options found</p>
                    <p className="text-[11px] text-slate-400 mt-1">Try selecting another category or clearing search query.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* ADD / EDIT FILTER OPTION MODAL                                        */}
      {/* ===================================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-md w-full border border-slate-200 dark:border-slate-800 overflow-hidden p-6 animate-scaleUp space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {editingItem ? "Edit Filter Option" : "Add New Filter Option"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* Target Category */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Category *
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as FilterCategory)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {CATEGORIES_LIST.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Display Name */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Filter Display Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maratha or IT Professional"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Code Identifier */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  System Code Identifier *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CST_MRT or OCC_IT"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 uppercase"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Electoral demographic relevance..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  Save Filter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* DELETE CONFIRMATION MODAL                                             */}
      {/* ===================================================================== */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-sm w-full border border-slate-200 dark:border-slate-800 overflow-hidden p-6 text-center animate-scaleUp">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Delete Filter Option?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Are you sure you want to delete <strong>{deleteCandidate.name}</strong> ({deleteCandidate.category})? This will untag associated voter demo records.
            </p>
            <div className="flex items-center justify-center gap-3 text-xs">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Delete Option
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
