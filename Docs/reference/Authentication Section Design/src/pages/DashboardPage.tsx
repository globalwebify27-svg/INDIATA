interface DashboardPageProps {
  onNavigate: (page: "login" | "create-account" | "dashboard") => void;
}

const stats = [
  { label: "Active Elections", value: "12", delta: "+3 this month" },
  { label: "Registered Voters", value: "2.4M", delta: "+84K this cycle" },
  { label: "Votes Cast", value: "148M", delta: "61% turnout" },
  { label: "Campaigns Managed", value: "847", delta: "Across 34 states" },
];

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  return (
    <div className="min-h-full" style={{ backgroundColor: "#f8fafc" }}>
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
              <rect x="2" y="8" width="18" height="12" rx="2" stroke="white" strokeWidth="1.8" />
              <path d="M7 8V6a4 4 0 018 0v2" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M7.5 14.5l2 2L14.5 12" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-slate-900" style={{ fontFamily: "Fraunces, serif" }}>
            VoterX
          </span>
          <span className="text-slate-200 mx-1">|</span>
          <span className="text-sm text-slate-500">Election Management Platform</span>
        </div>
        <button
          onClick={() => onNavigate("login")}
          className="text-sm text-slate-500 hover:text-slate-700 font-medium flex items-center gap-1.5 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign Out
        </button>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900 mb-1" style={{ fontFamily: "Fraunces, serif" }}>
            Good morning, Administrator
          </h1>
          <p className="text-slate-500 text-sm">Here&apos;s what&apos;s happening across your elections today.</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-5 border border-slate-100">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-2">{stat.label}</p>
              <p className="text-2xl font-semibold text-slate-900 mb-1" style={{ fontFamily: "Fraunces, serif" }}>
                {stat.value}
              </p>
              <p className="text-xs text-emerald-600 font-medium">{stat.delta}</p>
            </div>
          ))}
        </div>

        {/* Placeholder content */}
        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          <div className="bg-white rounded-xl border border-slate-100 p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Active Elections</h2>
            <div className="space-y-3">
              {[
                { name: "2026 Senate Primary — California", status: "In Progress", voters: "18.4M", date: "Jun 7, 2026" },
                { name: "2026 Gubernatorial — Texas", status: "Upcoming", voters: "21.9M", date: "Nov 3, 2026" },
                { name: "2026 House — District 12 Special Election", status: "Results Pending", voters: "340K", date: "May 12, 2026" },
              ].map((election) => (
                <div key={election.name} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{election.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{election.voters} registered · {election.date}</p>
                  </div>
                  <span className={[
                    "text-xs font-medium px-2.5 py-1 rounded-full",
                    election.status === "In Progress" ? "bg-blue-50 text-blue-700" :
                    election.status === "Upcoming" ? "bg-slate-100 text-slate-600" :
                    "bg-amber-50 text-amber-700"
                  ].join(" ")}>
                    {election.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {["Create New Election", "Import Voter Rolls", "Generate Reports", "Manage Campaigns", "Audit Logs"].map((action) => (
                <button
                  key={action}
                  className="w-full text-left px-4 py-3 text-sm text-slate-700 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center justify-between group"
                >
                  {action}
                  <svg className="opacity-0 group-hover:opacity-100 transition-opacity" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
