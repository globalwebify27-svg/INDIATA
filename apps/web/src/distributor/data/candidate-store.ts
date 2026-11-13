"use client";

export interface CandidateImageAssets {
  profilePhotoUrl: string;
  coverBannerUrl: string;
  partyLogoUrl: string;
  partySymbolUrl: string;
  slipBannerUrl: string;
  appIconUrl: string;
}

export interface CandidateProfile {
  id: string;
  name: string;
  nameEnglish: string;
  nameMarathi: string;
  marathiName: string;
  mobile: string;
  email: string;
  party: string;
  partyName: string;
  partyAcronym: string;
  partyMarathiName?: string;
  candidateType: "MAIN" | "ALLIANCE" | "INDEPENDENT" | "DUMMY";
  allianceName?: string;
  electionType: string;
  electionName: string;
  electionYear: string;
  pollingDate: string;
  seatCategory: "GENERAL" | "SC" | "ST" | "OBC";
  constituency: string;
  district: string;
  state: string;
  acNumber?: string;
  acName?: string;
  pcNumber?: string;
  pcName?: string;
  corporationWard?: string;
  totalVoters?: number;
  totalBooths?: number;
  gender: "MALE" | "FEMALE" | "OTHER";
  age?: number;
  dateOfBirth?: string;
  education?: string;
  occupation?: string;
  whatsappHelpline: string;
  officePhone?: string;
  officeAddress: string;
  city: string;
  pincode: string;
  slogan: string;
  publicSlipUrl: string;
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  accountType: "SALE" | "DEMO" | "Sale" | "Demo";
  status: "ACTIVE" | "PENDING_APPROVAL" | "EXPIRED" | "SUSPENDED";
  accountStatus: "Active" | "Inactive" | "Suspended";
  subscriptionPlan: "TRIAL_5D" | "OFFICE_6M" | "OFFICE_12M" | "ELECTION_MODULE";
  subscriptionTier: string;
  subscriptionStatus: "Active" | "Expiring" | "Expired" | "Pending";
  expiryDate: string;
  subscriptionExpiresAt: string;
  source: "DISTRIBUTOR";
  distributorId: string;
  totalUsers: number;
  hasAi: boolean;
  hasCampaigns: boolean;
  createdDate: string;
  registrationDate: string;
  features: {
    aiVoiceCall: boolean;
    whatsappBot: boolean;
    familyMapping: boolean;
    pdfExport: boolean;
  };
  images: CandidateImageAssets;
}

// Inline High-Fidelity SVG Generators to ensure 100% offline self-contained demo
function createPortraitSvg(initials: string, name: string, bgGradient: [string, string]): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bgGradient[0]}"/>
        <stop offset="100%" stop-color="${bgGradient[1]}"/>
      </linearGradient>
      <linearGradient id="sash" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#FF9933"/>
        <stop offset="50%" stop-color="#FFFFFF"/>
        <stop offset="100%" stop-color="#128807"/>
      </linearGradient>
    </defs>
    <rect width="400" height="400" fill="url(#bg)"/>
    <circle cx="200" cy="150" r="75" fill="#FFFFFF" fill-opacity="0.15"/>
    <path d="M 125 150 A 75 75 0 0 1 275 150 Q 275 225 200 230 Q 125 225 125 150 Z" fill="#FCE7D0"/>
    <path d="M 115 130 Q 200 80 285 130 Q 250 100 200 100 Q 150 100 115 130 Z" fill="#1E293B"/>
    <circle cx="170" cy="160" r="6" fill="#1E293B"/>
    <circle cx="230" cy="160" r="6" fill="#1E293B"/>
    <path d="M 185 195 Q 200 205 215 195" stroke="#1E293B" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M 100 400 C 100 270 300 270 300 400 Z" fill="#FFFFFF"/>
    <path d="M 130 300 L 270 400 L 240 400 L 110 310 Z" fill="url(#sash)"/>
    <text x="200" y="260" font-family="system-ui, sans-serif" font-size="16" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">${initials}</text>
    <rect x="0" y="340" width="400" height="60" fill="#010627" fill-opacity="0.85"/>
    <text x="200" y="375" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${name}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createBannerSvg(title: string, slogan: string, bgGradient: [string, string]): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" width="100%" height="100%">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bgGradient[0]}"/>
        <stop offset="100%" stop-color="${bgGradient[1]}"/>
      </linearGradient>
      <linearGradient id="sash" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#FF9933"/>
        <stop offset="50%" stop-color="#FFFFFF"/>
        <stop offset="100%" stop-color="#128807"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="400" fill="url(#bg)"/>
    <rect x="0" y="0" width="30" height="400" fill="url(#sash)"/>
    <circle cx="1050" cy="200" r="160" fill="#FFFFFF" fill-opacity="0.08"/>
    <circle cx="1100" cy="180" r="90" fill="#FFFFFF" fill-opacity="0.05"/>
    <text x="70" y="160" font-family="system-ui, sans-serif" font-size="44" font-weight="900" fill="#FFFFFF" letter-spacing="1">${title}</text>
    <text x="70" y="225" font-family="'Noto Sans Devanagari', system-ui, sans-serif" font-size="24" font-weight="bold" fill="#FDE047">${slogan}</text>
    <rect x="70" y="270" width="320" height="48" rx="12" fill="#FFFFFF" fill-opacity="0.2"/>
    <text x="230" y="302" font-family="system-ui, sans-serif" font-size="15" font-weight="bold" fill="#FFFFFF" text-anchor="middle">OFFICIAL WAR ROOM CAMPAIGN</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createSymbolSvg(symbolName: string, iconType: "torch" | "sun" | "tractor" | "bow" | "book"): string {
  let iconGraphic = "";
  if (iconType === "torch") {
    iconGraphic = `<path d="M 170 120 L 230 120 L 215 320 L 185 320 Z" fill="#94A3B8"/>
      <path d="M 160 120 L 240 120 L 225 80 L 175 80 Z" fill="#CBD5E1"/>
      <path d="M 200 20 Q 240 50 200 90 Q 160 50 200 20 Z" fill="#EF4444"/>
      <path d="M 200 40 Q 220 60 200 80 Q 180 60 200 40 Z" fill="#FBBF24"/>`;
  } else if (iconType === "sun") {
    iconGraphic = `<circle cx="200" cy="200" r="60" fill="#F59E0B"/>
      ${[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 200 + Math.cos(rad) * 75;
        const y1 = 200 + Math.sin(rad) * 75;
        const x2 = 200 + Math.cos(rad) * 110;
        const y2 = 200 + Math.sin(rad) * 110;
        return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#F59E0B" stroke-width="10" stroke-linecap="round"/>`;
      }).join("")}`;
  } else if (iconType === "tractor") {
    iconGraphic = `<circle cx="130" cy="240" r="35" fill="#334155" stroke="#F59E0B" stroke-width="8"/>
      <circle cx="270" cy="220" r="55" fill="#334155" stroke="#F59E0B" stroke-width="10"/>
      <rect x="120" y="160" width="130" height="50" rx="6" fill="#16A34A"/>
      <path d="M 220 160 L 260 110 L 290 110 L 290 170 Z" fill="#15803D"/>
      <rect x="140" y="120" width="12" height="40" fill="#334155"/>`;
  } else if (iconType === "bow") {
    iconGraphic = `<path d="M 120 80 C 260 80 260 320 120 320" stroke="#0284C7" stroke-width="12" fill="none" stroke-linecap="round"/>
      <line x1="120" y1="80" x2="120" y2="320" stroke="#94A3B8" stroke-width="4"/>
      <line x1="100" y1="200" x2="300" y2="200" stroke="#DC2626" stroke-width="8" stroke-linecap="round"/>
      <polygon points="300,200 270,185 270,215" fill="#DC2626"/>`;
  } else {
    iconGraphic = `<path d="M 80 260 C 140 240 200 250 200 280 C 200 250 260 240 320 260 L 320 130 C 260 110 200 120 200 150 C 200 120 140 110 80 130 Z" fill="#6366F1"/>
      <line x1="200" y1="150" x2="200" y2="280" stroke="#FFFFFF" stroke-width="4"/>
      <path d="M 280 80 L 310 110 L 250 170 L 220 140 Z" fill="#F59E0B"/>
      <polygon points="220,140 210,165 235,155" fill="#1E293B"/>`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <rect width="400" height="400" rx="40" fill="#F8FAFC"/>
    <rect x="10" y="10" width="380" height="380" rx="30" fill="none" stroke="#E2E8F0" stroke-width="4"/>
    ${iconGraphic}
    <text x="200" y="365" font-family="system-ui, sans-serif" font-size="18" font-weight="900" fill="#0F172A" text-anchor="middle">${symbolName}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createLogoSvg(acronym: string, color: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <circle cx="200" cy="200" r="180" fill="${color}"/>
    <circle cx="200" cy="200" r="160" fill="#FFFFFF" fill-opacity="0.15"/>
    <text x="200" y="225" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">${acronym}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createSlipBannerSvg(constituency: string, candidate: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" width="100%" height="100%">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#0F172A"/>
        <stop offset="100%" stop-color="#2087FE"/>
      </linearGradient>
    </defs>
    <rect width="800" height="200" fill="url(#g)"/>
    <text x="40" y="65" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" fill="#93C5FD" text-transform="uppercase">ELECTION COMMISSION OF INDIA • OFFICIAL VOTER SLIP</text>
    <text x="40" y="115" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#FFFFFF">${constituency}</text>
    <text x="40" y="155" font-family="'Noto Sans Devanagari', system-ui, sans-serif" font-size="18" font-weight="bold" fill="#FDE047">उमेदवार: ${candidate}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createAppIconSvg(initials: string, bgColor: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
    <rect width="512" height="512" rx="128" fill="${bgColor}"/>
    <path d="M 256 96 L 384 160 L 384 288 C 384 368 256 424 256 424 C 256 424 128 368 128 288 L 128 160 Z" fill="#FFFFFF" fill-opacity="0.2"/>
    <text x="256" y="315" font-family="system-ui, sans-serif" font-size="130" font-weight="900" fill="#FFFFFF" text-anchor="middle">${initials}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Initial 5 Realistic Candidates for Western Maharashtra Franchise
export const INITIAL_CANDIDATE_PROFILES: CandidateProfile[] = [
  {
    id: "CAND-201",
    name: "Vikramaditya Shinde",
    nameEnglish: "Vikramaditya Shinde",
    nameMarathi: "विक्रमादित्य शिंदे",
    marathiName: "विक्रमादित्य शिंदे",
    mobile: "+91 98220 11221",
    email: "vikramaditya.shinde@rvc.org.in",
    party: "Rashtriya Vikas Congress (RVC)",
    partyName: "Rashtriya Vikas Congress",
    partyMarathiName: "राष्ट्रीय विकास काँग्रेस",
    partyAcronym: "RVC",
    candidateType: "MAIN",
    allianceName: "Maha Vikas Mahayuti",
    electionType: "Vidhan Sabha",
    electionName: "Maharashtra Legislative Assembly General Election 2026",
    electionYear: "2026",
    pollingDate: "20 Nov 2026",
    seatCategory: "GENERAL",
    constituency: "214 - Kothrud Assembly",
    district: "Pune",
    state: "Maharashtra",
    acNumber: "214",
    acName: "Kothrud",
    pcNumber: "34",
    pcName: "Pune Parliamentary",
    totalVoters: 342150,
    totalBooths: 284,
    gender: "MALE",
    age: 48,
    dateOfBirth: "1978-04-12",
    education: "Master of Business Administration (MBA), Pune University",
    occupation: "Industrialist & Social Reformer",
    whatsappHelpline: "+91 98220 11221",
    officePhone: "020-25448899",
    officeAddress: "Plot 42, Shinde Empire, Near Kothrud Bus Stand, Paud Road",
    city: "Pune",
    pincode: "411038",
    slogan: "विकास, विश्वास आणि प्रगती - कोथरूडचा हक्काचा आमदार!",
    publicSlipUrl: "https://rajtantra.in/slips/CAND-201",
    facebookUrl: "https://facebook.com/vikramaditya.kothrud",
    instagramUrl: "https://instagram.com/vikram_shinde_official",
    twitterUrl: "https://twitter.com/VikramShindeMLA",
    youtubeUrl: "https://youtube.com/@VikramShindeKothrud",
    accountType: "SALE",
    status: "ACTIVE",
    accountStatus: "Active",
    subscriptionPlan: "ELECTION_MODULE",
    subscriptionTier: "Platinum War Room (12M)",
    subscriptionStatus: "Active",
    expiryDate: "30 Nov 2026",
    subscriptionExpiresAt: "30 Nov 2026",
    source: "DISTRIBUTOR",
    distributorId: "DIS-101",
    totalUsers: 142,
    hasAi: true,
    hasCampaigns: true,
    createdDate: "01 Oct 2026",
    registrationDate: "01 Oct 2026",
    features: {
      aiVoiceCall: true,
      whatsappBot: true,
      familyMapping: true,
      pdfExport: true,
    },
    images: {
      profilePhotoUrl: createPortraitSvg("VS", "Vikramaditya Shinde", ["#0F172A", "#1E3A8A"]),
      coverBannerUrl: createBannerSvg("VIKRAMADITYA SHINDE", "विकास, विश्वास आणि प्रगती - कोथरूडचा हक्काचा आमदार!", ["#0F172A", "#2563EB"]),
      partyLogoUrl: createLogoSvg("RVC", "#2563EB"),
      partySymbolUrl: createSymbolSvg("MASHAL / TORCH", "torch"),
      slipBannerUrl: createSlipBannerSvg("214 - KOTHRUD ASSEMBLY", "विक्रमादित्य शिंदे (RVC)"),
      appIconUrl: createAppIconSvg("VS", "#2087FE"),
    },
  },
  {
    id: "CAND-202",
    name: "Sunita Rahul More",
    nameEnglish: "Sunita Rahul More",
    nameMarathi: "सुनिता राहुल मोरे",
    marathiName: "सुनिता राहुल मोरे",
    mobile: "+91 98220 22332",
    email: "sunita.more@mja-pune.in",
    party: "Maharashtra Jan Kalyan Aghadi (MJA)",
    partyName: "Maharashtra Jan Kalyan Aghadi",
    partyMarathiName: "महाराष्ट्र जनकल्याण आघाडी",
    partyAcronym: "MJA",
    candidateType: "MAIN",
    allianceName: "United Civic Front",
    electionType: "Municipal Corporation",
    electionName: "Pune Municipal Corporation Elections 2026",
    electionYear: "2026",
    pollingDate: "15 Dec 2026",
    seatCategory: "OBC",
    constituency: "Ward 14 - Prabhat Road",
    district: "Pune",
    state: "Maharashtra",
    corporationWard: "Ward 14 (Prabhat Road & Law College)",
    totalVoters: 48920,
    totalBooths: 46,
    gender: "FEMALE",
    age: 42,
    dateOfBirth: "1984-08-22",
    education: "B.Sc., LL.B, Symbiosis Law School",
    occupation: "Advocate & Education Trustee",
    whatsappHelpline: "+91 98220 22332",
    officePhone: "020-25671122",
    officeAddress: "Bungalow 7, Lane 4, Prabhat Road, Deccan Gymkhana",
    city: "Pune",
    pincode: "411004",
    slogan: "महिला सक्षमीकरण, पारदर्शक कारभार आणि प्रभाग १४ चा सर्वांगीण विकास!",
    publicSlipUrl: "https://rajtantra.in/slips/CAND-202",
    facebookUrl: "https://facebook.com/sunitamore.prabhatroad",
    instagramUrl: "https://instagram.com/adv_sunitamore",
    accountType: "SALE",
    status: "ACTIVE",
    accountStatus: "Active",
    subscriptionPlan: "OFFICE_12M",
    subscriptionTier: "Gold Intelligence (6M)",
    subscriptionStatus: "Active",
    expiryDate: "15 Jan 2027",
    subscriptionExpiresAt: "15 Jan 2027",
    source: "DISTRIBUTOR",
    distributorId: "DIS-101",
    totalUsers: 68,
    hasAi: false,
    hasCampaigns: true,
    createdDate: "10 Oct 2026",
    registrationDate: "10 Oct 2026",
    features: {
      aiVoiceCall: false,
      whatsappBot: true,
      familyMapping: true,
      pdfExport: true,
    },
    images: {
      profilePhotoUrl: createPortraitSvg("SM", "Sunita Rahul More", ["#4C1D95", "#831843"]),
      coverBannerUrl: createBannerSvg("ADV. SUNITA RAHUL MORE", "प्रभाग १४ - पारदर्शक आणि सक्षम नेतृत्व!", ["#581C87", "#BE185D"]),
      partyLogoUrl: createLogoSvg("MJA", "#D97706"),
      partySymbolUrl: createSymbolSvg("RISING SUN", "sun"),
      slipBannerUrl: createSlipBannerSvg("PMC WARD 14 PRABHAT ROAD", "सुनिता राहुल मोरे (MJA)"),
      appIconUrl: createAppIconSvg("SM", "#8B5CF6"),
    },
  },
  {
    id: "CAND-203",
    name: "Balasaheb K. Jagtap",
    nameEnglish: "Balasaheb K. Jagtap",
    nameMarathi: "बाळासाहेब के. जगताप",
    marathiName: "बाळासाहेब के. जगताप",
    mobile: "+91 98220 33443",
    email: "balasaheb.jagtap@haveli.org",
    party: "Independent / अपक्ष",
    partyName: "Independent / अपक्ष",
    partyMarathiName: "अपक्ष शेतकरी आघाडी",
    partyAcronym: "IND",
    candidateType: "INDEPENDENT",
    electionType: "Zilla Parishad",
    electionName: "Pune Zilla Parishad General Election 2026",
    electionYear: "2026",
    pollingDate: "05 Dec 2026",
    seatCategory: "GENERAL",
    constituency: "Haveli Rural ZP Circle",
    district: "Pune",
    state: "Maharashtra",
    totalVoters: 76400,
    totalBooths: 72,
    gender: "MALE",
    age: 56,
    dateOfBirth: "1970-02-15",
    education: "Higher Secondary (12th Agri Science)",
    occupation: "Agriculturist & Cooperative Director",
    whatsappHelpline: "+91 98220 33443",
    officeAddress: "Kisan Seva Kendra, Uruli Kanchan Chowk, Solapur Highway",
    city: "Haveli, Pune",
    pincode: "412202",
    slogan: "शेतकरी, बागायतदार आणि कष्टकऱ्यांचा बुलंद आवाज - बाळासाहेब जगताप!",
    publicSlipUrl: "https://rajtantra.in/slips/CAND-203",
    accountType: "DEMO",
    status: "ACTIVE",
    accountStatus: "Active",
    subscriptionPlan: "TRIAL_5D",
    subscriptionTier: "Trial Demo (5 Days)",
    subscriptionStatus: "Expiring",
    expiryDate: "09 Nov 2026",
    subscriptionExpiresAt: "09 Nov 2026",
    source: "DISTRIBUTOR",
    distributorId: "DIS-101",
    totalUsers: 12,
    hasAi: false,
    hasCampaigns: false,
    createdDate: "04 Nov 2026",
    registrationDate: "04 Nov 2026",
    features: {
      aiVoiceCall: false,
      whatsappBot: false,
      familyMapping: false,
      pdfExport: true,
    },
    images: {
      profilePhotoUrl: createPortraitSvg("BJ", "Balasaheb K. Jagtap", ["#064E3B", "#065F46"]),
      coverBannerUrl: createBannerSvg("BALASAHEB K. JAGTAP", "शेतकरी आणि ग्रामस्थांचा बुलंद आवाज!", ["#064E3B", "#16A34A"]),
      partyLogoUrl: createLogoSvg("IND", "#16A34A"),
      partySymbolUrl: createSymbolSvg("TRACTOR / ट्रॅक्टर", "tractor"),
      slipBannerUrl: createSlipBannerSvg("HAVELI RURAL ZP CIRCLE", "बाळासाहेब जगताप (अपक्ष)"),
      appIconUrl: createAppIconSvg("BJ", "#10B981"),
    },
  },
  {
    id: "CAND-204",
    name: "Adv. Ganesh V. Narvekar",
    nameEnglish: "Adv. Ganesh V. Narvekar",
    nameMarathi: "ॲड. गणेश व्ही. नार्वेकर",
    marathiName: "ॲड. गणेश व्ही. नार्वेकर",
    mobile: "+91 98220 44554",
    email: "ganesh.narvekar@swarajyamanch.in",
    party: "Swarajya Vikas Manch (SVM)",
    partyName: "Swarajya Vikas Manch",
    partyMarathiName: "स्वराज्य विकास मंच",
    partyAcronym: "SVM",
    candidateType: "MAIN",
    allianceName: "National Alliance",
    electionType: "Vidhan Sabha",
    electionName: "Maharashtra Legislative Assembly General Election 2026",
    electionYear: "2026",
    pollingDate: "20 Nov 2026",
    seatCategory: "GENERAL",
    constituency: "215 - Kasba Peth Assembly",
    district: "Pune",
    state: "Maharashtra",
    acNumber: "215",
    acName: "Kasba Peth",
    pcNumber: "34",
    pcName: "Pune Parliamentary",
    totalVoters: 284300,
    totalBooths: 242,
    gender: "MALE",
    age: 39,
    dateOfBirth: "1987-11-04",
    education: "B.A., LL.M (Constitutional Law)",
    occupation: "High Court Advocate",
    whatsappHelpline: "+91 98220 44554",
    officePhone: "020-24456789",
    officeAddress: "Narvekar Chambers, Near Shaniwar Wada, Shaniwar Peth",
    city: "Pune",
    pincode: "411030",
    slogan: "कसबा पेठेचा स्वाभिमान, ऐतिहासिक वारसा आणि आधुनिक विकास!",
    publicSlipUrl: "https://rajtantra.in/slips/CAND-204",
    facebookUrl: "https://facebook.com/advganeshnarvekar",
    instagramUrl: "https://instagram.com/adv_narvekar_kasba",
    twitterUrl: "https://twitter.com/GaneshNarvekar",
    accountType: "SALE",
    status: "ACTIVE",
    accountStatus: "Active",
    subscriptionPlan: "ELECTION_MODULE",
    subscriptionTier: "Platinum War Room (12M)",
    subscriptionStatus: "Active",
    expiryDate: "28 Feb 2027",
    subscriptionExpiresAt: "28 Feb 2027",
    source: "DISTRIBUTOR",
    distributorId: "DIS-101",
    totalUsers: 198,
    hasAi: true,
    hasCampaigns: true,
    createdDate: "20 Sep 2026",
    registrationDate: "20 Sep 2026",
    features: {
      aiVoiceCall: true,
      whatsappBot: true,
      familyMapping: true,
      pdfExport: true,
    },
    images: {
      profilePhotoUrl: createPortraitSvg("GN", "Adv. Ganesh V. Narvekar", ["#1E1B4B", "#312E81"]),
      coverBannerUrl: createBannerSvg("ADV. GANESH V. NARVEKAR", "कसबा पेठेचा स्वाभिमान आणि परिवर्तन!", ["#1E1B4B", "#4338CA"]),
      partyLogoUrl: createLogoSvg("SVM", "#0284C7"),
      partySymbolUrl: createSymbolSvg("BOW & ARROW", "bow"),
      slipBannerUrl: createSlipBannerSvg("215 - KASBA PETH ASSEMBLY", "ॲड. गणेश नार्वेकर (SVM)"),
      appIconUrl: createAppIconSvg("GN", "#0284C7"),
    },
  },
  {
    id: "CAND-205",
    name: "Pooja Santosh Gaikwad",
    nameEnglish: "Pooja Santosh Gaikwad",
    nameMarathi: "पूजा संतोष गायकवाड",
    marathiName: "पूजा संतोष गायकवाड",
    mobile: "+91 98220 55665",
    email: "pooja.gaikwad@samajmanch.org",
    party: "Rashtriya Samaj Manch (RSM)",
    partyName: "Rashtriya Samaj Manch",
    partyMarathiName: "राष्ट्रीय समाज मंच",
    partyAcronym: "RSM",
    candidateType: "MAIN",
    electionType: "Municipal Corporation",
    electionName: "Pune Municipal Corporation Elections 2026",
    electionYear: "2026",
    pollingDate: "15 Dec 2026",
    seatCategory: "SC",
    constituency: "Ward 22 - Shivajinagar",
    district: "Pune",
    state: "Maharashtra",
    corporationWard: "Ward 22 (Model Colony & Shivajinagar Gaothan)",
    totalVoters: 41200,
    totalBooths: 38,
    gender: "FEMALE",
    age: 34,
    dateOfBirth: "1992-06-18",
    education: "Master of Social Work (MSW), Karve Institute",
    occupation: "Social Activist & Youth Leader",
    whatsappHelpline: "+91 98220 55665",
    officeAddress: "Community Center, Behind Shivajinagar Court, Wakdewadi",
    city: "Pune",
    pincode: "411005",
    slogan: "शिक्षण, आरोग्य आणि सुरक्षित प्रभाग - तरुण नेतृत्वाला संधी द्या!",
    publicSlipUrl: "https://rajtantra.in/slips/CAND-205",
    accountType: "SALE",
    status: "PENDING_APPROVAL",
    accountStatus: "Active",
    subscriptionPlan: "OFFICE_6M",
    subscriptionTier: "Gold Intelligence (6M)",
    subscriptionStatus: "Pending",
    expiryDate: "15 Dec 2026",
    subscriptionExpiresAt: "15 Dec 2026",
    source: "DISTRIBUTOR",
    distributorId: "DIS-101",
    totalUsers: 0,
    hasAi: false,
    hasCampaigns: false,
    createdDate: "08 Nov 2026",
    registrationDate: "08 Nov 2026",
    features: {
      aiVoiceCall: false,
      whatsappBot: true,
      familyMapping: true,
      pdfExport: true,
    },
    images: {
      profilePhotoUrl: createPortraitSvg("PG", "Pooja Santosh Gaikwad", ["#134E4A", "#115E59"]),
      coverBannerUrl: createBannerSvg("POOJA SANTOSH GAIKWAD", "तरुण नेतृत्व, पारदर्शक कारभार!", ["#134E4A", "#0D9488"]),
      partyLogoUrl: createLogoSvg("RSM", "#6366F1"),
      partySymbolUrl: createSymbolSvg("BOOK & PEN", "book"),
      slipBannerUrl: createSlipBannerSvg("PMC WARD 22 SHIVAJINAGAR", "पूजा गायकवाड (RSM)"),
      appIconUrl: createAppIconSvg("PG", "#14B8A6"),
    },
  },
];

const LOCAL_STORAGE_KEY = "rajtantra_distributor_candidates_v1";

class CandidateStore {
  private candidates: Map<string, CandidateProfile> = new Map();
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    let loadedFromStorage = false;
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            for (const item of parsed) {
              this.candidates.set(item.id, item);
            }
            loadedFromStorage = true;
          }
        }
      } catch (err) {
        console.warn("Could not read candidates from localStorage:", err);
      }
    }

    if (!loadedFromStorage) {
      for (const cand of INITIAL_CANDIDATE_PROFILES) {
        this.candidates.set(cand.id, cand);
      }
      this.persist();
    }
  }

  private persist() {
    if (typeof window !== "undefined") {
      try {
        const list = Array.from(this.candidates.values());
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
      } catch (err) {
        console.warn("Could not save candidates to localStorage:", err);
      }
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      listener();
    }
  }

  public getAllCandidates(distributorId?: string): CandidateProfile[] {
    const all = Array.from(this.candidates.values());
    if (!distributorId) return all;
    return all.filter((c) => c.distributorId === distributorId);
  }

  public getCandidateById(id: string): CandidateProfile | null {
    return this.candidates.get(id) || null;
  }

  public updateCandidateBasicInfo(
    id: string,
    updates: Partial<CandidateProfile>
  ): CandidateProfile | null {
    const existing = this.candidates.get(id);
    if (!existing) return null;

    const updated: CandidateProfile = {
      ...existing,
      ...updates,
      nameEnglish: updates.name || existing.nameEnglish,
      nameMarathi: updates.nameMarathi || updates.marathiName || existing.nameMarathi,
      marathiName: updates.nameMarathi || updates.marathiName || existing.marathiName,
    };

    this.candidates.set(id, updated);
    this.persist();
    return updated;
  }

  public updateCandidateImages(
    id: string,
    newImages: Partial<CandidateImageAssets>
  ): CandidateProfile | null {
    const existing = this.candidates.get(id);
    if (!existing) return null;

    const updated: CandidateProfile = {
      ...existing,
      images: {
        ...existing.images,
        ...newImages,
      },
    };

    this.candidates.set(id, updated);
    this.persist();
    return updated;
  }

  public resetToDefault() {
    this.candidates.clear();
    for (const cand of INITIAL_CANDIDATE_PROFILES) {
      this.candidates.set(cand.id, cand);
    }
    this.persist();
  }
}

// Global Singleton Instance
export const candidateStore = new CandidateStore();
