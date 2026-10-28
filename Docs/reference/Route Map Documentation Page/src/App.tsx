function RouteBadge({ route }: { route: string }) {
  const parts = route.split(/(:\w+)/g);
  return (
    <span className="route-badge">
      {parts.map((part, i) =>
        part.startsWith(":") ? (
          <span key={i} style={{ color: "#F59E0B", fontWeight: 600 }}>{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

function SectionHeader({ num, title }: { num: string; title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <span className="section-num">§{num}</span>
      <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#111827", margin: 0 }}>{title}</h2>
    </div>
  );
}

function RouteTable({ rows }: { rows: [string, string][] }) {
  return (
    <table className="route-table">
      <thead>
        <tr>
          <th>Page</th>
          <th>Route</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([page, route]) => (
          <tr key={route}>
            <td style={{ fontWeight: 500, color: "#111827" }}>{page}</td>
            <td><RouteBadge route={route} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function FlowColumn({ steps }: { steps: string[] }) {
  return (
    <div className="flow-box">
      {steps.map((step, i) => (
        <div key={i}>
          <div className="flow-step">{step}</div>
          {i < steps.length - 1 && <div className="flow-arrow">↓</div>}
        </div>
      ))}
    </div>
  );
}

function NavTree({ lines }: { lines: string[] }) {
  return (
    <div className="nav-tree">
      {lines.map((l, i) => <div key={i}>{l}</div>)}
    </div>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div className="section-card" style={style}>
      {children}
    </div>
  );
}

function CardBody({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: "20px 24px" }}>{children}</div>;
}

function FlowLabel({ text }: { text: string }) {
  return (
    <p style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "#6B7280", margin: "16px 0 8px" }}>
      {text}
    </p>
  );
}

export default function App() {
  return (
    <div style={{ minHeight: "100%", background: "#FAFAFA", padding: "0 0 80px" }}>
      {/* Page Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "40px 0 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.68rem", fontWeight: 600, color: "#4361EE", background: "#EEF1FF", border: "1px solid #C5D0FA", borderRadius: 4, padding: "2px 10px", letterSpacing: "0.1em" }}>
              VOTERX — ELECTION MANAGEMENT
            </span>
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#0F172A", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
            Route Map
          </h1>
          <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0, fontWeight: 400 }}>
            Application routes, page connections, and navigation structure
          </p>
          <div style={{ marginTop: 20, display: "flex", gap: 20, flexWrap: "wrap" }}>
            {[
              ["16 Modules", "Total sections"],
              ["40+ Routes", "Defined paths"],
              [":id params", "Dynamic segments"],
            ].map(([val, label]) => (
              <div key={val} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.88rem", fontWeight: 600, color: "#4361EE" }}>{val}</span>
                <span style={{ fontSize: "0.7rem", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sections */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 40px 0" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

          {/* 01 Authentication */}
          <div>
            <SectionHeader num="01" title="Authentication" />
            <Card>
              <RouteTable rows={[
                ["Login", "/auth/login"],
                ["Register", "/auth/register"],
              ]} />
            </Card>
          </div>

          {/* 02 Dashboard */}
          <div>
            <SectionHeader num="02" title="Dashboard" />
            <Card>
              <RouteTable rows={[["Dashboard", "/dashboard"]]} />
            </Card>
          </div>

          {/* 03 Voters */}
          <div>
            <SectionHeader num="03" title="Voters" />
            <Card>
              <RouteTable rows={[
                ["Voter Board", "/voters"],
                ["Add Voter", "/voters/new"],
                ["Voter Profile", "/voters/:id"],
                ["Edit Voter", "/voters/:id/edit"],
              ]} />
              <CardBody>
                <FlowLabel text="Navigation Flows" />
                <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                  <FlowColumn steps={["Voter Board", "View Voter", "Voter Profile"]} />
                  <FlowColumn steps={["Voter Board", "Add Voter", "Create Voter"]} />
                  <FlowColumn steps={["Voter Profile", "Edit", "Edit Voter"]} />
                </div>
              </CardBody>
            </Card>
          </div>

          {/* 04 Members */}
          <div>
            <SectionHeader num="04" title="Members" />
            <Card>
              <RouteTable rows={[
                ["Members Board", "/members"],
                ["Add Member", "/members/new"],
                ["Registrations", "/members/registrations"],
                ["Registration Link", "/members/registration-link"],
              ]} />
              <CardBody>
                <FlowLabel text="Navigation Tree" />
                <NavTree lines={[
                  "Members",
                  "├── Add Member",
                  "├── Registrations",
                  "└── Registration Link",
                ]} />
              </CardBody>
            </Card>
          </div>

          {/* 05 Booth Officers */}
          <div>
            <SectionHeader num="05" title="Booth Officers" />
            <Card>
              <RouteTable rows={[
                ["Booth Officer Board", "/blo"],
                ["Add Booth Officer", "/blo/new"],
                ["Booth Officer Profile", "/blo/:id"],
                ["Edit Booth Officer", "/blo/:id/edit"],
              ]} />
            </Card>
          </div>

          {/* 06 Booths */}
          <div>
            <SectionHeader num="06" title="Booths" />
            <Card>
              <RouteTable rows={[
                ["Booth Board", "/booths"],
                ["Add Booth", "/booths/new"],
                ["Booth Details", "/booths/:id"],
                ["Edit Booth", "/booths/:id/edit"],
              ]} />
              <CardBody>
                <FlowLabel text="Navigation Flow" />
                <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>
                  <FlowColumn steps={["Booth Board", "Select Booth", "Booth Details"]} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingTop: 4 }}>
                    <span style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "#6B7280" }}>Booth Details contains</span>
                    {["Insight", "Voters", "Documents"].map(tab => (
                      <span key={tab} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.8rem", color: "#374151" }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4361EE", display: "inline-block", flexShrink: 0 }} />
                        {tab}
                      </span>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* 07 Forms */}
          <div>
            <SectionHeader num="07" title="Forms" />
            <Card>
              <RouteTable rows={[
                ["Forms Board", "/forms"],
                ["Create Form", "/forms/new"],
                ["Form Details", "/forms/:id"],
                ["Edit Form", "/forms/:id/edit"],
                ["Form Responses", "/forms/:id/responses"],
                ["Form Analytics", "/forms/:id/analytics"],
              ]} />
              <CardBody>
                <FlowLabel text="Navigation Flow" />
                <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>
                  <FlowColumn steps={["Forms", "Select Form", "Form Details"]} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingTop: 4 }}>
                    <span style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "#6B7280" }}>Form Details tabs</span>
                    {["Analytics", "Responses", "Edit Fields", "Access", "Share"].map(tab => (
                      <span key={tab} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.8rem", color: "#374151" }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4361EE", display: "inline-block", flexShrink: 0 }} />
                        {tab}
                      </span>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* 08 AI Calling */}
          <div>
            <SectionHeader num="08" title="AI Calling" />
            <Card>
              <RouteTable rows={[
                ["AI Calling", "/ai"],
                ["AI Analytics", "/ai/analytics"],
                ["AI Campaigns", "/ai/campaigns"],
                ["AI Assistants", "/ai/assistants"],
                ["Call History", "/ai/call-history"],
                ["Numbers", "/ai/numbers"],
                ["Workspace", "/ai/workspace"],
              ]} />
              <CardBody>
                <FlowLabel text="Navigation Tree" />
                <NavTree lines={[
                  "AI Calling",
                  "├── Analytics",
                  "├── Campaigns",
                  "├── Assistants",
                  "├── Call History",
                  "├── Numbers",
                  "└── Workspace",
                ]} />
              </CardBody>
            </Card>
          </div>

          {/* 09 Filters */}
          <div>
            <SectionHeader num="09" title="Filters" />
            <Card>
              <RouteTable rows={[["Filters", "/filters"]]} />
            </Card>
          </div>

          {/* 10 Update Requests */}
          <div>
            <SectionHeader num="10" title="Update Requests" />
            <Card>
              <RouteTable rows={[["Update Requests", "/update-requests"]]} />
              <CardBody>
                <FlowLabel text="Flow" />
                <FlowColumn steps={["Select Worker", "View Requests", "Review Request", "Approve / Reject"]} />
              </CardBody>
            </Card>
          </div>

          {/* 11 User Activities */}
          <div>
            <SectionHeader num="11" title="User Activities" />
            <Card>
              <RouteTable rows={[["User Activities", "/activities"]]} />
              <CardBody>
                <FlowLabel text="Flow" />
                <FlowColumn steps={["Activities", "Search Activity", "View Activity Details"]} />
              </CardBody>
            </Card>
          </div>

          {/* 12 Export */}
          <div>
            <SectionHeader num="12" title="Export" />
            <Card>
              <RouteTable rows={[["Export Voter Data", "/export"]]} />
              <CardBody>
                <FlowLabel text="Flow" />
                <FlowColumn steps={["Select Worker", "View Voters", "Search / Filter", "Export Excel"]} />
              </CardBody>
            </Card>
          </div>

          {/* 13 Phone Book */}
          <div>
            <SectionHeader num="13" title="Phone Book" />
            <Card>
              <RouteTable rows={[["Phone Book", "/phonebook"]]} />
              <CardBody>
                <FlowLabel text="Flow" />
                <FlowColumn steps={["Select Worker", "View Phone Book Voters", "Search", "Export Excel"]} />
              </CardBody>
            </Card>
          </div>

          {/* 14 Organization */}
          <div>
            <SectionHeader num="14" title="Organization" />
            <Card>
              <RouteTable rows={[
                ["Organization", "/organization"],
                ["Organization Members", "/organization/members"],
                ["Organization Access", "/organization/access"],
                ["Organization Permissions", "/organization/permissions"],
              ]} />
              <CardBody>
                <FlowLabel text="Navigation Tree" />
                <NavTree lines={[
                  "Organization",
                  "├── Members",
                  "├── My Access",
                  "└── Permissions",
                ]} />
              </CardBody>
            </Card>
          </div>

          {/* 15 Profile */}
          <div>
            <SectionHeader num="15" title="Profile" />
            <Card>
              <RouteTable rows={[["Profile", "/profile"]]} />
            </Card>
          </div>

          {/* 16 Operations */}
          <div>
            <SectionHeader num="16" title="Operations" />
            <Card>
              <RouteTable rows={[
                ["Operations", "/operations"],
                ["OCR", "/operations/ocr"],
                ["Jobs", "/operations/jobs"],
                ["Vidhan Sabha Management", "/operations/vidhan-sabha"],
                ["User Management", "/operations/users"],
                ["System Activity", "/operations/activity"],
                ["Quality Checks", "/operations/quality-checks"],
              ]} />
              <CardBody>
                <FlowLabel text="Navigation Tree" />
                <NavTree lines={[
                  "Operations",
                  "├── OCR",
                  "├── Jobs",
                  "├── Vidhan Sabha Management",
                  "├── User Management",
                  "├── System Activity",
                  "└── Quality Checks",
                ]} />
              </CardBody>
            </Card>
          </div>

          {/* 17 Route Parameters */}
          <div>
            <SectionHeader num="17" title="Route Parameters" />
            <div className="param-card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span className="param-highlight">:id</span>
                <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#92400E" }}>Dynamic database record ID</span>
              </div>
              <p style={{ fontSize: "0.825rem", color: "#78350F", margin: "0 0 16px" }}>
                Use <span className="mono" style={{ background: "#FEF3C7", padding: "1px 5px", borderRadius: 3 }}>:id</span> as a placeholder for any dynamic record identifier. The value is resolved at runtime from the database.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, marginBottom: 16 }}>
                {[
                  ["/voters/:id", "/voters/123"],
                  ["/booths/:id", "/booths/25"],
                  ["/forms/:id", "/forms/10"],
                ].map(([template, example]) => (
                  <div key={template} style={{ background: "#fff", border: "1px solid #FCD34D", borderRadius: 6, padding: "10px 12px" }}>
                    <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.75rem", color: "#92400E", marginBottom: 4 }}>{template}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: "0.7rem", color: "#B45309" }}>→</span>
                      <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.75rem", color: "#374151" }}>{example}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: "#FFFBEB", border: "1px solid #FCD34D", borderRadius: 5, padding: "8px 12px", display: "inline-flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.78rem", color: "#F59E0B", fontWeight: 600 }}>:id</span>
                <span style={{ fontSize: "0.78rem", color: "#78350F" }}>=</span>
                <span style={{ fontSize: "0.78rem", color: "#78350F" }}>dynamic value — do not create separate static routes for individual records</span>
              </div>
            </div>
          </div>

          {/* 18 Navigation Rules */}
          <div>
            <SectionHeader num="18" title="Navigation Rules" />
            <div className="rule-card">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#15803D" }}>Source of Truth</span>
                <div style={{ flex: 1, height: 1, background: "#86EFAC" }} />
              </div>
              <ol style={{ margin: 0, padding: "0 0 0 18px", display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  "Every page in the application must have a defined route.",
                  "Every navigation button must point to an existing route.",
                  "Use dynamic :id routes for individual records.",
                  "Do not create separate routes for individual voter, booth, or form records.",
                  "Figma page/frame names should match the page names in this Route Map.",
                  "The Route Map should be treated as the source of truth for application URL structure.",
                  "Buttons that perform actions without changing pages should not be treated as routes.",
                ].map((rule, i) => (
                  <li key={i} style={{ fontSize: "0.86rem", color: "#14532D", lineHeight: 1.5 }}>
                    {rule.includes(":id") ? (
                      <>
                        {rule.split(":id").map((part, j, arr) => (
                          <span key={j}>
                            {part}
                            {j < arr.length - 1 && <span className="mono" style={{ background: "#FEF3C7", color: "#92400E", padding: "0 4px", borderRadius: 3, fontWeight: 600 }}>:id</span>}
                          </span>
                        ))}
                      </>
                    ) : rule}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* 19 Important Examples */}
          <div>
            <SectionHeader num="19" title="Important Examples" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
              {[
                {
                  label: "Example 1",
                  steps: [
                    { tag: "Figma Button", value: "View Voter" },
                    { tag: "Page", value: "Voter Profile" },
                    { tag: "Route", value: "/voters/:id", isRoute: true },
                  ],
                },
                {
                  label: "Example 2",
                  steps: [
                    { tag: "Figma Button", value: "Add Voter" },
                    { tag: "Page", value: "Add Voter" },
                    { tag: "Route", value: "/voters/new", isRoute: true },
                  ],
                },
                {
                  label: "Example 3",
                  steps: [
                    { tag: "Figma Button", value: "View Analytics" },
                    { tag: "Page", value: "Form Analytics" },
                    { tag: "Route", value: "/forms/:id/analytics", isRoute: true },
                  ],
                },
              ].map(({ label, steps }) => (
                <div key={label} className="example-card">
                  <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.67rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#4361EE", background: "#EEF1FF", border: "1px solid #C5D0FA", borderRadius: 3, padding: "1px 7px", marginBottom: 12 }}>{label}</span>
                  {steps.map(({ tag, value, isRoute }, i) => (
                    <div key={tag}>
                      <div style={{ marginTop: i > 0 ? 2 : 8 }}>
                        <div style={{ fontSize: "0.67rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "#9CA3AF", marginBottom: 2 }}>{tag}</div>
                        {isRoute ? (
                          <RouteBadge route={value} />
                        ) : (
                          <div style={{ fontSize: "0.86rem", fontWeight: 600, color: "#111827" }}>{value}</div>
                        )}
                      </div>
                      {i < steps.length - 1 && (
                        <div style={{ color: "#4361EE", fontSize: "1rem", padding: "4px 0", lineHeight: 1 }}>↓</div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={{ marginTop: 60, paddingTop: 20, borderTop: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.72rem", color: "#9CA3AF" }}>VoterX — Route Map v1.0</span>
          <span style={{ fontSize: "0.72rem", color: "#9CA3AF" }}>Technical handoff document for developers and Antigravity</span>
        </div>
      </div>
    </div>
  );
}
