export default function AuthLeftPanel() {
  return (
    <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden" style={{ backgroundColor: "#0b1628" }}>
      {/* Background pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.04]"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Decorative circles — abstract ballot/vote motif */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px]" aria-hidden="true">
        <div className="absolute inset-0 rounded-full border border-white/5" />
        <div className="absolute inset-[15%] rounded-full border border-white/5" />
        <div className="absolute inset-[30%] rounded-full border border-white/5" />
        <div className="absolute inset-[45%] rounded-full border border-blue-400/20" />
        <div className="absolute inset-[48%] rounded-full bg-blue-600/10" />
      </div>

      {/* Floating stat cards */}
      <div className="absolute top-[22%] right-8 bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 text-white" aria-hidden="true">
        <p className="text-[10px] uppercase tracking-widest text-white/50 font-medium mb-1">Active Campaigns</p>
        <p className="text-2xl font-semibold" style={{ fontFamily: "Fraunces, serif" }}>2,847</p>
      </div>
      <div className="absolute bottom-[28%] left-8 bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 text-white" aria-hidden="true">
        <p className="text-[10px] uppercase tracking-widest text-white/50 font-medium mb-1">Votes Processed</p>
        <p className="text-2xl font-semibold" style={{ fontFamily: "Fraunces, serif" }}>148M+</p>
      </div>

      {/* Dot cluster */}
      <div className="absolute bottom-[38%] right-10 flex gap-1.5 opacity-30" aria-hidden="true">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            {[...Array(5)].map((_, j) => (
              <div
                key={j}
                className="w-1 h-1 rounded-full bg-blue-400"
                style={{ opacity: Math.random() > 0.4 ? 1 : 0.3 }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Logo & branding */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
          {/* VoterX logo mark */}
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <rect x="2" y="8" width="18" height="12" rx="2" stroke="white" strokeWidth="1.8" />
              <path d="M7 8V6a4 4 0 018 0v2" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M7.5 14.5l2 2L14.5 12" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span
            className="text-white text-2xl font-semibold tracking-tight"
            style={{ fontFamily: "Fraunces, serif" }}
          >
            VoterX
          </span>
        </div>
      </div>

      {/* Center tagline */}
      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <h1
          className="text-white text-4xl xl:text-5xl font-semibold leading-[1.15] mb-4"
          style={{ fontFamily: "Fraunces, serif" }}
        >
          Election Management<br />
          <span className="text-blue-400">&amp; Campaign</span><br />
          Operations
        </h1>
        <p className="text-white/50 text-base leading-relaxed max-w-xs">
          The trusted platform for transparent, secure, and scalable democratic processes.
        </p>
      </div>

      {/* Bottom trust signals */}
      <div className="relative z-10 flex items-center gap-6">
        {["SOC 2 Type II", "FIPS 140-2", "EAC Certified"].map((badge) => (
          <div key={badge} className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span className="text-white/40 text-xs font-medium">{badge}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
