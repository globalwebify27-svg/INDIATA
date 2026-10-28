import { useState, useRef, useLayoutEffect } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type PanelId = 'admin' | 'client' | 'intel' | 'comm' | 'data' | 'org'

interface PageNode {
  label: string
  isAI?: boolean
  subpages?: string[]
}

interface SectionNode {
  label: string
  pages: PageNode[]
}

interface PanelDef {
  id: PanelId
  label: string
  shortLabel: string
  tagline: string
  icon: string
  color: ColorDef
  sections: SectionNode[]
}

interface ColorDef {
  accent: string         // hex
  headerBg: string       // tailwind
  headerText: string
  sectionBorder: string
  sectionBg: string
  sectionLabel: string
  pageDot: string
  chipBg: string
  chipText: string
  tabActive: string
  tabBorder: string
}

// ─── Color Palette ────────────────────────────────────────────────────────────

const C: Record<PanelId, ColorDef> = {
  admin: {
    accent: '#3b82f6',
    headerBg: 'bg-blue-600',
    headerText: 'text-white',
    sectionBorder: 'border-l-blue-500',
    sectionBg: 'bg-[#0f1929]',
    sectionLabel: 'text-blue-300',
    pageDot: 'bg-blue-400',
    chipBg: 'bg-blue-900/40',
    chipText: 'text-blue-300',
    tabActive: 'bg-blue-600 text-white',
    tabBorder: 'border-blue-600',
  },
  client: {
    accent: '#10b981',
    headerBg: 'bg-emerald-600',
    headerText: 'text-white',
    sectionBorder: 'border-l-emerald-500',
    sectionBg: 'bg-[#0a1f18]',
    sectionLabel: 'text-emerald-300',
    pageDot: 'bg-emerald-400',
    chipBg: 'bg-emerald-900/40',
    chipText: 'text-emerald-300',
    tabActive: 'bg-emerald-600 text-white',
    tabBorder: 'border-emerald-600',
  },
  intel: {
    accent: '#8b5cf6',
    headerBg: 'bg-violet-600',
    headerText: 'text-white',
    sectionBorder: 'border-l-violet-500',
    sectionBg: 'bg-[#100f1f]',
    sectionLabel: 'text-violet-300',
    pageDot: 'bg-violet-400',
    chipBg: 'bg-violet-900/40',
    chipText: 'text-violet-300',
    tabActive: 'bg-violet-600 text-white',
    tabBorder: 'border-violet-600',
  },
  comm: {
    accent: '#f59e0b',
    headerBg: 'bg-amber-600',
    headerText: 'text-white',
    sectionBorder: 'border-l-amber-500',
    sectionBg: 'bg-[#1a1500]',
    sectionLabel: 'text-amber-300',
    pageDot: 'bg-amber-400',
    chipBg: 'bg-amber-900/40',
    chipText: 'text-amber-300',
    tabActive: 'bg-amber-600 text-white',
    tabBorder: 'border-amber-600',
  },
  data: {
    accent: '#06b6d4',
    headerBg: 'bg-cyan-600',
    headerText: 'text-white',
    sectionBorder: 'border-l-cyan-500',
    sectionBg: 'bg-[#001419]',
    sectionLabel: 'text-cyan-300',
    pageDot: 'bg-cyan-400',
    chipBg: 'bg-cyan-900/40',
    chipText: 'text-cyan-300',
    tabActive: 'bg-cyan-600 text-white',
    tabBorder: 'border-cyan-600',
  },
  org: {
    accent: '#f43f5e',
    headerBg: 'bg-rose-600',
    headerText: 'text-white',
    sectionBorder: 'border-l-rose-500',
    sectionBg: 'bg-[#1a0810]',
    sectionLabel: 'text-rose-300',
    pageDot: 'bg-rose-400',
    chipBg: 'bg-rose-900/40',
    chipText: 'text-rose-300',
    tabActive: 'bg-rose-600 text-white',
    tabBorder: 'border-rose-600',
  },
}

// ─── Sitemap Data ──────────────────────────────────────────────────────────────

const PANELS: PanelDef[] = [
  {
    id: 'admin',
    label: 'Admin Panel',
    shortLabel: 'Admin',
    tagline: 'Platform administration & user management',
    icon: '⚙',
    color: C.admin,
    sections: [
      {
        label: 'Dashboard',
        pages: [
          { label: 'Total Users' },
          { label: 'Demo Accounts' },
          { label: 'Sale Accounts' },
        ],
      },
      {
        label: 'User Management',
        pages: [
          { label: 'User List' },
          { label: 'Search Users' },
          { label: 'Filter Users' },
          {
            label: 'Add New User',
            subpages: ['Account Details', 'Election Setup', 'Application Details', 'Additional Configuration', 'Branding', 'Access Configuration'],
          },
          {
            label: 'Manage User',
            subpages: ['View User', 'Edit User', 'Account Status', 'Access Controls'],
          },
        ],
      },
      {
        label: 'Profile',
        pages: [{ label: 'Admin Profile' }],
      },
      {
        label: 'Logout',
        pages: [],
      },
    ],
  },
  {
    id: 'client',
    label: 'Client Panel',
    shortLabel: 'Client',
    tagline: 'Election operations & field management',
    icon: '🗳',
    color: C.client,
    sections: [
      {
        label: 'Dashboard',
        pages: [
          { label: 'Election / Constituency Selector' },
          { label: 'Summary', subpages: ['Total Voters', 'Total Members', 'Total Booths', 'BLO Officers'] },
          { label: 'Organisation Score' },
          { label: 'Booth Coverage' },
          { label: 'Gender Distribution' },
          { label: 'Member Summary' },
          { label: 'Caste Distribution' },
          { label: 'Top Booths' },
          { label: 'Quick Actions' },
        ],
      },
      {
        label: 'Voters',
        pages: [
          { label: 'Voter List' },
          { label: 'Search' },
          { label: 'Quick Filters' },
          { label: 'Advanced Filters' },
          { label: 'Table View' },
          { label: 'Cards View' },
          { label: 'Add Voter' },
          { label: 'Import Voters' },
          { label: 'Voter Profile', subpages: ['Identity', 'Profile', 'Occupation', 'Political Interest', 'Address', 'Edit', 'Delete'] },
        ],
      },
      {
        label: 'Members',
        pages: [
          { label: 'Member List' },
          { label: 'Search' },
          { label: 'Filters' },
          { label: 'Add Member' },
          { label: 'Registrations' },
          { label: 'Registration Link' },
          { label: 'QR Registration' },
          { label: 'Import Members' },
        ],
      },
      {
        label: 'Workers',
        pages: [
          { label: 'Worker List' },
          { label: 'Search' },
          { label: 'Add Worker' },
          { label: 'Edit Worker' },
          { label: 'Prabhaag Assignment' },
          { label: 'Booth Assignment' },
          { label: 'Voter Serial Range' },
          { label: 'Access Status' },
          { label: 'Import Permissions' },
          { label: 'Access Keys' },
        ],
      },
      {
        label: 'Booths',
        pages: [
          { label: 'Booth List' },
          { label: 'Search' },
          { label: 'Add Booth' },
          { label: 'Import Booth Data' },
          { label: 'Booth Details', subpages: ['Insight', 'Voters', 'Documents', 'Gender Distribution', 'Caste Distribution', 'Officers', 'Booth Location', 'Map', 'E-roll Comparison', 'Quality / Accuracy Checks'] },
        ],
      },
      {
        label: 'BLO',
        pages: [
          { label: 'BLO List' },
          { label: 'Search' },
          { label: 'Add BLO' },
          { label: 'BLO Details' },
          { label: 'Booth-wise BLO Information' },
        ],
      },
      {
        label: 'Forms & Surveys',
        pages: [
          { label: 'Forms List' },
          { label: 'Search' },
          { label: 'Create Form' },
          { label: 'Form Sections' },
          { label: 'Responses' },
          { label: 'Analytics' },
          { label: 'Edit Fields' },
          { label: 'Access' },
          { label: 'Share' },
        ],
      },
    ],
  },
  {
    id: 'intel',
    label: 'Intelligence',
    shortLabel: 'Intelligence',
    tagline: 'AI analytics, reports & historical data',
    icon: '✦',
    color: C.intel,
    sections: [
      {
        label: 'AI Mode',
        pages: [
          { label: 'AI Chat', isAI: true },
          { label: 'Natural Language Search', isAI: true },
          { label: 'Voice Query', isAI: true },
          { label: 'AI Filtering', isAI: true },
          { label: 'AI Data Analysis', isAI: true },
          { label: 'AI Graph Generation', isAI: true },
          { label: 'AI Report Generation', isAI: true },
          { label: 'Native Language Support', isAI: true },
          { label: 'Human Approval for Action Operations', isAI: true },
        ],
      },
      {
        label: 'Reports',
        pages: [
          { label: 'Voter Reports' },
          { label: 'Booth Reports' },
          { label: 'Worker Reports' },
          { label: 'Campaign Reports' },
          { label: 'Analytics' },
          { label: 'PDF Export' },
          { label: 'Excel Export' },
          { label: 'CSV Export' },
        ],
      },
      {
        label: 'Previous Election',
        pages: [
          { label: 'Historical Election Data' },
          { label: 'Party Analysis' },
          { label: 'Candidate Analysis' },
          { label: 'Booth Analysis' },
          { label: 'Locality Analysis' },
          { label: 'Comparative Analysis' },
          { label: 'Previous Election Strategy' },
          { label: 'Booth-wise Results' },
          { label: 'RAG AI Assistant', isAI: true },
        ],
      },
    ],
  },
  {
    id: 'comm',
    label: 'Communication',
    shortLabel: 'Comm.',
    tagline: 'Campaign management across channels',
    icon: '◎',
    color: C.comm,
    sections: [
      {
        label: 'Campaigns',
        pages: [
          { label: 'Campaign Overview' },
          { label: 'Active Campaigns' },
          { label: 'Scheduled Campaigns' },
          { label: 'Completed Campaigns' },
          { label: 'Campaign Analytics' },
          { label: 'Campaign Cost' },
          { label: 'Campaign Balance' },
          { label: 'Recharge' },
        ],
      },
      {
        label: 'WhatsApp',
        pages: [
          { label: 'WhatsApp Campaigns' },
          { label: 'Scripts' },
          { label: 'Script Management' },
          { label: 'Usage' },
          { label: 'Balance' },
        ],
      },
      {
        label: 'SMS',
        pages: [
          { label: 'SMS Campaigns' },
          { label: 'Scripts' },
          { label: 'Script Management' },
          { label: 'Usage' },
          { label: 'Balance' },
        ],
      },
      {
        label: 'Voice',
        pages: [
          { label: 'Voice Campaigns' },
          { label: 'Voice Scripts' },
          { label: 'Script Management' },
          { label: 'Call History' },
          { label: 'Usage' },
          { label: 'Balance' },
        ],
      },
    ],
  },
  {
    id: 'data',
    label: 'Data & Operations',
    shortLabel: 'Data & Ops',
    tagline: 'Filters, exports, activity logs & OCR',
    icon: '◈',
    color: C.data,
    sections: [
      {
        label: 'Filters',
        pages: [
          { label: 'Filter Management' },
          { label: 'Caste' },
          { label: 'Occupation' },
          { label: 'Scheme' },
          { label: 'Qualification' },
          { label: 'Add Filter' },
          { label: 'Edit Filter' },
          { label: 'Delete Filter' },
        ],
      },
      {
        label: 'Update Requests',
        pages: [
          { label: 'All Requests' },
          { label: 'Pending' },
          { label: 'Approved' },
          { label: 'Rejected' },
          { label: 'Search Requests' },
          { label: 'Review Request' },
          { label: 'Approve / Reject' },
        ],
      },
      {
        label: 'User Activities',
        pages: [
          { label: 'Activity Logs' },
          { label: 'Search Activity' },
          { label: 'Activity Details' },
        ],
      },
      {
        label: 'Export Voter Data',
        pages: [
          { label: 'Select Worker' },
          { label: 'Worker Voters' },
          { label: 'Search' },
          { label: 'Export Excel' },
        ],
      },
      {
        label: 'Phone Book',
        pages: [
          { label: 'Select Worker' },
          { label: 'Phone Book Voters' },
          { label: 'Search' },
          { label: 'Export Excel' },
        ],
      },
      {
        label: 'OCR',
        pages: [
          { label: 'Upload Voter PDF' },
          { label: 'Select State' },
          { label: 'Select Lok Sabha' },
          { label: 'Select Vidhan Sabha' },
          { label: 'Select Booth / Village' },
          { label: 'Process PDF' },
        ],
      },
    ],
  },
  {
    id: 'org',
    label: 'Organization',
    shortLabel: 'Org.',
    tagline: 'Structure, permissions, branding & settings',
    icon: '◉',
    color: C.org,
    sections: [
      {
        label: 'Organization',
        pages: [
          { label: 'Organization List' },
          { label: 'Create Organization' },
          { label: 'Organization Details' },
          { label: 'Organization Members' },
          { label: 'Invitations' },
        ],
      },
      {
        label: 'Permissions',
        pages: [
          { label: 'Owner' },
          { label: 'Admin' },
          { label: 'Editor' },
          { label: 'Viewer' },
          { label: 'Feature Permissions' },
          { label: 'Data Access' },
        ],
      },
      {
        label: 'Access Control',
        pages: [
          { label: 'User Access' },
          { label: 'Feature Access' },
          { label: 'AI Mode Access', isAI: true },
          { label: 'Subscription-based AI User Limits', isAI: true },
        ],
      },
      {
        label: 'Profile',
        pages: [
          { label: 'Account Details' },
          { label: 'Organization Memberships' },
          { label: 'Organization Switcher' },
        ],
      },
      {
        label: 'Party Settings',
        pages: [
          { label: 'Party Details' },
          { label: 'Candidate Details' },
          { label: 'Constituency' },
          { label: 'Party Logo' },
        ],
      },
      {
        label: 'Branding',
        pages: [
          { label: 'Logo' },
          { label: 'Images' },
          { label: 'Banners' },
          { label: 'Application Theme' },
          { label: 'Splash Screen' },
          { label: 'App Icon' },
        ],
      },
      {
        label: 'Settings',
        pages: [
          { label: 'General Settings' },
          { label: 'Application Settings' },
          { label: 'Communication Settings' },
          { label: 'AI Settings', isAI: true },
        ],
      },
    ],
  },
]

// ─── Connector SVG ─────────────────────────────────────────────────────────────

interface ConnectorProps {
  parentRef: React.RefObject<HTMLDivElement | null>
  childRefs: React.RefObject<HTMLDivElement | null>[]
  color: string
  containerRef: React.RefObject<HTMLDivElement | null>
}

function ConnectorLines({ parentRef, childRefs, color, containerRef }: ConnectorProps) {
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number; mx: number; my: number }[]>([])
  const [dims, setDims] = useState({ w: 0, h: 0 })

  useLayoutEffect(() => {
    function measure() {
      if (!parentRef.current || !containerRef.current) return
      const container = containerRef.current.getBoundingClientRect()
      const parent = parentRef.current.getBoundingClientRect()
      const pcx = parent.left - container.left + parent.width / 2
      const pcy = parent.bottom - container.top

      const newLines = childRefs
        .filter(r => r.current)
        .map(r => {
          const child = r.current!.getBoundingClientRect()
          const ccx = child.left - container.left + child.width / 2
          const ccy = child.top - container.top
          const midY = (pcy + ccy) / 2
          return { x1: pcx, y1: pcy, x2: ccx, y2: ccy, mx: ccx, my: midY }
        })

      setLines(newLines)
      setDims({ w: container.width, h: container.height })
    }

    measure()
    const observer = new ResizeObserver(measure)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [parentRef, childRefs, containerRef])

  if (!lines.length) return null

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={dims.w}
      height={dims.h}
      style={{ zIndex: 0 }}
    >
      {lines.map((l, i) => (
        <g key={i}>
          <line
            x1={l.x1} y1={l.y1}
            x2={l.x1} y2={l.my}
            stroke={color} strokeWidth="1.5" strokeOpacity="0.6"
          />
          <line
            x1={l.x1} y1={l.my}
            x2={l.x2} y2={l.my}
            stroke={color} strokeWidth="1.5" strokeOpacity="0.6"
          />
          <line
            x1={l.x2} y1={l.my}
            x2={l.x2} y2={l.y2}
            stroke={color} strokeWidth="1.5" strokeOpacity="0.6"
          />
        </g>
      ))}
    </svg>
  )
}

// ─── Sub-page Chips ────────────────────────────────────────────────────────────

function SubpageChips({ subpages, chipBg, chipText }: { subpages: string[]; chipBg: string; chipText: string }) {
  return (
    <div className="flex flex-wrap gap-1 mt-1.5 pt-1.5 border-t border-white/5">
      {subpages.map(sp => (
        <span
          key={sp}
          className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-medium leading-snug ${chipBg} ${chipText} opacity-80`}
        >
          {sp}
        </span>
      ))}
    </div>
  )
}

// ─── Page Box ─────────────────────────────────────────────────────────────────

function PageBox({ page, color, showSubpages }: { page: PageNode; color: ColorDef; showSubpages: boolean }) {
  const isAI = page.isAI

  return (
    <div
      className={[
        'rounded-md px-2.5 py-2 text-left w-full transition-all duration-150',
        isAI
          ? 'border border-dashed border-violet-500/50 bg-violet-950/40 ai-glow'
          : 'border border-white/5 bg-[#111827] hover:border-white/10',
      ].join(' ')}
      style={{ zIndex: 1, position: 'relative' }}
    >
      <div className="flex items-start gap-1.5">
        <span className={`mt-0.5 shrink-0 w-1.5 h-1.5 rounded-full ${isAI ? 'bg-violet-400' : color.pageDot}`} />
        <span className={`text-[11px] font-medium leading-snug flex-1 ${isAI ? 'text-violet-200' : 'text-slate-200'}`}>
          {page.label}
        </span>
        {isAI && (
          <span className="shrink-0 text-[8px] font-mono font-bold text-violet-400 bg-violet-900/60 border border-violet-600/40 rounded px-1 py-0.5 uppercase tracking-wider">
            AI
          </span>
        )}
      </div>
      {showSubpages && page.subpages && page.subpages.length > 0 && (
        <SubpageChips subpages={page.subpages} chipBg={color.chipBg} chipText={color.chipText} />
      )}
    </div>
  )
}

// ─── Section Column ────────────────────────────────────────────────────────────

function SectionColumn({
  section,
  color,
  sectionRef,
  showSubpages,
}: {
  section: SectionNode
  color: ColorDef
  sectionRef: React.RefObject<HTMLDivElement | null>
  showSubpages: boolean
}) {
  return (
    <div className="flex flex-col" style={{ width: 178, flexShrink: 0, zIndex: 1 }}>
      {/* Section header box */}
      <div
        ref={sectionRef}
        className={`rounded-lg border border-white/10 border-l-2 ${color.sectionBorder} ${color.sectionBg} px-3 py-2.5`}
        style={{ zIndex: 1 }}
      >
        <div className={`text-[10px] font-mono font-semibold uppercase tracking-widest ${color.sectionLabel}`}>
          {section.label}
        </div>
        <div className="text-[9px] font-mono text-slate-600 mt-0.5">
          {section.pages.length} page{section.pages.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Vertical connector from section to pages */}
      {section.pages.length > 0 && (
        <div className="flex justify-center py-1.5">
          <div className="w-px h-4 bg-slate-700" />
        </div>
      )}

      {/* Pages stacked vertically */}
      {section.pages.length > 0 && (
        <div className="flex flex-col gap-1">
          {section.pages.map(page => (
            <PageBox key={page.label} page={page} color={color} showSubpages={showSubpages} />
          ))}
        </div>
      )}

      {section.pages.length === 0 && (
        <div className="mt-2 px-2 text-[10px] font-mono text-slate-700 italic text-center">
          — logout action —
        </div>
      )}
    </div>
  )
}

// ─── Panel View ────────────────────────────────────────────────────────────────

function PanelView({ panel, showSubpages }: { panel: PanelDef; showSubpages: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<React.RefObject<HTMLDivElement | null>[]>(
    panel.sections.map(() => ({ current: null }))
  )

  const totalPages = panel.sections.reduce((t, s) => t + s.pages.length, 0)
  const aiCount = panel.sections.reduce((t, s) => t + s.pages.filter(p => p.isAI).length, 0)

  return (
    <div className="px-8 pb-12 pt-4 overflow-x-auto" ref={containerRef} style={{ position: 'relative' }}>
      {/* SVG connector lines layer */}
      <ConnectorLines
        parentRef={panelRef}
        childRefs={sectionRefs.current}
        color={panel.color.accent}
        containerRef={containerRef}
      />

      {/* Panel header node */}
      <div className="flex justify-center mb-0">
        <div
          ref={panelRef}
          className={`relative rounded-xl px-6 py-4 ${panel.color.headerBg} shadow-lg`}
          style={{ zIndex: 1, minWidth: 260 }}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl text-white/80">{panel.icon}</span>
            <div>
              <div className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Panel</div>
              <div className="text-base font-bold text-white leading-tight">{panel.label}</div>
            </div>
          </div>
          <div className="mt-2 text-[10px] text-white/50 font-mono">{panel.tagline}</div>
          <div className="mt-2 flex gap-3 text-[10px] font-mono text-white/40">
            <span>{panel.sections.length} sections</span>
            <span>·</span>
            <span>{totalPages} pages</span>
            {aiCount > 0 && (
              <>
                <span>·</span>
                <span className="text-violet-300">{aiCount} AI</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Spacer for connector lines */}
      <div style={{ height: 56 }} />

      {/* Sections row */}
      <div className="flex gap-4 min-w-max relative" style={{ zIndex: 1 }}>
        {panel.sections.map((section, i) => (
          <SectionColumn
            key={section.label}
            section={section}
            color={panel.color}
            sectionRef={sectionRefs.current[i]}
            showSubpages={showSubpages}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Overview Grid ─────────────────────────────────────────────────────────────

function OverviewGrid({ onSelectPanel }: { onSelectPanel: (id: PanelId) => void }) {
  return (
    <div className="px-8 py-6">
      {/* Root node */}
      <div className="flex flex-col items-center mb-8">
        <div className="bg-slate-800 border border-slate-600 rounded-2xl px-8 py-4 text-center shadow-xl">
          <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1">Root</div>
          <div className="text-lg font-bold text-white tracking-tight">Election Management Platform</div>
          <div className="text-[10px] font-mono text-slate-500 mt-1">SaaS · Multi-tenant · Multi-election</div>
        </div>
        <div className="w-px h-6 bg-slate-700 mt-0" />
      </div>

      {/* All panels overview grid */}
      <div className="grid grid-cols-3 gap-5 max-w-5xl mx-auto">
        {PANELS.map(panel => {
          const totalPages = panel.sections.reduce((t, s) => t + s.pages.length, 0)
          const aiCount = panel.sections.reduce((t, s) => t + s.pages.filter(p => p.isAI).length, 0)
          return (
            <button
              key={panel.id}
              onClick={() => onSelectPanel(panel.id)}
              className="text-left rounded-xl border border-white/8 bg-slate-900 overflow-hidden hover:border-white/20 hover:bg-slate-800 transition-all duration-200 group"
            >
              {/* Panel header */}
              <div className={`${panel.color.headerBg} px-4 py-3`}>
                <div className="flex items-center gap-2">
                  <span className="text-lg text-white/80">{panel.icon}</span>
                  <span className="text-sm font-bold text-white">{panel.label}</span>
                </div>
                <div className="text-[10px] font-mono text-white/50 mt-0.5">{panel.tagline}</div>
              </div>
              {/* Stats */}
              <div className="px-4 py-2 border-b border-white/5 flex gap-4 text-[10px] font-mono">
                <span className="text-slate-400">{panel.sections.length} sections</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400">{totalPages} pages</span>
                {aiCount > 0 && (
                  <>
                    <span className="text-slate-500">·</span>
                    <span className="text-violet-400">{aiCount} AI</span>
                  </>
                )}
              </div>
              {/* Sections list */}
              <div className="px-4 py-3">
                <div className="flex flex-col gap-1.5">
                  {panel.sections.map(s => (
                    <div key={s.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${panel.color.pageDot}`} />
                        <span className="text-[11px] text-slate-300">{s.label}</span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-600">{s.pages.length}p</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Click hint */}
              <div className="px-4 pb-3">
                <div className={`text-[9px] font-mono ${panel.color.sectionLabel} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  Click to explore →
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Architecture note */}
      <div className="mt-8 max-w-5xl mx-auto grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/5 bg-slate-900 px-5 py-4">
          <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-2">Architecture Notes</div>
          <div className="space-y-1.5 text-[11px] text-slate-400 leading-relaxed">
            <p>· Admin Panel and Client Panel are clearly separated access layers</p>
            <p>· Client Panel contains all election field operations (Voters, Members, Workers, Booths)</p>
            <p>· Intelligence, Communication, Data & Operations, and Organization are cross-cutting panel modules</p>
            <p>· Multi-tenant: each client account is isolated with its own election data</p>
          </div>
        </div>
        <div className="rounded-xl border border-violet-900/30 bg-violet-950/20 px-5 py-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[9px] font-mono text-violet-400 uppercase tracking-widest">AI Features</span>
            <span className="text-[8px] font-mono font-bold text-violet-400 bg-violet-900/60 border border-violet-600/40 rounded px-1 py-0.5 uppercase tracking-wider ai-glow">Proposed</span>
          </div>
          <div className="space-y-1.5 text-[11px] text-violet-300/70 leading-relaxed">
            <p>· AI Chat, Natural Language Search, Voice Query</p>
            <p>· AI Filtering, Data Analysis, Graph & Report Generation</p>
            <p>· Native Language Support, RAG AI Assistant</p>
            <p>· Human Approval required for all action operations</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── App ───────────────────────────────────────────────────────────────────────

type TabId = 'overview' | PanelId

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [showSubpages, setShowSubpages] = useState(true)

  const activePanel = PANELS.find(p => p.id === activeTab)

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ background: '#080d16', color: '#e2e8f0' }}>
      {/* Top header */}
      <header className="shrink-0 border-b border-white/8" style={{ background: '#0b1120' }}>
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-xl bg-slate-700 flex items-center justify-center text-slate-300 font-mono font-bold text-sm">
              IA
            </div>
            <div>
              <h1 className="text-[15px] font-semibold tracking-tight text-white">
                Election Management Platform
              </h1>
              <p className="text-[11px] font-mono text-slate-500 mt-px">
                Information Architecture · Sitemap · v1.0
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Sub-pages toggle */}
            <label className="flex items-center gap-2 cursor-pointer group">
              <span className="text-[11px] font-mono text-slate-500 group-hover:text-slate-300 transition-colors">
                Show sub-pages
              </span>
              <button
                onClick={() => setShowSubpages(s => !s)}
                className={[
                  'relative w-8 h-4 rounded-full transition-colors duration-200',
                  showSubpages ? 'bg-violet-600' : 'bg-slate-700',
                ].join(' ')}
              >
                <span
                  className={[
                    'absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform duration-200 shadow',
                    showSubpages ? 'left-4.5' : 'left-0.5',
                  ].join(' ')}
                  style={{ transform: showSubpages ? 'translateX(18px)' : 'translateX(2px)' }}
                />
              </button>
            </label>

            {/* Stats */}
            <div className="flex items-center gap-3 text-[10px] font-mono text-slate-600 border-l border-white/8 pl-4">
              <span>6 panels</span>
              <span>·</span>
              <span>{PANELS.reduce((t, p) => t + p.sections.length, 0)} sections</span>
              <span>·</span>
              <span>{PANELS.reduce((t, p) => t + p.sections.reduce((s, sec) => s + sec.pages.length, 0), 0)} pages</span>
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex items-end gap-0.5 px-8 overflow-x-auto">
          <TabBtn
            label="Overview"
            icon="⊞"
            active={activeTab === 'overview'}
            color="bg-slate-600 text-white"
            onClick={() => setActiveTab('overview')}
          />
          {PANELS.map(panel => (
            <TabBtn
              key={panel.id}
              label={panel.label}
              icon={panel.icon}
              active={activeTab === panel.id}
              color={panel.color.tabActive}
              onClick={() => setActiveTab(panel.id)}
            />
          ))}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {activeTab === 'overview' ? (
          <OverviewGrid onSelectPanel={(id) => setActiveTab(id)} />
        ) : activePanel ? (
          <div>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 px-8 pt-5 pb-1 text-[11px] font-mono text-slate-600">
              <button onClick={() => setActiveTab('overview')} className="hover:text-slate-300 transition-colors">
                Overview
              </button>
              <span>›</span>
              <span className={activePanel.color.sectionLabel}>{activePanel.label}</span>
            </div>
            <PanelView panel={activePanel} showSubpages={showSubpages} />
          </div>
        ) : null}
      </main>

      {/* Footer legend */}
      <footer className="shrink-0 border-t border-white/5 bg-[#0b1120] px-8 py-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-mono">
          <span className="text-slate-600 uppercase tracking-wide">Legend</span>
          {PANELS.map(p => (
            <div key={p.id} className="flex items-center gap-1.5">
              <span
                className={`w-2.5 h-2.5 rounded-sm ${p.color.headerBg}`}
              />
              <span className="text-slate-500">{p.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-4 h-3 rounded border border-dashed border-violet-500/50 bg-violet-950/40" />
            <span className="text-violet-400">AI / Proposed Feature</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-600">Sub-pages shown as chips inside page nodes</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

// ─── Tab Button ───────────────────────────────────────────────────────────────

function TabBtn({
  label, icon, active, color, onClick,
}: {
  label: string; icon: string; active: boolean; color: string; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={[
        'flex items-center gap-1.5 px-3.5 py-2 rounded-t-lg text-[11px] font-medium font-mono transition-colors duration-150 shrink-0 border-b-2',
        active
          ? `${color} border-transparent`
          : 'text-slate-500 hover:text-slate-300 bg-transparent border-transparent hover:bg-white/5',
      ].join(' ')}
    >
      <span className="text-sm">{icon}</span>
      {label}
    </button>
  )
}
