import React, { useState, useMemo, useEffect, useRef } from 'react';

// Design System Color Tokens - Strictly Solid Colors (No Gradients)
const THEMES = {
  light: {
    bg: '#F6F7F9',
    sidebar: '#FFFFFF',
    card: '#FFFFFF',
    surface: '#F0F2F5',
    textPrimary: '#181B22',
    textSecondary: '#697386',
    textMuted: '#8992A3',
    border: '#E1E5EB',
    primary: '#3157D5',
    primaryHover: '#2747B5',
    success: '#16835D',
    successBg: '#E8F5EE',
    warning: '#B96C0B',
    warningBg: '#FDF4E7',
    error: '#D94343',
    errorBg: '#FDECEC',
    chart1: '#3157D5',
    chart2: '#16835D',
    chart3: '#B96C0B',
    chart4: '#7C3AED',
    chart5: '#0284C7',
  },
  dark: {
    bg: '#101216',
    sidebar: '#15181E',
    card: '#1A1E25',
    surface: '#222731',
    textPrimary: '#F3F4F6',
    textSecondary: '#A2AAB8',
    textMuted: '#7E8797',
    border: '#303641',
    primary: '#7895FF',
    primaryHover: '#91A6FF',
    success: '#40C995',
    successBg: '#133528',
    warning: '#F3B45C',
    warningBg: '#382A14',
    error: '#FF7373',
    errorBg: '#3B1717',
    chart1: '#7895FF',
    chart2: '#40C995',
    chart3: '#F3B45C',
    chart4: '#A78BFA',
    chart5: '#38BDF8',
  }
};

const Icon = ({ name, size = 18, className = '', color = 'currentColor' }) => {
  const icons = {
    layoutDashboard: <path d="M3 3h7v9H3zm11 0h7v5h-7zm0 9h7v9h-7zM3 16h7v5H3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
    users: <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></g>,
    userPlus: <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></g>,
    userCheck: <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></g>,
    megaphone: <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></g>,
    bot: <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8.01" y2="16"/><line x1="16" y1="16" x2="16.01" y2="16"/></g>,
    briefcase: <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></g>,
    bookOpen: <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></g>,
    creditCard: <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></g>,
    shieldAlert: <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></g>,
    settings: <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></g>,
    user: <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></g>,
    search: <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></g>,
    bell: <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></g>,
    sun: <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></g>,
    moon: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>,
    logOut: <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></g>,
    chevronDown: <polyline points="6 9 12 15 18 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>,
    chevronRight: <polyline points="9 18 15 12 9 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>,
    chevronLeft: <polyline points="15 18 9 12 15 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>,
    check: <polyline points="20 6 9 17 4 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>,
    x: <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>,
    filter: <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>,
    moreVertical: <g fill="currentColor"><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="19" r="1.5"/></g>,
    eye: <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></g>,
    eyeOff: <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></g>,
    arrowRight: <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></g>,
    download: <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></g>,
    printer: <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></g>,
    refreshCw: <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></g>,
    database: <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></g>,
    messageSquare: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>,
    smartphone: <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></g>,
    activity: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>,
    menu: <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></g>,
    copy: <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></g>,
    key: <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15.5 8.5 2 2a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4l-2-2a1 1 0 0 0-1.4 0L14 8.6"/><circle cx="7.5" cy="15.5" r="4.5"/></g>,
    lock: <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></g>,
    alertTriangle: <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></g>,
    fileText: <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></g>,
    send: <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></g>,
  };

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      {icons[name] || icons.layoutDashboard}
    </svg>
  );
};

const INITIAL_CANDIDATES = [
  {
    id: 'CAN-8091',
    name: 'Rameshwar Patil',
    marathiName: 'रामेश्वर पाटील',
    username: 'rameshwar_patil',
    email: 'rameshwar@patilcampaign.in',
    phone: '+91 98220 14590',
    party: 'Bharatiya Janata Party',
    partyMarathi: 'भारतीय जनता पक्ष',
    partyLogo: 'BJP_Symbol.svg',
    symbol: 'Lotus',
    electionType: 'Vidhan Sabha',
    electionName: 'Maharashtra Assembly Election 2024',
    electionYear: '2024',
    geography: 'Pune Cantonment (AC-214)',
    accountType: 'Sale',
    status: 'Active',
    subscriptionStatus: 'Active',
    planName: 'Vidhan Sabha Enterprise',
    usersUsed: 42,
    usersAllowed: 50,
    aiAccess: true,
    campaignStatus: 'Active',
    acquisitionSource: 'Distributor',
    acquisitionDistributor: 'MahaMedia Political Solutions',
    currentDistributor: 'MahaMedia Political Solutions',
    pendingEnquiries: 1,
    appName: 'Patil Express 2024',
    slipUrl: 'https://slips.rajatantra.in/pune214',
    pdfAccess: true,
    excelAccess: true,
    imageAccess: true,
    apkAccess: true,
    createdAt: '2024-03-12',
    expiresAt: '2024-12-31'
  },
  {
    id: 'CAN-8092',
    name: 'Devendra Deshmukh',
    marathiName: 'देवेन्द्र देशमुख',
    username: 'devendra_baramati',
    email: 'contact@deshmukhvoter.com',
    phone: '+91 98901 88421',
    party: 'Nationalist Congress Party',
    partyMarathi: 'राष्ट्रवादी काँग्रेस पक्ष',
    partyLogo: 'NCP_Clock.svg',
    symbol: 'Clock',
    electionType: 'Lok Sabha',
    electionName: 'General Parliamentary Election 2024',
    electionYear: '2024',
    geography: 'Baramati (PC-35)',
    accountType: 'Sale',
    status: 'Active',
    subscriptionStatus: 'Active',
    planName: 'Lok Sabha Supreme',
    usersUsed: 120,
    usersAllowed: 150,
    aiAccess: true,
    campaignStatus: 'Active',
    acquisitionSource: 'Direct',
    acquisitionDistributor: 'Direct Web Portal',
    currentDistributor: 'Sahyadri Campaign Tech',
    pendingEnquiries: 2,
    appName: 'Deshmukh Connect',
    slipUrl: 'https://slips.rajatantra.in/baramati35',
    pdfAccess: true,
    excelAccess: true,
    imageAccess: true,
    apkAccess: true,
    createdAt: '2024-01-15',
    expiresAt: '2024-06-30'
  },
  {
    id: 'CAN-8093',
    name: 'Sunita Ravindra Jadhav',
    marathiName: 'सुनिता रवींद्र जाधव',
    username: 'sunita_jadhav_pmc',
    email: 'sunita.jadhav@pmcward.in',
    phone: '+91 97654 32110',
    party: 'Shiv Sena',
    partyMarathi: 'शिवसेना',
    partyLogo: 'Bow_Arrow.svg',
    symbol: 'Bow and Arrow',
    electionType: 'Municipal Corporation',
    electionName: 'Pune Municipal Corporation Election 2024',
    electionYear: '2024',
    geography: 'Pune Ward 14 - Kothrud',
    accountType: 'Demo',
    status: 'Active',
    subscriptionStatus: 'Trial Expiring',
    planName: 'Municipal Starter (Demo)',
    usersUsed: 8,
    usersAllowed: 10,
    aiAccess: false,
    campaignStatus: 'Inactive',
    acquisitionSource: 'Distributor',
    acquisitionDistributor: 'Vidarbha-Western Digitech',
    currentDistributor: 'Vidarbha-Western Digitech',
    pendingEnquiries: 0,
    appName: 'Jadhav Tai PMC',
    slipUrl: 'https://slips.rajatantra.in/ward14',
    pdfAccess: true,
    excelAccess: false,
    imageAccess: true,
    apkAccess: false,
    createdAt: '2024-04-01',
    expiresAt: '2024-04-15'
  },
  {
    id: 'CAN-8094',
    name: 'Balasaheb Shinde',
    marathiName: 'बाळासाहेब शिंदे',
    username: 'bshinde_zp',
    email: 'office@bshinde.org',
    phone: '+91 94223 90812',
    party: 'Indian National Congress',
    partyMarathi: 'भारतीय राष्ट्रीय काँग्रेस',
    partyLogo: 'Hand_Symbol.svg',
    symbol: 'Hand',
    electionType: 'Zilla Parishad',
    electionName: 'Satara ZP Elections 2024',
    electionYear: '2024',
    geography: 'Satara - Karad North ZP',
    accountType: 'Sale',
    status: 'Inactive',
    subscriptionStatus: 'Expired',
    planName: 'Zilla Parishad Standard',
    usersUsed: 19,
    usersAllowed: 25,
    aiAccess: false,
    campaignStatus: 'Paused',
    acquisitionSource: 'Direct',
    acquisitionDistributor: 'Direct Web Portal',
    currentDistributor: 'Direct Web Portal',
    pendingEnquiries: 0,
    appName: 'Shinde ZP Vikas',
    slipUrl: 'https://slips.rajatantra.in/karadnorth',
    pdfAccess: true,
    excelAccess: true,
    imageAccess: true,
    apkAccess: false,
    createdAt: '2023-11-20',
    expiresAt: '2024-03-31'
  }
];

const INITIAL_DISTRIBUTORS = [
  {
    id: 'DIS-101',
    name: 'MahaMedia Political Solutions',
    contactPerson: 'Anand Kulkarni',
    email: 'anand@mahamedia.in',
    phone: '+91 98224 55100',
    city: 'Pune',
    state: 'Maharashtra',
    status: 'Active',
    candidateCount: 24,
    registeredDate: '2023-08-14'
  },
  {
    id: 'DIS-102',
    name: 'Vidarbha-Western Digitech',
    contactPerson: 'Pravin Wankhede',
    email: 'pravin@vwdigitech.com',
    phone: '+91 94221 67890',
    city: 'Nagpur',
    state: 'Maharashtra',
    status: 'Active',
    candidateCount: 16,
    registeredDate: '2023-10-02'
  },
  {
    id: 'DIS-103',
    name: 'Sahyadri Campaign Tech',
    contactPerson: 'Ganesh More',
    email: 'more@sahyadritech.co.in',
    phone: '+91 98811 23456',
    city: 'Kolhapur',
    state: 'Maharashtra',
    status: 'Active',
    candidateCount: 11,
    registeredDate: '2024-01-09'
  },
  {
    id: 'DIS-104',
    name: 'Marathwada Election Dynamics',
    contactPerson: 'Sanjay Rathod',
    email: 'contact@medynamics.in',
    phone: '+91 94034 89111',
    city: 'Chhatrapati Sambhajinagar',
    state: 'Maharashtra',
    status: 'Suspended',
    candidateCount: 3,
    registeredDate: '2023-05-18'
  }
];

const INITIAL_ENQUIRIES = [
  {
    id: 'ENQ-901',
    candidateId: 'CAN-8091',
    candidateName: 'Rameshwar Patil',
    type: 'WhatsApp Recharge',
    category: 'Communication',
    submissionDate: '2024-04-10 14:22',
    status: 'Pending',
    requestedQuantity: '1,00,000 Messages',
    remarks: 'Urgent quota required for booth worker communication prior to rally.'
  },
  {
    id: 'ENQ-902',
    candidateId: 'CAN-8092',
    candidateName: 'Devendra Deshmukh',
    type: 'AI Subscription',
    category: 'Intelligence',
    submissionDate: '2024-04-09 11:05',
    status: 'Under Review',
    requestedQuantity: '10 Additional AI Seats',
    remarks: 'Requesting access for statistical research team in parliamentary hub.'
  },
  {
    id: 'ENQ-903',
    candidateId: 'CAN-8092',
    candidateName: 'Devendra Deshmukh',
    type: 'Historical Election Data',
    category: 'Data Access',
    submissionDate: '2024-04-08 09:30',
    status: 'Approved',
    requestedQuantity: '2014 & 2019 Booth Wise Results',
    remarks: 'Constituency level demographic shift analysis needed.'
  },
  {
    id: 'ENQ-904',
    candidateId: 'CAN-8093',
    candidateName: 'Sunita Ravindra Jadhav',
    type: 'Slip Printer',
    category: 'Hardware',
    submissionDate: '2024-04-07 16:40',
    status: 'Completed',
    requestedQuantity: '2 Bluetooth Thermal Printers',
    remarks: 'Dispatch confirmed to campaign headquarters.'
  }
];

const INITIAL_AUDITS = [
  {
    id: 'AUD-55201',
    timestamp: '2024-04-12 11:28:44',
    actor: 'admin@rajatantra.gov.in',
    role: 'Super Administrator',
    action: 'CANDIDATE_AI_ACCESS_GRANTED',
    module: 'Candidate Management',
    affectedEntity: 'Devendra Deshmukh (CAN-8092)',
    reference: 'REQ-AI-883',
    result: 'Success'
  },
  {
    id: 'AUD-55200',
    timestamp: '2024-04-12 10:15:02',
    actor: 'admin@rajatantra.gov.in',
    role: 'Super Administrator',
    action: 'SUBSCRIPTION_PLAN_EXTENDED',
    module: 'Subscription Engine',
    affectedEntity: 'Rameshwar Patil (CAN-8091)',
    reference: 'ENQ-901',
    result: 'Success'
  },
  {
    id: 'AUD-55199',
    timestamp: '2024-04-11 17:42:19',
    actor: 'admin@rajatantra.gov.in',
    role: 'Super Administrator',
    action: 'DISTRIBUTOR_SUSPENDED',
    module: 'Distributor Management',
    affectedEntity: 'Marathwada Election Dynamics (DIS-104)',
    reference: 'COMPLAINT-22',
    result: 'Success'
  },
  {
    id: 'AUD-55198',
    timestamp: '2024-04-11 14:02:11',
    actor: 'admin@rajatantra.gov.in',
    role: 'Super Administrator',
    action: 'NEW_CANDIDATE_CREATED',
    module: 'Account Provisioning',
    affectedEntity: 'Sunita Ravindra Jadhav (CAN-8093)',
    reference: 'WIZARD-AC-2024',
    result: 'Success'
  }
];

export default function App() {
  // Theme state: light or dark
  const [theme, setTheme] = useState('light');
  const t = THEMES[theme];

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [authView, setAuthView] = useState('login'); // 'login' | 'forgot' | 'reset'
  const [loginEmail, setLoginEmail] = useState('superadmin@rajatantra.gov.in');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Password Recovery state
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState(false);

  // Main Navigation state
  const [activeNav, setActiveNav] = useState('dashboard'); // 'dashboard', 'all-candidates', 'add-candidate', 'candidate-requests', 'enquiries', 'campaigns', 'ai-dashboard', 'all-distributors', 'distributor-requests', 'tutorials', 'subscriptions', 'audit', 'settings', 'profile', 'candidate-control-panel'
  const [candidatesMenuOpen, setCandidatesMenuOpen] = useState(true);
  const [distributorsMenuOpen, setDistributorsMenuOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Data Collections
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [distributors, setDistributors] = useState(INITIAL_DISTRIBUTORS);
  const [enquiries, setEnquiries] = useState(INITIAL_ENQUIRIES);
  const [audits, setAudits] = useState(INITIAL_AUDITS);

  // Candidate Control Panel selected entity
  const [selectedCandidateId, setSelectedCandidateId] = useState('CAN-8091');
  const [candidatePanelTab, setCandidatePanelTab] = useState('overview');

  // Candidate Credential Delivery Modal
  const [deliveryModalCandidate, setDeliveryModalCandidate] = useState(null);
  const [deliveryChannel, setDeliveryChannel] = useState('both');
  const [deliverySent, setDeliverySent] = useState(false);

  // Notification Drawer & Global Toast
  const [toastMessage, setToastMessage] = useState(null);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');

  const triggerToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3800);
  };

  const selectedCandidate = useMemo(() => {
    return candidates.find(c => c.id === selectedCandidateId) || candidates[0];
  }, [candidates, selectedCandidateId]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    if (!loginEmail || !loginPassword) {
      setLoginError('Both username/email and password are required.');
      return;
    }
    setLoginLoading(true);
    setTimeout(() => {
      setLoginLoading(false);
      if (loginEmail.includes('rajatantra') || loginEmail.includes('admin')) {
        setIsAuthenticated(true);
        setActiveNav('dashboard');
        triggerToast('Welcome back, Super Administrator. Session verified.');
      } else {
        setLoginError('Invalid administrative credentials. Access strictly restricted.');
      }
    }, 600);
  };

  const handlePasswordResetSubmit = (e) => {
    e.preventDefault();
    if (!recoveryEmail) return;
    setRecoverySuccess(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setProfileDropdownOpen(false);
    setAuthView('login');
    triggerToast('Administrative session invalidated successfully.', 'info');
  };

  if (!isAuthenticated) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4 sm:p-6"
        style={{ backgroundColor: t.bg, color: t.textPrimary, fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        <div 
          className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-xl overflow-hidden"
          style={{ backgroundColor: t.card, border: `1px solid ${t.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
        >
          {/* Left Hero Panel - Solid Colors Only */}
          <div 
            className="p-8 sm:p-10 flex flex-col justify-between"
            style={{ backgroundColor: t.surface, borderRight: `1px solid ${t.border}` }}
          >
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white text-xl"
                  style={{ backgroundColor: t.primary }}
                >
                  R
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight" style={{ color: t.textPrimary }}>RAJATANTRA</h1>
                  <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded" style={{ backgroundColor: t.primaryHover, color: '#FFFFFF' }}>
                    Super Admin Console
                  </span>
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-3" style={{ color: t.textPrimary }}>
                Enterprise Platform Governance
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: t.textSecondary }}>
                Manage candidate accounts, subscriptions, distributors, and platform-wide campaign operations from one verified portal.
              </p>
            </div>

            {/* Static solid informational card */}
            <div 
              className="p-4 rounded-lg my-8"
              style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}
            >
              <div className="flex items-start gap-3">
                <div style={{ color: t.primary }} className="mt-0.5">
                  <Icon name="shieldAlert" size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-semibold mb-1" style={{ color: t.textPrimary }}>Administrative Notice</h3>
                  <p className="text-xs leading-normal" style={{ color: t.textSecondary }}>
                    This portal is restricted to authorized Rajatantra Super Administrators. All activities, configuration alterations, and user grants are logged immutably.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-xs" style={{ color: t.textMuted }}>
              Rajatantra Election Engine v4.8 • ISO/IEC 27001 Certified
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="p-8 sm:p-10 flex flex-col justify-center">
            {authView === 'login' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold" style={{ color: t.textPrimary }}>Sign In</h2>
                  <p className="text-xs mt-1" style={{ color: t.textSecondary }}>Enter your root administrator credentials</p>
                </div>

                {loginError && (
                  <div 
                    className="p-3 rounded-lg mb-4 text-xs font-medium flex items-center gap-2"
                    style={{ backgroundColor: t.errorBg, color: t.error, border: `1px solid ${t.error}` }}
                  >
                    <Icon name="alertTriangle" size={16} />
                    {loginError}
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: t.textSecondary }}>
                      Email or Administrator ID
                    </label>
                    <input 
                      type="text"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg outline-none transition"
                      style={{ 
                        backgroundColor: t.surface, 
                        border: `1px solid ${t.border}`, 
                        color: t.textPrimary 
                      }}
                      placeholder="superadmin@rajatantra.gov.in"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: t.textSecondary }}>
                        Password
                      </label>
                      <button 
                        type="button" 
                        onClick={() => setAuthView('forgot')}
                        className="text-xs font-medium hover:underline"
                        style={{ color: t.primary }}
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm rounded-lg outline-none pr-10"
                        style={{ 
                          backgroundColor: t.surface, 
                          border: `1px solid ${t.border}`, 
                          color: t.textPrimary 
                        }}
                        placeholder="••••••••••••"
                        required
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5"
                        style={{ color: t.textMuted }}
                      >
                        <Icon name={showPassword ? "eyeOff" : "eye"} size={18} />
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={loginLoading}
                    className="w-full py-2.5 text-sm font-semibold text-white rounded-lg transition mt-2 flex items-center justify-center gap-2"
                    style={{ backgroundColor: t.primary }}
                  >
                    {loginLoading ? (
                      <>
                        <Icon name="refreshCw" size={16} className="animate-spin" />
                        Authenticating Credentials...
                      </>
                    ) : (
                      'Sign In to Super Admin'
                    )}
                  </button>
                </form>

                <div className="mt-8 pt-4 text-center text-xs" style={{ borderTop: `1px solid ${t.border}`, color: t.textMuted }}>
                  Theme Preference: 
                  <button 
                    onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
                    className="ml-2 font-semibold hover:underline" 
                    style={{ color: t.primary }}
                  >
                    Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
                  </button>
                </div>
              </div>
            )}

            {authView === 'forgot' && (
              <div>
                <button 
                  onClick={() => setAuthView('login')}
                  className="flex items-center gap-1.5 text-xs font-medium mb-4 hover:underline"
                  style={{ color: t.primary }}
                >
                  <Icon name="chevronLeft" size={16} /> Back to Sign In
                </button>
                <h2 className="text-2xl font-bold" style={{ color: t.textPrimary }}>Reset Password</h2>
                <p className="text-xs mt-1 mb-6" style={{ color: t.textSecondary }}>
                  Enter your registered administrator email to receive secure recovery instructions.
                </p>

                {recoverySuccess ? (
                  <div className="p-4 rounded-lg text-xs leading-relaxed" style={{ backgroundColor: t.successBg, color: t.success, border: `1px solid ${t.success}` }}>
                    <strong>Reset instructions dispatched.</strong> If the username or email is tied to a Super Admin account, a time-limited one-time link has been issued.
                  </div>
                ) : (
                  <form onSubmit={handlePasswordResetSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: t.textSecondary }}>
                        Registered Email
                      </label>
                      <input 
                        type="email"
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm rounded-lg outline-none"
                        style={{ backgroundColor: t.surface, border: `1px solid ${t.border}`, color: t.textPrimary }}
                        placeholder="admin@rajatantra.gov.in"
                        required
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full py-2.5 text-sm font-semibold text-white rounded-lg transition"
                      style={{ backgroundColor: t.primary }}
                    >
                      Send Reset Instructions
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const navigateTo = (view, candId = null) => {
    setActiveNav(view);
    if (candId) {
      setSelectedCandidateId(candId);
    }
    setMobileMenuOpen(false);
  };

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: 'layoutDashboard' },
    {
      key: 'candidates-group',
      label: 'Candidates',
      icon: 'users',
      subItems: [
        { key: 'all-candidates', label: 'All Candidates' },
        { key: 'add-candidate', label: 'Add Candidate' },
        { key: 'candidate-requests', label: 'New Candidate Requests', badge: '3' },
        { key: 'enquiries', label: 'Generated Enquiries', badge: '5' },
      ]
    },
    { key: 'campaigns', label: 'Campaign Dashboard', icon: 'megaphone' },
    { key: 'ai-dashboard', label: 'AI Dashboard', icon: 'bot' },
    {
      key: 'distributors-group',
      label: 'Distributors',
      icon: 'briefcase',
      subItems: [
        { key: 'all-distributors', label: 'All Distributors' },
        { key: 'distributor-requests', label: 'Distributor Requests', badge: '2' },
      ]
    },
    { key: 'tutorials', label: 'Tutorials / Knowledge', icon: 'bookOpen' },
    { key: 'subscriptions', label: 'Subscription Plans', icon: 'creditCard' },
    { key: 'audit', label: 'Platform Audit', icon: 'shieldAlert' },
    { key: 'settings', label: 'Platform Settings', icon: 'settings' },
    { key: 'profile', label: 'Super Admin Profile', icon: 'user' },
  ];

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: t.bg, color: t.textPrimary, fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div 
          className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-lg transition-all"
          style={{ 
            backgroundColor: toastMessage.type === 'error' ? t.error : t.card,
            color: toastMessage.type === 'error' ? '#FFFFFF' : t.textPrimary,
            border: `1px solid ${toastMessage.type === 'error' ? t.error : t.border}`
          }}
        >
          <Icon name={toastMessage.type === 'error' ? "alertTriangle" : "check"} size={16} />
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* Main Layout Container */}
      <div className="flex flex-1 min-h-screen">
        {/* Left Sidebar */}
        <aside 
          className={`
            fixed md:static inset-y-0 left-0 z-40 transition-all duration-200 flex flex-col
            ${sidebarCollapsed ? 'w-20' : 'w-64'}
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
          style={{ 
            backgroundColor: t.sidebar, 
            borderRight: `1px solid ${t.border}` 
          }}
        >
          {/* Logo Brand Header */}
          <div 
            className="h-16 px-4 flex items-center justify-between"
            style={{ borderBottom: `1px solid ${t.border}` }}
          >
            <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => navigateTo('dashboard')}>
              <div 
                className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white text-lg flex-shrink-0"
                style={{ backgroundColor: t.primary }}
              >
                R
              </div>
              {!sidebarCollapsed && (
                <div className="leading-tight">
                  <div className="font-bold text-sm tracking-tight" style={{ color: t.textPrimary }}>RAJATANTRA</div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: t.primary }}>Super Admin</div>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden md:flex p-1.5 rounded-lg text-gray-500 hover:text-gray-700"
              style={{ color: t.textSecondary }}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <Icon name={sidebarCollapsed ? "chevronRight" : "chevronLeft"} size={16} />
            </button>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1.5"
              style={{ color: t.textSecondary }}
            >
              <Icon name="x" size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {navItems.map((item) => {
              if (item.subItems) {
                const isGroupExpanded = item.key === 'candidates-group' ? candidatesMenuOpen : distributorsMenuOpen;
                const toggleGroup = () => {
                  if (item.key === 'candidates-group') setCandidatesMenuOpen(!candidatesMenuOpen);
                  if (item.key === 'distributors-group') setDistributorsMenuOpen(!distributorsMenuOpen);
                };

                const isAnySubActive = item.subItems.some(sub => sub.key === activeNav) || (item.key === 'candidates-group' && activeNav === 'candidate-control-panel');

                return (
                  <div key={item.key} className="space-y-1">
                    <button
                      onClick={toggleGroup}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition"
                      style={{ 
                        color: isAnySubActive ? t.primary : t.textSecondary,
                        backgroundColor: isAnySubActive ? t.surface : 'transparent'
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Icon name={item.icon} size={18} />
                        {!sidebarCollapsed && <span>{item.label}</span>}
                      </div>
                      {!sidebarCollapsed && (
                        <Icon name={isGroupExpanded ? "chevronDown" : "chevronRight"} size={14} />
                      )}
                    </button>

                    {isGroupExpanded && !sidebarCollapsed && (
                      <div className="pl-8 space-y-1">
                        {item.subItems.map(sub => (
                          <button
                            key={sub.key}
                            onClick={() => navigateTo(sub.key)}
                            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition text-left"
                            style={{ 
                              color: activeNav === sub.key ? t.primary : t.textSecondary,
                              backgroundColor: activeNav === sub.key ? t.surface : 'transparent',
                              fontWeight: activeNav === sub.key ? '600' : '500'
                            }}
                          >
                            <span>{sub.label}</span>
                            {sub.badge && (
                              <span 
                                className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                                style={{ backgroundColor: t.primary, color: '#FFFFFF' }}
                              >
                                {sub.badge}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              const isActive = activeNav === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => navigateTo(item.key)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition"
                  style={{ 
                    color: isActive ? t.primary : t.textSecondary,
                    backgroundColor: isActive ? t.surface : 'transparent',
                    fontWeight: isActive ? '600' : '500'
                  }}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon name={item.icon} size={18} />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer User Info */}
          <div 
            className="p-3"
            style={{ borderTop: `1px solid ${t.border}`, backgroundColor: t.sidebar }}
          >
            <div className="flex items-center gap-3 p-2 rounded-lg" style={{ backgroundColor: t.surface }}>
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white"
                style={{ backgroundColor: t.primary }}
              >
                SA
              </div>
              {!sidebarCollapsed && (
                <div className="overflow-hidden flex-1 leading-tight">
                  <div className="text-xs font-semibold truncate" style={{ color: t.textPrimary }}>Super Admin</div>
                  <div className="text-[10px] truncate" style={{ color: t.textMuted }}>gov.in root</div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Bar Navigation */}
          <header 
            className="h-16 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30"
            style={{ backgroundColor: t.sidebar, borderBottom: `1px solid ${t.border}` }}
          >
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-lg"
                style={{ color: t.textSecondary }}
              >
                <Icon name="menu" size={20} />
              </button>

              {/* Breadcrumb Heading */}
              <div>
                <div className="flex items-center gap-2 text-xs" style={{ color: t.textMuted }}>
                  <span>Rajatantra Admin</span>
                  <span>/</span>
                  <span className="capitalize font-medium" style={{ color: t.textPrimary }}>
                    {activeNav.replace('-', ' ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Header Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Global search */}
              <div className="relative hidden sm:block w-48 lg:w-64">
                <input 
                  type="text" 
                  value={globalSearchTerm}
                  onChange={(e) => setGlobalSearchTerm(e.target.value)}
                  placeholder="Search candidate, distributor, ID..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg outline-none"
                  style={{ backgroundColor: t.surface, border: `1px solid ${t.border}`, color: t.textPrimary }}
                />
                <div className="absolute left-2.5 top-2" style={{ color: t.textMuted }}>
                  <Icon name="search" size={14} />
                </div>
              </div>

              {/* Light / Dark Mode Toggle */}
              <button 
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="p-2 rounded-lg transition"
                style={{ backgroundColor: t.surface, color: t.textSecondary, border: `1px solid ${t.border}` }}
                title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              >
                <Icon name={theme === 'light' ? 'moon' : 'sun'} size={16} />
              </button>

              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotificationDrawer(!showNotificationDrawer)}
                  className="p-2 rounded-lg relative transition"
                  style={{ backgroundColor: t.surface, color: t.textSecondary, border: `1px solid ${t.border}` }}
                >
                  <Icon name="bell" size={16} />
                  <span 
                    className="absolute top-1 right-1 w-2 h-2 rounded-full"
                    style={{ backgroundColor: t.error }}
                  />
                </button>

                {showNotificationDrawer && (
                  <div 
                    className="absolute right-0 mt-2 w-80 rounded-xl p-3 shadow-xl z-50 text-xs"
                    style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}
                  >
                    <div className="flex items-center justify-between pb-2 mb-2" style={{ borderBottom: `1px solid ${t.border}` }}>
                      <span className="font-bold" style={{ color: t.textPrimary }}>Administrative Alerts</span>
                      <span className="text-[10px] font-semibold" style={{ color: t.primary }}>2 Pending</span>
                    </div>
                    <div className="space-y-2">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: t.surface }}>
                        <div className="font-semibold" style={{ color: t.textPrimary }}>New Candidate Registration</div>
                        <div className="text-[11px] mt-0.5" style={{ color: t.textSecondary }}>Adv. K. Joshi applied for Pune Ward 21.</div>
                      </div>
                      <div className="p-2 rounded-lg" style={{ backgroundColor: t.surface }}>
                        <div className="font-semibold" style={{ color: t.textPrimary }}>WhatsApp Recharge Pending</div>
                        <div className="text-[11px] mt-0.5" style={{ color: t.textSecondary }}>Rameshwar Patil requested 1,00,000 balance recharge.</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg transition"
                  style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }}
                >
                  <div 
                    className="w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs text-white"
                    style={{ backgroundColor: t.primary }}
                  >
                    SA
                  </div>
                  <Icon name="chevronDown" size={12} color={t.textSecondary} />
                </button>

                {profileDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-52 rounded-xl py-1.5 shadow-xl z-50 text-xs"
                    style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}
                  >
                    <div className="px-3 py-2" style={{ borderBottom: `1px solid ${t.border}` }}>
                      <div className="font-bold" style={{ color: t.textPrimary }}>Super Admin Root</div>
                      <div className="text-[10px]" style={{ color: t.textMuted }}>admin@rajatantra.gov.in</div>
                    </div>
                    <button 
                      onClick={() => { navigateTo('profile'); setProfileDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 hover:bg-black/5 flex items-center gap-2"
                      style={{ color: t.textPrimary }}
                    >
                      <Icon name="user" size={14} /> My Profile
                    </button>
                    <button 
                      onClick={() => { navigateTo('settings'); setProfileDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 hover:bg-black/5 flex items-center gap-2"
                      style={{ color: t.textPrimary }}
                    >
                      <Icon name="settings" size={14} /> Platform Settings
                    </button>
                    <div style={{ borderTop: `1px solid ${t.border}` }} className="my-1" />
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 hover:bg-black/5 flex items-center gap-2"
                      style={{ color: t.error }}
                    >
                      <Icon name="logOut" size={14} /> Sign Out (Lock Session)
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Body Viewport Component Dispatcher */}
          <main className="p-4 sm:p-6 max-w-7xl w-full mx-auto flex-1">
            {activeNav === 'dashboard' && (
              <DashboardView 
                t={t} 
                candidates={candidates} 
                distributors={distributors} 
                enquiries={enquiries}
                navigateTo={navigateTo}
              />
            )}

            {activeNav === 'all-candidates' && (
              <AllCandidatesView 
                t={t} 
                candidates={candidates} 
                setCandidates={setCandidates}
                navigateTo={navigateTo}
                triggerToast={triggerToast}
              />
            )}

            {activeNav === 'add-candidate' && (
              <AddCandidateWizardView 
                t={t} 
                distributors={distributors}
                onCandidateCreated={(newCand) => {
                  setCandidates([newCand, ...candidates]);
                  setDeliveryModalCandidate(newCand);
                  triggerToast(`Candidate ${newCand.name} registered successfully!`);
                  navigateTo('candidate-control-panel', newCand.id);
                }}
                navigateTo={navigateTo}
              />
            )}

            {activeNav === 'candidate-requests' && (
              <CandidateRequestsView t={t} navigateTo={navigateTo} triggerToast={triggerToast} />
            )}

            {activeNav === 'enquiries' && (
              <EnquiriesView t={t} enquiries={enquiries} setEnquiries={setEnquiries} triggerToast={triggerToast} />
            )}

            {activeNav === 'candidate-control-panel' && (
              <CandidateControlPanelView 
                t={t} 
                candidate={selectedCandidate} 
                activeTab={candidatePanelTab}
                setActiveTab={setCandidatePanelTab}
                onUpdateCandidate={(updated) => {
                  setCandidates(candidates.map(c => c.id === updated.id ? updated : c));
                  triggerToast('Candidate record updated successfully.');
                }}
                triggerToast={triggerToast}
                navigateTo={navigateTo}
              />
            )}

            {activeNav === 'campaigns' && (
              <CampaignDashboardView t={t} candidates={candidates} navigateTo={navigateTo} />
            )}

            {activeNav === 'ai-dashboard' && (
              <AIDashboardView t={t} candidates={candidates} navigateTo={navigateTo} />
            )}

            {activeNav === 'all-distributors' && (
              <DistributorsView 
                t={t} 
                distributors={distributors} 
                setDistributors={setDistributors} 
                triggerToast={triggerToast} 
              />
            )}

            {activeNav === 'distributor-requests' && (
              <DistributorRequestsView t={t} triggerToast={triggerToast} />
            )}

            {activeNav === 'subscriptions' && (
              <SubscriptionPlansView t={t} triggerToast={triggerToast} />
            )}

            {activeNav === 'tutorials' && (
              <TutorialsView t={t} triggerToast={triggerToast} />
            )}

            {activeNav === 'audit' && (
              <PlatformAuditView t={t} audits={audits} />
            )}

            {activeNav === 'settings' && (
              <PlatformSettingsView t={t} triggerToast={triggerToast} />
            )}

            {activeNav === 'profile' && (
              <ProfileView t={t} triggerToast={triggerToast} />
            )}
          </main>
        </div>
      </div>

      {/* Candidate Credential Delivery Modal */}
      {deliveryModalCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div 
            className="w-full max-w-md rounded-xl p-6 shadow-2xl"
            style={{ backgroundColor: t.card, border: `1px solid ${t.border}`, color: t.textPrimary }}
          >
            <div className="flex items-center justify-between pb-3 mb-4" style={{ borderBottom: `1px solid ${t.border}` }}>
              <div className="flex items-center gap-2">
                <Icon name="key" size={20} color={t.primary} />
                <h3 className="font-bold text-base">Candidate Credential Delivery</h3>
              </div>
              <button onClick={() => setDeliveryModalCandidate(null)} className="p-1">
                <Icon name="x" size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs mb-6">
              <div className="p-3 rounded-lg" style={{ backgroundColor: t.surface }}>
                <div className="font-semibold text-sm mb-1">{deliveryModalCandidate.name}</div>
                <div style={{ color: t.textSecondary }}>ID: <strong>{deliveryModalCandidate.id}</strong></div>
                <div style={{ color: t.textSecondary }}>Username: <strong>{deliveryModalCandidate.username}</strong></div>
                <div style={{ color: t.textSecondary }}>Contact: {deliveryModalCandidate.phone}</div>
                <div style={{ color: t.textSecondary }}>Email: {deliveryModalCandidate.email}</div>
              </div>

              <div>
                <label className="block font-semibold mb-2" style={{ color: t.textPrimary }}>
                  Select Delivery Channel:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['whatsapp', 'email', 'both'].map((ch) => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => setDeliveryChannel(ch)}
                      className="py-2 px-3 rounded-lg capitalize font-medium text-center border"
                      style={{ 
                        backgroundColor: deliveryChannel === ch ? t.surface : t.card,
                        borderColor: deliveryChannel === ch ? t.primary : t.border,
                        color: deliveryChannel === ch ? t.primary : t.textSecondary
                      }}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg text-[11px] leading-relaxed" style={{ backgroundColor: t.warningBg, color: t.warning }}>
                <strong>Security Guard:</strong> Rajatantra never dispatches plaintext passwords. The recipient will receive a one-time activation link to set their administrative password securely.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={() => setDeliveryModalCandidate(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold"
                style={{ backgroundColor: t.surface, color: t.textSecondary }}
              >
                Skip / Later
              </button>
              <button 
                onClick={() => {
                  triggerToast(`Activation dispatched via ${deliveryChannel.toUpperCase()} to ${deliveryModalCandidate.phone}`);
                  setDeliveryModalCandidate(null);
                }}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5"
                style={{ backgroundColor: t.primary }}
              >
                <Icon name="send" size={14} /> Dispatch Activation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DashboardView({ t, candidates, distributors, enquiries, navigateTo }) {
  const totalCandidates = candidates.length;
  const activeCandidates = candidates.filter(c => c.status === 'Active').length;
  const inactiveCandidates = candidates.filter(c => c.status === 'Inactive').length;
  const demoCandidates = candidates.filter(c => c.accountType === 'Demo').length;
  const saleCandidates = candidates.filter(c => c.accountType === 'Sale').length;

  const totalDistributors = distributors.length;
  const activeDistributors = distributors.filter(d => d.status === 'Active').length;
  const pendingDistributorRequests = 2;
  const suspendedDistributors = distributors.filter(d => d.status === 'Suspended').length;

  const pendingEnquiries = enquiries.filter(e => e.status === 'Pending').length;
  const underReviewEnquiries = enquiries.filter(e => e.status === 'Under Review').length;
  const approvedEnquiries = enquiries.filter(e => e.status === 'Approved').length;

  return (
    <div className="space-y-6">
      {/* Page Title & Operational Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: t.textPrimary }}>Platform Command Dashboard</h1>
          <p className="text-xs mt-0.5" style={{ color: t.textSecondary }}>
            High-level telemetry across candidate deployments, distributor pipelines, and core engines.
          </p>
        </div>
        
        {/* Quick actions bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <button 
            onClick={() => navigateTo('add-candidate')}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5 transition"
            style={{ backgroundColor: t.primary }}
          >
            <Icon name="userPlus" size={15} /> Add Candidate
          </button>
          <button 
            onClick={() => navigateTo('candidate-requests')}
            className="px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
            style={{ backgroundColor: t.surface, color: t.textPrimary, border: `1px solid ${t.border}` }}
          >
            <Icon name="users" size={15} /> Review Requests (3)
          </button>
          <button 
            onClick={() => navigateTo('enquiries')}
            className="px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
            style={{ backgroundColor: t.surface, color: t.textPrimary, border: `1px solid ${t.border}` }}
          >
            <Icon name="messageSquare" size={15} /> Enquiries ({pendingEnquiries})
          </button>
        </div>
      </div>

      {/* KPI Section A: Candidate Statistics */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: t.textSecondary }}>
          Candidate Footprint
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <div 
            onClick={() => navigateTo('all-candidates')} 
            className="p-4 rounded-xl cursor-pointer transition hover:scale-[1.01]" 
            style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}
          >
            <div className="text-xs" style={{ color: t.textSecondary }}>Total Candidates</div>
            <div className="text-2xl font-bold mt-1" style={{ color: t.textPrimary }}>{totalCandidates}</div>
            <div className="text-[10px] mt-1 font-semibold" style={{ color: t.primary }}>All provisioned accounts</div>
          </div>

          <div 
            onClick={() => navigateTo('all-candidates')} 
            className="p-4 rounded-xl cursor-pointer transition hover:scale-[1.01]" 
            style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}
          >
            <div className="text-xs" style={{ color: t.textSecondary }}>Active Deployments</div>
            <div className="text-2xl font-bold mt-1" style={{ color: t.success }}>{activeCandidates}</div>
            <div className="text-[10px] mt-1" style={{ color: t.textMuted }}>Live in field</div>
          </div>

          <div 
            onClick={() => navigateTo('all-candidates')} 
            className="p-4 rounded-xl cursor-pointer transition hover:scale-[1.01]" 
            style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}
          >
            <div className="text-xs" style={{ color: t.textSecondary }}>Inactive Accounts</div>
            <div className="text-2xl font-bold mt-1" style={{ color: t.warning }}>{inactiveCandidates}</div>
            <div className="text-[10px] mt-1" style={{ color: t.textMuted }}>Dormant / concluded</div>
          </div>

          <div 
            onClick={() => navigateTo('all-candidates')} 
            className="p-4 rounded-xl cursor-pointer transition hover:scale-[1.01]" 
            style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}
          >
            <div className="text-xs" style={{ color: t.textSecondary }}>Demo Accounts</div>
            <div className="text-2xl font-bold mt-1" style={{ color: t.chart4 }}>{demoCandidates}</div>
            <div className="text-[10px] mt-1" style={{ color: t.textMuted }}>14-day evaluation</div>
          </div>

          <div 
            onClick={() => navigateTo('all-candidates')} 
            className="p-4 rounded-xl cursor-pointer transition hover:scale-[1.01]" 
            style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}
          >
            <div className="text-xs" style={{ color: t.textSecondary }}>Sale Accounts</div>
            <div className="text-2xl font-bold mt-1" style={{ color: t.chart5 }}>{saleCandidates}</div>
            <div className="text-[10px] mt-1" style={{ color: t.textMuted }}>Commercial licenses</div>
          </div>
        </div>
      </div>

      {/* KPI Section B & C & D: Distributors, Subscriptions, Enquiries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Distributor Overview Card */}
        <div className="p-4 rounded-xl" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: t.textSecondary }}>Distributors</span>
            <button onClick={() => navigateTo('all-distributors')} className="text-xs font-semibold" style={{ color: t.primary }}>View All</button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2.5 rounded-lg" style={{ backgroundColor: t.surface }}>
              <div className="text-lg font-bold" style={{ color: t.textPrimary }}>{totalDistributors}</div>
              <div className="text-[10px]" style={{ color: t.textSecondary }}>Total Channel Partners</div>
            </div>
            <div className="p-2.5 rounded-lg" style={{ backgroundColor: t.surface }}>
              <div className="text-lg font-bold" style={{ color: t.success }}>{activeDistributors}</div>
              <div className="text-[10px]" style={{ color: t.textSecondary }}>Active Network</div>
            </div>
            <div className="p-2.5 rounded-lg" style={{ backgroundColor: t.surface }}>
              <div className="text-lg font-bold" style={{ color: t.warning }}>{pendingDistributorRequests}</div>
              <div className="text-[10px]" style={{ color: t.textSecondary }}>Pending Approvals</div>
            </div>
            <div className="p-2.5 rounded-lg" style={{ backgroundColor: t.surface }}>
              <div className="text-lg font-bold" style={{ color: t.error }}>{suspendedDistributors}</div>
              <div className="text-[10px]" style={{ color: t.textSecondary }}>Suspended</div>
            </div>
          </div>
        </div>

        {/* Subscription Pulse Card */}
        <div className="p-4 rounded-xl" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: t.textSecondary }}>Subscriptions</span>
            <button onClick={() => navigateTo('subscriptions')} className="text-xs font-semibold" style={{ color: t.primary }}>Manage Plans</button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2.5 rounded-lg" style={{ backgroundColor: t.surface }}>
              <div className="text-lg font-bold" style={{ color: t.success }}>112</div>
              <div className="text-[10px]" style={{ color: t.textSecondary }}>Active Subscriptions</div>
            </div>
            <div className="p-2.5 rounded-lg" style={{ backgroundColor: t.surface }}>
              <div className="text-lg font-bold" style={{ color: t.warning }}>9</div>
              <div className="text-[10px]" style={{ color: t.textSecondary }}>Expiring in 7 Days</div>
            </div>
            <div className="p-2.5 rounded-lg" style={{ backgroundColor: t.surface }}>
              <div className="text-lg font-bold" style={{ color: t.primary }}>14</div>
              <div className="text-[10px]" style={{ color: t.textSecondary }}>Upgrade Requests</div>
            </div>
            <div className="p-2.5 rounded-lg" style={{ backgroundColor: t.surface }}>
              <div className="text-lg font-bold" style={{ color: t.textMuted }}>16</div>
              <div className="text-[10px]" style={{ color: t.textSecondary }}>Concluded / Expired</div>
            </div>
          </div>
        </div>

        {/* Enquiry Pipeline Card */}
        <div className="p-4 rounded-xl" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: t.textSecondary }}>Enquiries Pipeline</span>
            <button onClick={() => navigateTo('enquiries')} className="text-xs font-semibold" style={{ color: t.primary }}>Resolve</button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2.5 rounded-lg" style={{ backgroundColor: t.surface }}>
              <div className="text-lg font-bold" style={{ color: t.warning }}>{pendingEnquiries}</div>
              <div className="text-[10px]" style={{ color: t.textSecondary }}>Pending Review</div>
            </div>
            <div className="p-2.5 rounded-lg" style={{ backgroundColor: t.surface }}>
              <div className="text-lg font-bold" style={{ color: t.chart5 }}>{underReviewEnquiries}</div>
              <div className="text-[10px]" style={{ color: t.textSecondary }}>Under Processing</div>
            </div>
            <div className="p-2.5 rounded-lg" style={{ backgroundColor: t.surface }}>
              <div className="text-lg font-bold" style={{ color: t.success }}>{approvedEnquiries}</div>
              <div className="text-[10px]" style={{ color: t.textSecondary }}>Approved This Wk</div>
            </div>
            <div className="p-2.5 rounded-lg" style={{ backgroundColor: t.surface }}>
              <div className="text-lg font-bold" style={{ color: t.textPrimary }}>{enquiries.length}</div>
              <div className="text-[10px]" style={{ color: t.textSecondary }}>Total Logged</div>
            </div>
          </div>
        </div>
      </div>

      {/* Solid Charts Section (No Gradients) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Candidate Growth Over Time (Solid Vector SVG) */}
        <div className="p-5 rounded-xl" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm" style={{ color: t.textPrimary }}>Candidate Growth (2024 Cumulative)</h3>
              <p className="text-[11px]" style={{ color: t.textSecondary }}>Monthly verified onboardings</p>
            </div>
            <span className="text-xs px-2 py-0.5 rounded font-semibold" style={{ backgroundColor: t.surface, color: t.textSecondary }}>
              +38% Q1
            </span>
          </div>

          <div className="h-48 w-full flex items-end gap-3 pt-6 pb-2 px-2" style={{ borderBottom: `1px solid ${t.border}` }}>
            {[
              { m: 'Nov', val: 24, h: '25%' },
              { m: 'Dec', val: 45, h: '42%' },
              { m: 'Jan', val: 68, h: '60%' },
              { m: 'Feb', val: 92, h: '78%' },
              { m: 'Mar', val: 120, h: '92%' },
              { m: 'Apr', val: 142, h: '100%' },
            ].map((col, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[10px] font-bold" style={{ color: t.textSecondary }}>{col.val}</span>
                <div 
                  className="w-full rounded-t"
                  style={{ height: col.h, backgroundColor: t.chart1 }}
                />
                <span className="text-[10px]" style={{ color: t.textMuted }}>{col.m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Acquisition Source & Election Type Breakdown */}
        <div className="p-5 rounded-xl" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm" style={{ color: t.textPrimary }}>Acquisition & Election Segmentation</h3>
              <p className="text-[11px]" style={{ color: t.textSecondary }}>Distribution by election tier</p>
            </div>
          </div>

          <div className="space-y-3.5 pt-2">
            {[
              { name: 'Lok Sabha Constituencies', count: 48, pct: '34%', color: t.chart1 },
              { name: 'Vidhan Sabha Assemblies', count: 64, pct: '45%', color: t.chart2 },
              { name: 'Municipal Corporations (PMC/BMC)', count: 22, pct: '15%', color: t.chart3 },
              { name: 'Zilla Parishad & Gram Panchayat', count: 8, pct: '6%', color: t.chart4 },
            ].map((row, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium" style={{ color: t.textPrimary }}>{row.name}</span>
                  <span className="font-bold" style={{ color: t.textSecondary }}>{row.count} ({row.pct})</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: t.surface }}>
                  <div style={{ width: row.pct, backgroundColor: row.color, height: '100%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Work & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Work Priority Box */}
        <div className="p-5 rounded-xl" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm" style={{ color: t.textPrimary }}>Administrative Queues Pending</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: t.warningBg, color: t.warning }}>
              Requires Action
            </span>
          </div>

          <div className="space-y-2.5">
            <div 
              onClick={() => navigateTo('candidate-requests')}
              className="p-3 rounded-lg flex items-center justify-between cursor-pointer hover:bg-black/5 transition"
              style={{ backgroundColor: t.surface }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md" style={{ backgroundColor: t.primary, color: '#fff' }}>
                  <Icon name="userCheck" size={16} />
                </div>
                <div>
                  <div className="text-xs font-semibold" style={{ color: t.textPrimary }}>3 New Candidate Registration Requests</div>
                  <div className="text-[11px]" style={{ color: t.textSecondary }}>Pending administrative verification and geography approval</div>
                </div>
              </div>
              <Icon name="arrowRight" size={14} color={t.textSecondary} />
            </div>

            <div 
              onClick={() => navigateTo('enquiries')}
              className="p-3 rounded-lg flex items-center justify-between cursor-pointer hover:bg-black/5 transition"
              style={{ backgroundColor: t.surface }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md" style={{ backgroundColor: t.warning, color: '#fff' }}>
                  <Icon name="messageSquare" size={16} />
                </div>
                <div>
                  <div className="text-xs font-semibold" style={{ color: t.textPrimary }}>{pendingEnquiries} Pending Candidate Service Enquiries</div>
                  <div className="text-[11px]" style={{ color: t.textSecondary }}>WhatsApp balance & AI model license requests</div>
                </div>
              </div>
              <Icon name="arrowRight" size={14} color={t.textSecondary} />
            </div>

            <div 
              onClick={() => navigateTo('distributor-requests')}
              className="p-3 rounded-lg flex items-center justify-between cursor-pointer hover:bg-black/5 transition"
              style={{ backgroundColor: t.surface }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md" style={{ backgroundColor: t.chart4, color: '#fff' }}>
                  <Icon name="briefcase" size={16} />
                </div>
                <div>
                  <div className="text-xs font-semibold" style={{ color: t.textPrimary }}>2 Distributor Partnership Applications</div>
                  <div className="text-[11px]" style={{ color: t.textSecondary }}>Regional agency partner applications awaiting vetting</div>
                </div>
              </div>
              <Icon name="arrowRight" size={14} color={t.textSecondary} />
            </div>
          </div>
        </div>

        {/* Live Operational Audit Feed */}
        <div className="p-5 rounded-xl" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm" style={{ color: t.textPrimary }}>Platform Audit Trail (Recent)</h3>
            <button onClick={() => navigateTo('audit')} className="text-xs font-semibold" style={{ color: t.primary }}>Full Logs</button>
          </div>

          <div className="space-y-3">
            {[
              { text: 'Devendra Deshmukh granted AI Intelligence Seat', time: '12m ago', user: 'admin@rajatantra' },
              { text: 'Rameshwar Patil WhatsApp recharge Approved (Quota: 1,00,000 msgs)', time: '1h ago', user: 'admin@rajatantra' },
              { text: 'Marathwada Election Dynamics suspended by security policy', time: '3h ago', user: 'sec-ops' },
              { text: 'Sunita Jadhav demo account created (PMC Ward 14)', time: '1d ago', user: 'admin@rajatantra' },
            ].map((feed, idx) => (
              <div key={idx} className="flex items-start gap-3 pb-2.5" style={{ borderBottom: `1px solid ${t.border}` }}>
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: t.primary }} />
                <div className="flex-1 text-xs">
                  <div className="font-medium" style={{ color: t.textPrimary }}>{feed.text}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: t.textMuted }}>{feed.time} • Actor: {feed.user}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AllCandidatesView({ t, candidates, setCandidates, navigateTo, triggerToast }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedElectionFilter, setSelectedElectionFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [selectedAccountTypeFilter, setSelectedAccountTypeFilter] = useState('ALL');
  const [activeActionMenuId, setActiveActionMenuId] = useState(null);

  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      const matchesSearch = 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.party.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.geography.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesElection = selectedElectionFilter === 'ALL' || c.electionType === selectedElectionFilter;
      const matchesStatus = selectedStatusFilter === 'ALL' || c.status === selectedStatusFilter;
      const matchesAccount = selectedAccountTypeFilter === 'ALL' || c.accountType === selectedAccountTypeFilter;

      return matchesSearch && matchesElection && matchesStatus && matchesAccount;
    });
  }, [candidates, searchTerm, selectedElectionFilter, selectedStatusFilter, selectedAccountTypeFilter]);

  const toggleCandidateStatus = (candId) => {
    setCandidates(candidates.map(c => {
      if (c.id === candId) {
        const nextStatus = c.status === 'Active' ? 'Inactive' : 'Active';
        triggerToast(`Candidate ${c.name} is now ${nextStatus}.`);
        return { ...c, status: nextStatus };
      }
      return c;
    }));
    setActiveActionMenuId(null);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: t.textPrimary }}>All Candidates</h1>
          <p className="text-xs mt-0.5" style={{ color: t.textSecondary }}>
            Candidate entities managed by the Super Admin. (Administrative control layer only).
          </p>
        </div>

        <button 
          onClick={() => navigateTo('add-candidate')}
          className="px-4 py-2 rounded-lg text-xs font-semibold text-white flex items-center gap-2 self-start sm:self-auto"
          style={{ backgroundColor: t.primary }}
        >
          <Icon name="userPlus" size={15} /> Add Candidate Wizard
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-xl space-y-3" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, ID, party, area..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg outline-none"
              style={{ backgroundColor: t.surface, border: `1px solid ${t.border}`, color: t.textPrimary }}
            />
            <div className="absolute left-3 top-2.5" style={{ color: t.textMuted }}>
              <Icon name="search" size={14} />
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <select
              value={selectedElectionFilter}
              onChange={(e) => setSelectedElectionFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg outline-none"
              style={{ backgroundColor: t.surface, border: `1px solid ${t.border}`, color: t.textPrimary }}
            >
              <option value="ALL">All Election Types</option>
              <option value="Lok Sabha">Lok Sabha</option>
              <option value="Vidhan Sabha">Vidhan Sabha</option>
              <option value="Municipal Corporation">Municipal Corporation</option>
              <option value="Zilla Parishad">Zilla Parishad</option>
            </select>

            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg outline-none"
              style={{ backgroundColor: t.surface, border: `1px solid ${t.border}`, color: t.textPrimary }}
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <select
              value={selectedAccountTypeFilter}
              onChange={(e) => setSelectedAccountTypeFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg outline-none"
              style={{ backgroundColor: t.surface, border: `1px solid ${t.border}`, color: t.textPrimary }}
            >
              <option value="ALL">All Types</option>
              <option value="Sale">Sale (Commercial)</option>
              <option value="Demo">Demo (Trial)</option>
            </select>

            {(searchTerm || selectedElectionFilter !== 'ALL' || selectedStatusFilter !== 'ALL' || selectedAccountTypeFilter !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedElectionFilter('ALL');
                  setSelectedStatusFilter('ALL');
                  setSelectedAccountTypeFilter('ALL');
                }}
                className="text-xs px-2.5 py-2 rounded-lg font-semibold whitespace-nowrap"
                style={{ backgroundColor: t.surface, color: t.textSecondary }}
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Removable Filter Chips */}
        <div className="flex items-center gap-2 flex-wrap text-[11px]">
          <span style={{ color: t.textMuted }}>Showing {filteredCandidates.length} of {candidates.length} candidates</span>
          {selectedElectionFilter !== 'ALL' && (
            <span className="px-2 py-0.5 rounded flex items-center gap-1 font-medium" style={{ backgroundColor: t.surface, color: t.textPrimary }}>
              Election: {selectedElectionFilter}
              <button onClick={() => setSelectedElectionFilter('ALL')} className="hover:opacity-75">×</button>
            </span>
          )}
          {selectedStatusFilter !== 'ALL' && (
            <span className="px-2 py-0.5 rounded flex items-center gap-1 font-medium" style={{ backgroundColor: t.surface, color: t.textPrimary }}>
              Status: {selectedStatusFilter}
              <button onClick={() => setSelectedStatusFilter('ALL')} className="hover:opacity-75">×</button>
            </span>
          )}
        </div>
      </div>

      {/* Main Candidate Listing Table */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr style={{ backgroundColor: t.surface, borderBottom: `1px solid ${t.border}`, color: t.textSecondary }}>
                <th className="py-3 px-4 font-semibold">Candidate & ID</th>
                <th className="py-3 px-4 font-semibold">Party</th>
                <th className="py-3 px-4 font-semibold">Election & Segment</th>
                <th className="py-3 px-4 font-semibold">Type</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Users Used / Limit</th>
                <th className="py-3 px-4 font-semibold">AI Access</th>
                <th className="py-3 px-4 font-semibold">Distributor</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: t.border }}>
              {filteredCandidates.map((cand) => (
                <tr 
                  key={cand.id} 
                  className="hover:bg-black/[0.02] transition"
                  style={{ color: t.textPrimary }}
                >
                  <td className="py-3.5 px-4">
                    <div 
                      onClick={() => navigateTo('candidate-control-panel', cand.id)} 
                      className="font-bold cursor-pointer hover:underline text-sm"
                      style={{ color: t.primary }}
                    >
                      {cand.name}
                    </div>
                    <div className="text-[11px] font-mono" style={{ color: t.textMuted }}>{cand.id} • {cand.marathiName}</div>
                  </td>

                  <td className="py-3.5 px-4 font-medium">
                    <div>{cand.party}</div>
                    <div className="text-[10px]" style={{ color: t.textMuted }}>Symbol: {cand.symbol}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold">{cand.electionType}</div>
                    <div className="text-[11px]" style={{ color: t.textSecondary }}>{cand.geography}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span 
                      className="px-2 py-0.5 rounded text-[10px] font-bold"
                      style={{ 
                        backgroundColor: cand.accountType === 'Sale' ? t.successBg : t.warningBg,
                        color: cand.accountType === 'Sale' ? t.success : t.warning
                      }}
                    >
                      {cand.accountType}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span 
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold"
                      style={{ 
                        backgroundColor: cand.status === 'Active' ? t.successBg : t.surface,
                        color: cand.status === 'Active' ? t.success : t.textMuted
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cand.status === 'Active' ? t.success : t.textMuted }} />
                      {cand.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold">{cand.usersUsed} / {cand.usersAllowed}</div>
                    <div className="w-20 h-1.5 rounded-full bg-gray-200 mt-1 overflow-hidden" style={{ backgroundColor: t.surface }}>
                      <div 
                        style={{ 
                          width: `${(cand.usersUsed / cand.usersAllowed) * 100}%`,
                          backgroundColor: (cand.usersUsed / cand.usersAllowed) > 0.8 ? t.warning : t.primary,
                          height: '100%'
                        }} 
                      />
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span 
                      className="px-2 py-0.5 rounded text-[10px] font-semibold"
                      style={{ 
                        backgroundColor: cand.aiAccess ? t.primary : t.surface,
                        color: cand.aiAccess ? '#FFFFFF' : t.textMuted
                      }}
                    >
                      {cand.aiAccess ? 'Enabled' : 'Disabled'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-[11px]">
                    <div className="font-medium truncate max-w-[140px]" title={cand.currentDistributor}>
                      {cand.currentDistributor}
                    </div>
                    <div className="text-[10px]" style={{ color: t.textMuted }}>Src: {cand.acquisitionSource}</div>
                  </td>

                  <td className="py-3.5 px-4 text-right relative">
                    <button 
                      onClick={() => setActiveActionMenuId(activeActionMenuId === cand.id ? null : cand.id)}
                      className="p-1.5 rounded-md hover:bg-black/5"
                      style={{ color: t.textSecondary }}
                    >
                      <Icon name="moreVertical" size={16} />
                    </button>

                    {activeActionMenuId === cand.id && (
                      <div 
                        className="absolute right-4 mt-1 w-44 rounded-xl py-1 shadow-2xl z-40 text-left text-xs"
                        style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}
                      >
                        <button 
                          onClick={() => {
                            navigateTo('candidate-control-panel', cand.id);
                            setActiveActionMenuId(null);
                          }}
                          className="w-full px-3 py-2 hover:bg-black/5 font-medium flex items-center gap-2"
                          style={{ color: t.primary }}
                        >
                          <Icon name="layoutDashboard" size={14} /> Open Control Panel
                        </button>
                        <button 
                          onClick={() => toggleCandidateStatus(cand.id)}
                          className="w-full px-3 py-2 hover:bg-black/5 flex items-center gap-2"
                          style={{ color: t.textPrimary }}
                        >
                          <Icon name="refreshCw" size={14} /> {cand.status === 'Active' ? 'Deactivate Account' : 'Activate Account'}
                        </button>
                        <button 
                          onClick={() => {
                            navigateTo('enquiries');
                            setActiveActionMenuId(null);
                          }}
                          className="w-full px-3 py-2 hover:bg-black/5 flex items-center gap-2"
                          style={{ color: t.textPrimary }}
                        >
                          <Icon name="messageSquare" size={14} /> View Enquiries
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state handler */}
        {filteredCandidates.length === 0 && (
          <div className="p-8 text-center" style={{ color: t.textSecondary }}>
            <Icon name="search" size={28} className="mx-auto mb-2 opacity-50" />
            <div className="font-semibold text-sm">No candidate accounts found</div>
            <p className="text-xs mt-1">Try refining your search keyword or clearing active filters.</p>
          </div>
        )}

        {/* Pagination summary */}
        <div 
          className="p-3 px-4 flex items-center justify-between text-xs"
          style={{ borderTop: `1px solid ${t.border}`, backgroundColor: t.surface, color: t.textSecondary }}
        >
          <div>Showing 1 to {filteredCandidates.length} of {candidates.length} records</div>
          <div className="flex items-center gap-1 font-semibold">
            <button className="px-2 py-1 rounded" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>Prev</button>
            <span className="px-2 py-1 rounded text-white" style={{ backgroundColor: t.primary }}>1</span>
            <button className="px-2 py-1 rounded" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddCandidateWizardView({ t, distributors, onCandidateCreated, navigateTo }) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 11;

  // Wizard State
  const [formData, setFormData] = useState({
    // Step 1: Account
    username: '',
    email: '',
    phone: '',
    passwordOption: 'secure_link',
    accountType: 'Sale',
    accountStatus: 'Active',
    // Step 2: Candidate
    nameEnglish: '',
    nameMarathi: '',
    candidateType: 'Single Contestant',
    // Step 3: Party
    partyEnglish: 'Bharatiya Janata Party',
    partyMarathi: 'भारतीय जनता पक्ष',
    partyLogo: 'bjp_symbol.png',
    votingSymbol: 'Lotus',
    // Step 4: Election Details
    electionType: 'Vidhan Sabha',
    electionName: 'Maharashtra Assembly Election 2024',
    electionYear: '2024',
    electionDate: '2024-11-20',
    electionProject: 'Assembly Sweep 2024',
    subPart: 'Constituency Central',
    area: 'Pune Urban',
    // Step 5: Geography
    state: 'Maharashtra',
    district: 'Pune',
    parliamentaryConstituency: 'Pune',
    assemblyConstituency: 'Kothrud (AC-210)',
    ward: 'Ward 12',
    panchayat: '',
    boothCount: '342',
    // Step 6: Application details
    appName: '',
    whatsappNumber: '',
    facebookUrl: '',
    instagramUrl: '',
    slipUrl: '',
    supportNumber: '',
    // Step 7: Assets
    selectedTheme: 'Navy Blue (Solid)',
    splashAssetUploaded: true,
    appIconUploaded: true,
    printerSplashUploaded: false,
    // Step 8: Additional Access
    pdfAccess: true,
    excelAccess: true,
    imageAccess: true,
    apkBuildAccess: false,
    // Step 9: Acquisition
    acquisitionSource: 'Distributor',
    distributorId: 'DIS-101'
  });

  const stepsList = [
    'Account Details',
    'Candidate Details',
    'Party Details',
    'Election Details',
    'Election Geography',
    'Application Details',
    'Branding Assets',
    'Additional Access',
    'Acquisition Source',
    'Review Summary',
    'Create Account'
  ];

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleFinalSubmit = () => {
    const generatedId = `CAN-${Math.floor(8100 + Math.random() * 900)}`;
    const newCand = {
      id: generatedId,
      name: formData.nameEnglish || 'New Candidate',
      marathiName: formData.nameMarathi || 'नवीन उमेदवार',
      username: formData.username || `cand_${Date.now()}`,
      email: formData.email || 'candidate@rajatantra.in',
      phone: formData.phone || '+91 98000 00000',
      party: formData.partyEnglish,
      partyMarathi: formData.partyMarathi,
      partyLogo: formData.partyLogo,
      symbol: formData.votingSymbol,
      electionType: formData.electionType,
      electionName: formData.electionName,
      electionYear: formData.electionYear,
      geography: formData.assemblyConstituency || formData.parliamentaryConstituency || 'Central Hub',
      accountType: formData.accountType,
      status: formData.accountStatus,
      subscriptionStatus: 'Active',
      planName: `${formData.electionType} Pro`,
      usersUsed: 1,
      usersAllowed: 50,
      aiAccess: false,
      campaignStatus: 'Active',
      acquisitionSource: formData.acquisitionSource,
      acquisitionDistributor: formData.acquisitionSource === 'Distributor' ? 'MahaMedia Political Solutions' : 'Direct Web Portal',
      currentDistributor: formData.acquisitionSource === 'Distributor' ? 'MahaMedia Political Solutions' : 'Direct Web Portal',
      pendingEnquiries: 0,
      appName: formData.appName || 'Candidate Connect',
      slipUrl: formData.slipUrl || 'https://slips.rajatantra.in',
      pdfAccess: formData.pdfAccess,
      excelAccess: formData.excelAccess,
      imageAccess: formData.imageAccess,
      apkAccess: formData.apkBuildAccess,
      createdAt: '2024-04-12',
      expiresAt: '2024-12-31'
    };
    onCandidateCreated(newCand);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: t.textPrimary }}>Add Candidate Wizard</h1>
          <p className="text-xs mt-0.5" style={{ color: t.textSecondary }}>
            Complete all 11 provisioning steps to authorize a managed candidate entity.
          </p>
        </div>
        <button 
          onClick={() => navigateTo('all-candidates')} 
          className="text-xs font-semibold px-3 py-1.5 rounded-lg"
          style={{ backgroundColor: t.surface, color: t.textSecondary }}
        >
          Cancel Wizard
        </button>
      </div>

      {/* Stepper Progress Bar */}
      <div className="p-4 rounded-xl overflow-x-auto" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
        <div className="flex items-center justify-between min-w-[700px]">
          {stepsList.map((stepName, index) => {
            const stepNum = index + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;

            return (
              <div key={index} className="flex flex-col items-center flex-1 relative">
                <div 
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all z-10 ${
                    isCurrent ? 'ring-2 ring-offset-2' : ''
                  }`}
                  style={{ 
                    backgroundColor: isCompleted ? t.success : isCurrent ? t.primary : t.surface,
                    color: isCompleted || isCurrent ? '#FFFFFF' : t.textMuted
                  }}
                >
                  {isCompleted ? <Icon name="check" size={14} /> : stepNum}
                </div>
                <span className="text-[10px] mt-1 text-center font-medium truncate max-w-[70px]" style={{ color: isCurrent ? t.textPrimary : t.textMuted }}>
                  {stepName}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wizard Step Body Form Container */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
        {/* STEP 1: Account Details */}
        {currentStep === 1 && (
          <div className="space-y-4 max-w-xl">
            <h2 className="text-base font-bold" style={{ color: t.textPrimary }}>Step 1: Account Setup & Classification</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: t.textSecondary }}>Administrative Username *</label>
                <input 
                  type="text" 
                  value={formData.username}
                  onChange={(e) => updateField('username', e.target.value)}
                  placeholder="e.g. patil_kothrud_admin"
                  className="w-full px-3 py-2 text-xs rounded-lg outline-none"
                  style={{ backgroundColor: t.surface, border: `1px solid ${t.border}`, color: t.textPrimary }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: t.textSecondary }}>Official Email Address *</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="admin@patiloffice.com"
                  className="w-full px-3 py-2 text-xs rounded-lg outline-none"
                  style={{ backgroundColor: t.surface, border: `1px solid ${t.border}`, color: t.textPrimary }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: t.textSecondary }}>Primary Contact Number *</label>
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="+91 98220 XXXXX"
                  className="w-full px-3 py-2 text-xs rounded-lg outline-none"
                  style={{ backgroundColor: t.surface, border: `1px solid ${t.border}`, color: t.textPrimary }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: t.textSecondary }}>Account Classification</label>
                <select 
                  value={formData.accountType}
                  onChange={(e) => updateField('accountType', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg outline-none"
                  style={{ backgroundColor: t.surface, border: `1px solid ${t.border}`, color: t.textPrimary }}
                >
                  <option value="Sale">Sale (Commercial Deployment)</option>
                  <option value="Demo">Demo (14-Day Pilot)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: t.textSecondary }}>Account Security Option</label>
              <div className="p-3 rounded-lg text-xs" style={{ backgroundColor: t.surface }}>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    checked={formData.passwordOption === 'secure_link'} 
                    onChange={() => updateField('passwordOption', 'secure_link')} 
                  />
                  <span>Dispatch Secure Activation Link via WhatsApp/Email (Recommended)</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Candidate Details */}
        {currentStep === 2 && (
          <div className="space-y-4 max-w-xl">
            <h2 className="text-base font-bold" style={{ color: t.textPrimary }}>Step 2: Candidate Identity</h2>
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: t.textSecondary }}>Candidate Full Name (English) *</label>
              <input 
                type="text" 
                value={formData.nameEnglish}
                onChange={(e) => updateField('nameEnglish', e.target.value)}
                placeholder="e.g. Rameshwar Anand Patil"
                className="w-full px-3 py-2 text-xs rounded-lg outline-none"
                style={{ backgroundColor: t.surface, border: `1px solid ${t.border}`, color: t.textPrimary }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: t.textSecondary }}>Candidate Full Name (Marathi - देवनागरी) *</label>
              <input 
                type="text" 
                value={formData.nameMarathi}
                onChange={(e) => updateField('nameMarathi', e.target.value)}
                placeholder="उदा. रामेश्वर आनंद पाटील"
                className="w-full px-3 py-2 text-xs rounded-lg outline-none"
                style={{ backgroundColor: t.surface, border: `1px solid ${t.border}`, color: t.textPrimary }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: t.textSecondary }}>Candidate Contestant Type</label>
              <select 
                value={formData.candidateType}
                onChange={(e) => updateField('candidateType', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg outline-none"
                style={{ backgroundColor: t.surface, border: `1px solid ${t.border}`, color: t.textPrimary }}
              >
                <option value="Single Contestant">Single Contestant (Official Nominee)</option>
                <option value="Independent">Independent (अपक्ष)</option>
                <option value="Panel / Alliance">Panel / Coalition Candidate</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 3: Party Details */}
        {currentStep === 3 && (
          <div className="space-y-4 max-w-xl">
            <h2 className="text-base font-bold" style={{ color: t.textPrimary }}>Step 3: Political Party & Symbol Assets</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: t.textSecondary }}>Party Name (English)</label>
                <input 
                  type="text" 
                  value={formData.partyEnglish}
                  onChange={(e) => updateField('partyEnglish', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg outline-none"
                  style={{ backgroundColor: t.surface, border: `1px solid ${t.border}`, color: t.textPrimary }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: t.textSecondary }}>Party Name (Marathi)</label>
                <input 
                  type="text" 
                  value={formData.partyMarathi}
                  onChange={(e) => updateField('partyMarathi', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg outline-none"
                  style={{ backgroundColor: t.surface, border: `1px solid ${t.border}`, color: t.textPrimary }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: t.textSecondary }}>Official Voting Symbol</label>
                <input 
                  type="text" 
                  value={formData.votingSymbol}
                  onChange={(e) => updateField('votingSymbol', e.target.value)}
                  placeholder="e.g. Lotus / Clock / Bow"
                  className="w-full px-3 py-2 text-xs rounded-lg outline-none"
                  style={{ backgroundColor: t.surface, border: `1px solid ${t.border}`, color: t.textPrimary }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: t.textSecondary }}>Party Logo Asset</label>
                <div className="p-2 rounded-lg text-xs flex items-center justify-between" style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }}>
                  <span>Symbol_Preset.svg</span>
                  <span className="font-semibold text-[10px]" style={{ color: t.primary }}>Verified</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Election Details */}
        {currentStep === 4 && (
          <div className="space-y-4 max-w-xl">
            <h2 className="text-base font-bold" style={{ color: t.textPrimary }}>Step 4: Election Project Metadata</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: t.textSecondary }}>Election Category *</label>
                <select 
                  value={formData.electionType}
                  onChange={(e) => updateField('electionType', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg outline-none"
                  style={{ backgroundColor: t.surface, border: `1px solid ${t.border}`, color: t.textPrimary }}
                >
                  <option value="Lok Sabha">Lok Sabha (Parliamentary)</option>
                  <option value="Vidhan Sabha">Vidhan Sabha (Assembly)</option>
                  <option value="Municipal Corporation">Municipal Corporation</option>
                  <option value="Zilla Parishad">Zilla Parishad</option>
                  <option value="Gram Panchayat">Gram Panchayat</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: t.textSecondary }}>Election Year</label>
                <input 
                  type="text" 
                  value={formData.electionYear}
                  onChange={(e) => updateField('electionYear', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg outline-none"
                  style={{ backgroundColor: t.surface, border: `1px solid ${t.border}`, color: t.textPrimary }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: t.textSecondary }}>Project Identifier / Code</label>
              <input 
                type="text" 
                value={formData.electionProject}
                onChange={(e) => updateField('electionProject', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg outline-none"
                style={{ backgroundColor: t.surface, border: `1px solid ${t.border}`, color: t.textPrimary }}
              />
            </div>
          </div>
        )}

        {/* STEP 5: Dynamic Election Geography Hierarchy */}
        {currentStep === 5 && (
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold" style={{ color: t.textPrimary }}>Step 5: Dynamic Geography Hierarchy</h2>
              <span className="text-xs px-2 py-0.5 rounded font-bold" style={{ backgroundColor: t.primary, color: '#fff' }}>
                {formData.electionType} Mode
              </span>
            </div>

            <p className="text-xs" style={{ color: t.textSecondary }}>
              Loading tailored administrative fields for <strong>{formData.electionType}</strong>:
            </p>

            {formData.electionType === 'Lok Sabha' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: t.textSecondary }}>State & Parliamentary Constituency (PC)</label>
                  <input 
                    type="text" 
                    value={formData.parliamentaryConstituency}
                    onChange={(e) => updateField('parliamentaryConstituency', e.target.value)}
                    placeholder="e.g. Baramati (PC-35)"
                    className="w-full px-3 py-2 text-xs rounded-lg outline-none"
                    style={{ backgroundColor: t.surface, border: `1px solid ${t.border}`, color: t.textPrimary }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: t.textSecondary }}>Included Assembly Segments (ACs)</label>
                  <input 
                    type="text" 
                    placeholder="Daund, Indapur, Baramati, Purandar, Bhor, Khadakwasla"
                    className="w-full px-3 py-2 text-xs rounded-lg outline-none"
                    style={{ backgroundColor: t.surface, border: `1px solid ${t.border}`, color: t.textPrimary }}
                  />
                </div>
              </div>
            )}

            {formData.electionType === 'Vidhan Sabha' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: t.textSecondary }}>District</label>
                    <input 
                      type="text" 
                      value={formData.district}
                      onChange={(e) => updateField('district', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg outline-none"
                      style={{ backgroundColor: t.surface, border: `1px solid ${t.border}`, color: t.textPrimary }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: t.textSecondary }}>Assembly Constituency (AC)</label>
                    <input 
                      type="text" 
                      value={formData.assemblyConstituency}
                      onChange={(e) => updateField('assemblyConstituency', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg outline-none"
                      style={{ backgroundColor: t.surface, border: `1px solid ${t.border}`, color: t.textPrimary }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: t.textSecondary }}>Booth Count (Authorized)</label>
                  <input 
                    type="number" 
                    value={formData.boothCount}
                    onChange={(e) => updateField('boothCount', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg outline-none"
                    style={{ backgroundColor: t.surface, border: `1px solid ${t.border}`, color: t.textPrimary }}
                  />
                </div>
              </div>
            )}

            {formData.electionType === 'Municipal Corporation' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: t.textSecondary }}>Municipal Corporation (City)</label>
                    <input 
                      type="text" 
                      placeholder="Pune Municipal Corporation (PMC)"
                      className="w-full px-3 py-2 text-xs rounded-lg outline-none"
                      style={{ backgroundColor: t.surface, border: `1px solid ${t.border}`, color: t.textPrimary }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: t.textSecondary }}>Prabhag / Ward Number</label>
                    <input 
                      type="text" 
                      value={formData.ward}
                      onChange={(e) => updateField('ward', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg outline-none"
                      style={{ backgroundColor: t.surface, border: `1px solid ${t.border}`, color: t.textPrimary }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 6: Application Details */}
        {currentStep === 6 && (
          <div className="space-y-4 max-w-xl">
            <h2 className="text-base font-bold" style={{ color: t.textPrimary }}>Step 6: White-label Application Setup</h2>
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: t.textSecondary }}>Branded Application Title</label>
              <input 
                type="text" 
                value={formData.appName}
                onChange={(e) => updateField('appName', e.target.value)}
                placeholder="e.g. Rameshwar Patil Connect"
                className="w-full px-3 py-2 text-xs rounded-lg outline-none"
                style={{ backgroundColor: t.surface, border: `1px solid ${t.border}`, color: t.textPrimary }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: t.textSecondary }}>Official WhatsApp Campaign No</label>
                <input 
                  type="text" 
                  value={formData.whatsappNumber}
                  onChange={(e) => updateField('whatsappNumber', e.target.value)}
                  placeholder="+91 98220 00000"
                  className="w-full px-3 py-2 text-xs rounded-lg outline-none"
                  style={{ backgroundColor: t.surface, border: `1px solid ${t.border}`, color: t.textPrimary }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: t.textSecondary }}>Voter Slip Public Endpoint</label>
                <input 
                  type="text" 
                  value={formData.slipUrl}
                  onChange={(e) => updateField('slipUrl', e.target.value)}
                  placeholder="https://slips.rajatantra.in/ac210"
                  className="w-full px-3 py-2 text-xs rounded-lg outline-none"
                  style={{ backgroundColor: t.surface, border: `1px solid ${t.border}`, color: t.textPrimary }}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: Branding and Assets */}
        {currentStep === 7 && (
          <div className="space-y-4 max-w-xl">
            <h2 className="text-base font-bold" style={{ color: t.textPrimary }}>Step 7: Branding Assets (Solid Color Previews)</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }}>
                <div className="text-xs font-semibold mb-2" style={{ color: t.textPrimary }}>Mobile Splash Screen</div>
                <div className="h-24 rounded bg-blue-900 flex items-center justify-center text-white text-xs font-bold">
                  Preview: Solid Dark Slate
                </div>
                <div className="text-[10px] mt-2 font-medium" style={{ color: t.success }}>✓ Splash Asset Ready</div>
              </div>

              <div className="p-3 rounded-lg" style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }}>
                <div className="text-xs font-semibold mb-2" style={{ color: t.textPrimary }}>App Launcher Icon</div>
                <div className="w-16 h-16 rounded-xl bg-orange-600 flex items-center justify-center text-white text-lg font-bold mx-auto">
                  RP
                </div>
                <div className="text-[10px] mt-2 text-center font-medium" style={{ color: t.success }}>✓ Icon Scaled 512x512</div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 8: Additional Access */}
        {currentStep === 8 && (
          <div className="space-y-4 max-w-xl">
            <h2 className="text-base font-bold" style={{ color: t.textPrimary }}>Step 8: Administrative Access Permissions</h2>
            <p className="text-xs" style={{ color: t.textSecondary }}>Authorize specific platform modules for this candidate's team:</p>
            
            <div className="space-y-2.5">
              {[
                { key: 'pdfAccess', label: 'Voter List PDF Export Access', desc: 'Allows team to generate voter slips and booth reports in PDF format.' },
                { key: 'excelAccess', label: 'Voter List Excel/CSV Extraction', desc: 'Authorizes spreadsheet exports for campaign analytical workflows.' },
                { key: 'imageAccess', label: 'Voter Slip Photo Generation', desc: 'Enables generation of graphic voter slips for WhatsApp distribution.' },
                { key: 'apkBuildAccess', label: 'Standalone White-label APK Compilation', desc: 'Compiles custom branded Android APK file.' },
              ].map((perm) => (
                <div key={perm.key} className="p-3 rounded-lg flex items-center justify-between" style={{ backgroundColor: t.surface }}>
                  <div>
                    <div className="text-xs font-bold" style={{ color: t.textPrimary }}>{perm.label}</div>
                    <div className="text-[11px]" style={{ color: t.textSecondary }}>{perm.desc}</div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={formData[perm.key]}
                    onChange={(e) => updateField(perm.key, e.target.checked)}
                    className="w-4 h-4 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 9: Acquisition Source */}
        {currentStep === 9 && (
          <div className="space-y-4 max-w-xl">
            <h2 className="text-base font-bold" style={{ color: t.textPrimary }}>Step 9: Acquisition Channel Attribution</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: t.textSecondary }}>Acquisition Origin</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input 
                      type="radio" 
                      name="acq" 
                      checked={formData.acquisitionSource === 'Distributor'} 
                      onChange={() => updateField('acquisitionSource', 'Distributor')}
                    />
                    <span>Distributor Channel Partner</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input 
                      type="radio" 
                      name="acq" 
                      checked={formData.acquisitionSource === 'Direct'} 
                      onChange={() => updateField('acquisitionSource', 'Direct')}
                    />
                    <span>Direct Site / Organic Super Admin Provision</span>
                  </label>
                </div>
              </div>

              {formData.acquisitionSource === 'Distributor' && (
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: t.textSecondary }}>Attributed Distributor</label>
                  <select 
                    value={formData.distributorId}
                    onChange={(e) => updateField('distributorId', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg outline-none"
                    style={{ backgroundColor: t.surface, border: `1px solid ${t.border}`, color: t.textPrimary }}
                  >
                    {distributors.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.id}) - {d.city}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 10: Review Summary */}
        {currentStep === 10 && (
          <div className="space-y-4 max-w-xl">
            <h2 className="text-base font-bold" style={{ color: t.textPrimary }}>Step 10: Final Review & Validation</h2>
            <div className="p-4 rounded-xl space-y-2.5 text-xs" style={{ backgroundColor: t.surface }}>
              <div className="flex justify-between">
                <span style={{ color: t.textSecondary }}>Candidate:</span>
                <span className="font-bold">{formData.nameEnglish || 'Rameshwar Patil'} ({formData.nameMarathi || 'रामेश्वर पाटील'})</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: t.textSecondary }}>Election Type:</span>
                <span className="font-bold">{formData.electionType} - {formData.assemblyConstituency || formData.parliamentaryConstituency}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: t.textSecondary }}>Account Classification:</span>
                <span className="font-bold">{formData.accountType} ({formData.accountStatus})</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: t.textSecondary }}>Party & Symbol:</span>
                <span className="font-bold">{formData.partyEnglish} ({formData.votingSymbol})</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: t.textSecondary }}>Attributed Acquisition:</span>
                <span className="font-bold">{formData.acquisitionSource}</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 11: Create Account */}
        {currentStep === 11 && (
          <div className="space-y-4 max-w-xl text-center py-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto text-white text-xl" style={{ backgroundColor: t.success }}>
              <Icon name="check" size={24} />
            </div>
            <h2 className="text-lg font-bold" style={{ color: t.textPrimary }}>Ready for Account Provisioning</h2>
            <p className="text-xs" style={{ color: t.textSecondary }}>
              Clicking below will allocate database partitions, register administrative credentials, and trigger credential delivery options.
            </p>
            <button 
              onClick={handleFinalSubmit}
              className="px-6 py-2.5 rounded-lg text-xs font-bold text-white transition"
              style={{ backgroundColor: t.primary }}
            >
              Confirm & Generate Candidate Account
            </button>
          </div>
        )}

        {/* Wizard Control Navigation Footer */}
        {currentStep < 11 && (
          <div className="mt-8 pt-4 flex items-center justify-between" style={{ borderTop: `1px solid ${t.border}` }}>
            <button 
              type="button"
              disabled={currentStep === 1}
              onClick={handleBack}
              className="px-4 py-2 rounded-lg text-xs font-semibold disabled:opacity-40"
              style={{ backgroundColor: t.surface, color: t.textSecondary }}
            >
              Previous Step
            </button>

            <button 
              type="button"
              onClick={handleNext}
              className="px-5 py-2 rounded-lg text-xs font-semibold text-white transition flex items-center gap-1.5"
              style={{ backgroundColor: t.primary }}
            >
              {currentStep === 10 ? 'Proceed to Confirmation' : 'Continue to Next Step'}
              <Icon name="arrowRight" size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function CandidateControlPanelView({ t, candidate, activeTab, setActiveTab, onUpdateCandidate, triggerToast, navigateTo }) {
  const [editingCandidate, setEditingCandidate] = useState(candidate);

  useEffect(() => {
    setEditingCandidate(candidate);
  }, [candidate]);

  const panelSections = [
    { key: 'overview', label: '9.1 Overview' },
    { key: 'account-profile', label: '9.2 Account & Profile' },
    { key: 'subscription', label: '9.3 Subscription' },
    { key: 'feature-access', label: '9.4 Feature Access' },
    { key: 'users-permissions', label: '9.5 Users & Permissions' },
    { key: 'election-config', label: '9.6 Election Config' },
    { key: 'geography', label: '9.7 Election Geography' },
    { key: 'data-services', label: '9.8 Data & Services' },
    { key: 'historical-data', label: '9.9 Historical Data' },
    { key: 'campaign', label: '9.10 Campaign' },
    { key: 'ai', label: '9.11 AI Engine' },
    { key: 'evm-demo', label: '9.12 EVM Demo' },
    { key: 'printer-hardware', label: '9.13 Printer / Hardware' },
    { key: 'app-branding', label: '9.14 Application & Branding' },
    { key: 'enquiries', label: '9.15 Enquiries' },
    { key: 'credentials', label: '9.16 Credentials' },
    { key: 'account-actions', label: '9.17 Account Actions' }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div 
        className="p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}
      >
        <div className="flex items-start gap-3.5">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white text-lg flex-shrink-0"
            style={{ backgroundColor: t.primary }}
          >
            {candidate.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold" style={{ color: t.textPrimary }}>{candidate.name}</h1>
              <span className="text-xs font-mono px-2 py-0.5 rounded font-semibold" style={{ backgroundColor: t.surface, color: t.textSecondary }}>
                {candidate.id}
              </span>
              <span 
                className="text-[10px] px-2 py-0.5 rounded font-bold"
                style={{ 
                  backgroundColor: candidate.status === 'Active' ? t.successBg : t.warningBg,
                  color: candidate.status === 'Active' ? t.success : t.warning
                }}
              >
                {candidate.status}
              </span>
            </div>
            <div className="text-xs mt-1" style={{ color: t.textSecondary }}>
              {candidate.party} • {candidate.electionType} • {candidate.geography} • Distributor: <strong>{candidate.currentDistributor}</strong>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button 
            onClick={() => setActiveTab('account-profile')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{ backgroundColor: t.surface, color: t.textPrimary, border: `1px solid ${t.border}` }}
          >
            Edit Profile
          </button>
          <button 
            onClick={() => setActiveTab('credentials')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5"
            style={{ backgroundColor: t.primary }}
          >
            <Icon name="key" size={14} /> Credentials
          </button>
        </div>
      </div>

      {/* Summary Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3 rounded-lg" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
          <div className="text-[10px]" style={{ color: t.textSecondary }}>Users Allocated</div>
          <div className="text-base font-bold mt-0.5">{candidate.usersUsed} / {candidate.usersAllowed}</div>
        </div>
        <div className="p-3 rounded-lg" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
          <div className="text-[10px]" style={{ color: t.textSecondary }}>Subscription Plan</div>
          <div className="text-xs font-bold mt-0.5 truncate">{candidate.planName}</div>
        </div>
        <div className="p-3 rounded-lg" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
          <div className="text-[10px]" style={{ color: t.textSecondary }}>AI Access</div>
          <div className="text-xs font-bold mt-0.5" style={{ color: candidate.aiAccess ? t.success : t.textMuted }}>
            {candidate.aiAccess ? 'Enabled' : 'Disabled'}
          </div>
        </div>
        <div className="p-3 rounded-lg" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
          <div className="text-[10px]" style={{ color: t.textSecondary }}>Campaign Status</div>
          <div className="text-xs font-bold mt-0.5" style={{ color: candidate.campaignStatus === 'Active' ? t.success : t.warning }}>
            {candidate.campaignStatus}
          </div>
        </div>
        <div className="p-3 rounded-lg" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
          <div className="text-[10px]" style={{ color: t.textSecondary }}>Historical Data</div>
          <div className="text-xs font-bold mt-0.5" style={{ color: t.primary }}>Verified Access</div>
        </div>
        <div className="p-3 rounded-lg" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
          <div className="text-[10px]" style={{ color: t.textSecondary }}>Pending Enquiries</div>
          <div className="text-xs font-bold mt-0.5" style={{ color: candidate.pendingEnquiries > 0 ? t.warning : t.textSecondary }}>
            {candidate.pendingEnquiries} Pending
          </div>
        </div>
      </div>

      {/* Control Panel Tab Layout (Horizontal Scrollable Tabs) */}
      <div 
        className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-medium border-b"
        style={{ borderColor: t.border }}
      >
        {panelSections.map(sec => (
          <button
            key={sec.key}
            onClick={() => setActiveTab(sec.key)}
            className="px-3 py-2 rounded-t-lg whitespace-nowrap transition"
            style={{ 
              backgroundColor: activeTab === sec.key ? t.card : 'transparent',
              color: activeTab === sec.key ? t.primary : t.textSecondary,
              fontWeight: activeTab === sec.key ? '700' : '500',
              borderBottom: activeTab === sec.key ? `2px solid ${t.primary}` : '2px solid transparent'
            }}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="p-5 rounded-xl" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
        {/* 9.1 Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm" style={{ color: t.textPrimary }}>9.1 Candidate Account Executive Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-lg space-y-2" style={{ backgroundColor: t.surface }}>
                <div className="font-bold mb-2">Account Profile & Contacts</div>
                <div>Username: <strong>{candidate.username}</strong></div>
                <div>Official Contact: <strong>{candidate.phone}</strong></div>
                <div>Official Email: <strong>{candidate.email}</strong></div>
                <div>Devanagari Registration: <strong>{candidate.marathiName}</strong></div>
                <div>Acquisition Attribution: <strong>{candidate.acquisitionDistributor}</strong></div>
              </div>

              <div className="p-4 rounded-lg space-y-2" style={{ backgroundColor: t.surface }}>
                <div className="font-bold mb-2">Deployment & Entitlements</div>
                <div>Plan: <strong>{candidate.planName}</strong></div>
                <div>Expiry: <strong>{candidate.expiresAt}</strong></div>
                <div>Users Occupied: <strong>{candidate.usersUsed} / {candidate.usersAllowed}</strong></div>
                <div>Slip Public URL: <a href={candidate.slipUrl} target="_blank" rel="noreferrer" className="underline text-blue-600">{candidate.slipUrl}</a></div>
                <div>PDF & Excel Access: <strong>Enabled</strong></div>
              </div>
            </div>
          </div>
        )}

        {/* 9.2 Account & Profile */}
        {activeTab === 'account-profile' && (
          <div className="space-y-4 max-w-xl text-xs">
            <h3 className="font-bold text-sm" style={{ color: t.textPrimary }}>9.2 Manage Profile & Entity Details</h3>
            <div className="space-y-3">
              <div>
                <label className="block font-semibold mb-1" style={{ color: t.textSecondary }}>Candidate English Name</label>
                <input 
                  type="text" 
                  value={editingCandidate.name} 
                  onChange={(e) => setEditingCandidate({ ...editingCandidate, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg outline-none"
                  style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }}
                />
              </div>
              <div>
                <label className="block font-semibold mb-1" style={{ color: t.textSecondary }}>Candidate Marathi Name</label>
                <input 
                  type="text" 
                  value={editingCandidate.marathiName} 
                  onChange={(e) => setEditingCandidate({ ...editingCandidate, marathiName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg outline-none"
                  style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1" style={{ color: t.textSecondary }}>Party Name</label>
                  <input 
                    type="text" 
                    value={editingCandidate.party} 
                    onChange={(e) => setEditingCandidate({ ...editingCandidate, party: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg outline-none"
                    style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1" style={{ color: t.textSecondary }}>Voting Symbol</label>
                  <input 
                    type="text" 
                    value={editingCandidate.symbol} 
                    onChange={(e) => setEditingCandidate({ ...editingCandidate, symbol: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg outline-none"
                    style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }}
                  />
                </div>
              </div>
              <button 
                onClick={() => {
                  onUpdateCandidate(editingCandidate);
                  triggerToast('Candidate entity profile saved.');
                }}
                className="px-4 py-2 rounded-lg text-white font-semibold"
                style={{ backgroundColor: t.primary }}
              >
                Save Profile Updates
              </button>
            </div>
          </div>
        )}

        {/* 9.3 Subscription */}
        {activeTab === 'subscription' && (
          <div className="space-y-4 max-w-xl text-xs">
            <h3 className="font-bold text-sm" style={{ color: t.textPrimary }}>9.3 Subscription Management & Tier Scaling</h3>
            <div className="p-4 rounded-lg space-y-2" style={{ backgroundColor: t.surface }}>
              <div className="flex justify-between">
                <span>Current Plan:</span>
                <span className="font-bold">{candidate.planName}</span>
              </div>
              <div className="flex justify-between">
                <span>Start Date:</span>
                <span>{candidate.createdAt}</span>
              </div>
              <div className="flex justify-between">
                <span>Expiry Date:</span>
                <span className="font-bold text-red-600">{candidate.expiresAt}</span>
              </div>
              <div className="flex justify-between">
                <span>User Limit:</span>
                <span>{candidate.usersAllowed} Authorized Seats</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button 
                onClick={() => triggerToast('Subscription extended by +90 days.')}
                className="px-3.5 py-2 rounded-lg font-semibold text-white"
                style={{ backgroundColor: t.primary }}
              >
                Renew / Extend (+90 Days)
              </button>
              <button 
                onClick={() => triggerToast('Upgraded to Supreme Enterprise Tier.')}
                className="px-3.5 py-2 rounded-lg font-semibold"
                style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }}
              >
                Upgrade Plan Tier
              </button>
            </div>
          </div>
        )}

        {/* 9.4 Feature Access */}
        {activeTab === 'feature-access' && (
          <div className="space-y-4 max-w-xl text-xs">
            <h3 className="font-bold text-sm" style={{ color: t.textPrimary }}>9.4 Feature Permissions Matrix</h3>
            <p style={{ color: t.textSecondary }}>Administrative toggles governing candidate access to software modules:</p>
            
            <div className="space-y-2">
              {[
                { label: 'Core Voter Directory Management', enabled: true },
                { label: 'Field Worker Geo-Tracking', enabled: true },
                { label: 'WhatsApp Broadcast Engine', enabled: true },
                { label: 'IVR Voice Call Automation', enabled: false },
                { label: 'AI Intelligence & Sentiment Engine', enabled: candidate.aiAccess },
                { label: 'Historical Booth Cross-Tabulation', enabled: true },
                { label: 'EVM Demo Interactive Web Module', enabled: true },
                { label: 'Thermal Slip Printer Direct Drivers', enabled: true },
              ].map((feat, idx) => (
                <div key={idx} className="p-3 rounded-lg flex items-center justify-between" style={{ backgroundColor: t.surface }}>
                  <span className="font-medium">{feat.label}</span>
                  <span 
                    className="px-2 py-0.5 rounded text-[10px] font-bold"
                    style={{ 
                      backgroundColor: feat.enabled ? t.successBg : t.surface,
                      color: feat.enabled ? t.success : t.textMuted
                    }}
                  >
                    {feat.enabled ? 'Authorized' : 'Restricted'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9.5 Users & Permissions */}
        {activeTab === 'users-permissions' && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm" style={{ color: t.textPrimary }}>9.5 Authorized Team Seats ({candidate.usersUsed} / {candidate.usersAllowed})</h3>
                <p style={{ color: t.textSecondary }}>Super Admin control over team member accounts created under this candidate.</p>
              </div>
              <button 
                onClick={() => triggerToast('User limits respected: candidate has 8 slots remaining.')}
                className="px-3 py-1.5 rounded-lg text-white font-semibold"
                style={{ backgroundColor: t.primary }}
              >
                + Add Seat
              </button>
            </div>

            <table className="w-full text-left">
              <thead>
                <tr style={{ backgroundColor: t.surface, borderBottom: `1px solid ${t.border}`, color: t.textSecondary }}>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Username</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">AI Access</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: t.border }}>
                <tr>
                  <td className="py-2.5 px-3 font-semibold">Aniket Shinde</td>
                  <td className="py-2.5 px-3">aniket_boothhead</td>
                  <td className="py-2.5 px-3">Constituency Head</td>
                  <td className="py-2.5 px-3 text-green-600 font-bold">Yes</td>
                  <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded bg-green-100 text-green-800 text-[10px]">Active</span></td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold">Vikas Deshmukh</td>
                  <td className="py-2.5 px-3">vikas_media</td>
                  <td className="py-2.5 px-3">Media Manager</td>
                  <td className="py-2.5 px-3 text-gray-500">No</td>
                  <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded bg-green-100 text-green-800 text-[10px]">Active</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* 9.6 Election Config */}
        {activeTab === 'election-config' && (
          <div className="space-y-4 max-w-xl text-xs">
            <h3 className="font-bold text-sm" style={{ color: t.textPrimary }}>9.6 Election Project Configuration</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1" style={{ color: t.textSecondary }}>Election Type</label>
                <input type="text" readOnly value={candidate.electionType} className="w-full px-3 py-2 rounded-lg opacity-80" style={{ backgroundColor: t.surface }} />
              </div>
              <div>
                <label className="block font-semibold mb-1" style={{ color: t.textSecondary }}>Election Year</label>
                <input type="text" readOnly value={candidate.electionYear} className="w-full px-3 py-2 rounded-lg opacity-80" style={{ backgroundColor: t.surface }} />
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-1" style={{ color: t.textSecondary }}>Election Project Title</label>
              <input type="text" readOnly value={candidate.electionName} className="w-full px-3 py-2 rounded-lg opacity-80" style={{ backgroundColor: t.surface }} />
            </div>
          </div>
        )}

        {/* 9.7 Election Geography */}
        {activeTab === 'geography' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-sm" style={{ color: t.textPrimary }}>9.7 Configured Geography Hierarchy</h3>
            <div className="p-4 rounded-lg space-y-2" style={{ backgroundColor: t.surface }}>
              <div>State: <strong>Maharashtra</strong></div>
              <div>Constituency Segment: <strong>{candidate.geography}</strong></div>
              <div>Total Polling Stations Registered: <strong>342 Booths</strong></div>
            </div>
          </div>
        )}

        {/* 9.8 Data & Services */}
        {activeTab === 'data-services' && (
          <div className="space-y-4 text-xs max-w-xl">
            <h3 className="font-bold text-sm" style={{ color: t.textPrimary }}>9.8 Data Availability & Service Entitlements</h3>
            <div className="space-y-2">
              <div className="p-3 rounded-lg flex items-center justify-between" style={{ backgroundColor: t.surface }}>
                <span>Voter Rolls (Final Publication 2024)</span>
                <span className="font-bold text-green-600">Available (3,24,910 Records)</span>
              </div>
              <div className="p-3 rounded-lg flex items-center justify-between" style={{ backgroundColor: t.surface }}>
                <span>Booth Geo-Coordinates</span>
                <span className="font-bold text-green-600">Available (100% Mapped)</span>
              </div>
            </div>
          </div>
        )}

        {/* 9.9 Historical Data */}
        {activeTab === 'historical-data' && (
          <div className="space-y-4 text-xs max-w-xl">
            <h3 className="font-bold text-sm" style={{ color: t.textPrimary }}>9.9 Historical Datasets & Previous Results</h3>
            <div className="p-3 rounded-lg" style={{ backgroundColor: t.surface }}>
              <div className="font-bold mb-1">2014 & 2019 Election Datasets</div>
              <p style={{ color: t.textSecondary }}>Booth-level margin analysis datasets are verified and accessible to this candidate's account.</p>
            </div>
          </div>
        )}

        {/* 9.10 Campaign */}
        {activeTab === 'campaign' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-sm" style={{ color: t.textPrimary }}>9.10 Campaign Channels & Quotas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg" style={{ backgroundColor: t.surface }}>
                <div className="font-bold mb-1">WhatsApp Broadcasts</div>
                <div>Available Balance: <strong>45,200 Msgs</strong></div>
                <div>Status: <span className="text-green-600 font-semibold">Active</span></div>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: t.surface }}>
                <div className="font-bold mb-1">SMS Bulk Relay</div>
                <div>Available Balance: <strong>1,20,000 SMS</strong></div>
                <div>Status: <span className="text-green-600 font-semibold">Active</span></div>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: t.surface }}>
                <div className="font-bold mb-1">Automated Voice Calls</div>
                <div>Available Balance: <strong>0 Mins</strong></div>
                <div>Status: <span className="text-gray-500 font-semibold">No Quota</span></div>
              </div>
            </div>
          </div>
        )}

        {/* 9.11 AI Engine */}
        {activeTab === 'ai' && (
          <div className="space-y-4 text-xs max-w-xl">
            <h3 className="font-bold text-sm" style={{ color: t.textPrimary }}>9.11 AI Intelligence & Model Allocations</h3>
            <div className="p-4 rounded-lg space-y-2" style={{ backgroundColor: t.surface }}>
              <div className="flex justify-between">
                <span>AI Subscription Status:</span>
                <span className="font-bold" style={{ color: candidate.aiAccess ? t.success : t.error }}>
                  {candidate.aiAccess ? 'Active License' : 'Disabled'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Monthly Query Allowance:</span>
                <span>5,000 Complex Queries</span>
              </div>
            </div>
            <button 
              onClick={() => {
                onUpdateCandidate({ ...candidate, aiAccess: !candidate.aiAccess });
                triggerToast(`AI Access is now ${!candidate.aiAccess ? 'Enabled' : 'Disabled'}.`);
              }}
              className="px-4 py-2 rounded-lg text-white font-semibold"
              style={{ backgroundColor: candidate.aiAccess ? t.error : t.primary }}
            >
              {candidate.aiAccess ? 'Revoke AI Access' : 'Grant AI Access'}
            </button>
          </div>
        )}

        {/* 9.12 EVM Demo */}
        {activeTab === 'evm-demo' && (
          <div className="space-y-4 text-xs max-w-xl">
            <h3 className="font-bold text-sm" style={{ color: t.textPrimary }}>9.12 EVM Demonstration Link Generator</h3>
            <div className="p-3 rounded-lg" style={{ backgroundColor: t.surface }}>
              <div>Generated Public Demo URL:</div>
              <div className="font-mono text-blue-600 font-bold mt-1">https://evm.rajatantra.in/demo/cand-8091</div>
            </div>
          </div>
        )}

        {/* 9.13 Printer / Hardware */}
        {activeTab === 'printer-hardware' && (
          <div className="space-y-4 text-xs max-w-xl">
            <h3 className="font-bold text-sm" style={{ color: t.textPrimary }}>9.13 Thermal Slip Printer Integration</h3>
            <div className="p-3 rounded-lg" style={{ backgroundColor: t.surface }}>
              <div>Printer Driver Status: <strong>Ready (ESC/POS Standard)</strong></div>
              <div>Splash Asset on Thermal Output: <strong>Configured</strong></div>
            </div>
          </div>
        )}

        {/* 9.14 Application & Branding */}
        {activeTab === 'app-branding' && (
          <div className="space-y-4 text-xs max-w-xl">
            <h3 className="font-bold text-sm" style={{ color: t.textPrimary }}>9.14 White-label Application Details</h3>
            <div className="space-y-2">
              <div>Application Title: <strong>{candidate.appName}</strong></div>
              <div>Public Voter Slip URL: <strong>{candidate.slipUrl}</strong></div>
            </div>
          </div>
        )}

        {/* 9.15 Enquiries */}
        {activeTab === 'enquiries' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-sm" style={{ color: t.textPrimary }}>9.15 Candidate Service Enquiries</h3>
            <div className="p-3 rounded-lg" style={{ backgroundColor: t.surface }}>
              <div className="font-bold">Recent Enquiry: WhatsApp Recharge (1,00,000 Messages)</div>
              <div className="text-[11px]" style={{ color: t.textSecondary }}>Submitted: 2024-04-10 • Status: Pending Super Admin Approval</div>
            </div>
          </div>
        )}

        {/* 9.16 Credentials */}
        {activeTab === 'credentials' && (
          <div className="space-y-4 text-xs max-w-xl">
            <h3 className="font-bold text-sm" style={{ color: t.textPrimary }}>9.16 Candidate Credential Management</h3>
            <div className="p-4 rounded-lg space-y-2" style={{ backgroundColor: t.surface }}>
              <div>Registered Administrative Username: <strong>{candidate.username}</strong></div>
              <div className="text-gray-500">Security Rule: Plaintext passwords cannot be inspected.</div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => triggerToast(`Password reset link dispatched to ${candidate.phone} via WhatsApp.`)}
                className="px-3.5 py-2 rounded-lg text-white font-semibold"
                style={{ backgroundColor: t.primary }}
              >
                Send Setup Instructions via WhatsApp
              </button>
              <button 
                onClick={() => triggerToast(`Password reset instructions emailed to ${candidate.email}.`)}
                className="px-3.5 py-2 rounded-lg font-semibold"
                style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }}
              >
                Send via Email
              </button>
            </div>
          </div>
        )}

        {/* 9.17 Account Actions */}
        {activeTab === 'account-actions' && (
          <div className="space-y-4 text-xs max-w-xl">
            <h3 className="font-bold text-sm" style={{ color: t.textPrimary }}>9.17 Consequential Account Operations</h3>
            <div className="p-4 rounded-lg border space-y-3" style={{ borderColor: t.error, backgroundColor: t.surface }}>
              <div className="font-bold" style={{ color: t.error }}>Danger Zone: Super Admin Privileges</div>
              <p style={{ color: t.textSecondary }}>
                Deactivating locks field worker logins instantly. Deletion purges all booth assignments.
              </p>
              <div className="flex gap-2 pt-2">
                <button 
                  onClick={() => {
                    const nextSt = candidate.status === 'Active' ? 'Inactive' : 'Active';
                    onUpdateCandidate({ ...candidate, status: nextSt });
                    triggerToast(`Candidate is now ${nextSt}.`);
                  }}
                  className="px-3 py-2 rounded-lg font-semibold"
                  style={{ backgroundColor: t.warningBg, color: t.warning }}
                >
                  {candidate.status === 'Active' ? 'Deactivate Account' : 'Reactivate Account'}
                </button>
                <button 
                  onClick={() => triggerToast('Candidate deletion requires root dual-authorization.', 'error')}
                  className="px-3 py-2 rounded-lg font-semibold text-white"
                  style={{ backgroundColor: t.error }}
                >
                  Delete Candidate Record
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CandidateRequestsView({ t, navigateTo, triggerToast }) {
  const [requests, setRequests] = useState([
    {
      id: 'REQ-CAND-501',
      candidateName: 'Adv. Kiran Joshi',
      contact: '+91 98221 99881',
      party: 'Shiv Sena (UBT)',
      electionType: 'Municipal Corporation',
      geography: 'Pune Ward 21 - Shivajinagar',
      requestedPlan: 'Municipal Pro',
      date: '2024-04-11',
      status: 'Pending'
    },
    {
      id: 'REQ-CAND-502',
      candidateName: 'Dr. Nitin Kadam',
      contact: '+91 94220 11223',
      party: 'Independent',
      electionType: 'Vidhan Sabha',
      geography: 'Satara (AC-256)',
      requestedPlan: 'Vidhan Sabha Standard',
      date: '2024-04-10',
      status: 'Pending'
    }
  ]);

  const handleAction = (reqId, action) => {
    setRequests(requests.map(r => r.id === reqId ? { ...r, status: action } : r));
    triggerToast(`Request ${reqId} marked as ${action}.`);
  };

  return (
    <div className="space-y-5 text-xs">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: t.textPrimary }}>New Candidate Requests</h1>
        <p className="text-xs mt-0.5" style={{ color: t.textSecondary }}>
          Prospective candidate registrations received from the public intake portal awaiting Super Admin approval.
        </p>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
        <table className="w-full text-left">
          <thead>
            <tr style={{ backgroundColor: t.surface, borderBottom: `1px solid ${t.border}`, color: t.textSecondary }}>
              <th className="py-3 px-4 font-semibold">Request ID</th>
              <th className="py-3 px-4 font-semibold">Applicant Candidate</th>
              <th className="py-3 px-4 font-semibold">Party</th>
              <th className="py-3 px-4 font-semibold">Election Segment</th>
              <th className="py-3 px-4 font-semibold">Plan</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: t.border }}>
            {requests.map(req => (
              <tr key={req.id}>
                <td className="py-3.5 px-4 font-mono font-bold" style={{ color: t.primary }}>{req.id}</td>
                <td className="py-3.5 px-4">
                  <div className="font-bold">{req.candidateName}</div>
                  <div className="text-[10px]" style={{ color: t.textSecondary }}>{req.contact}</div>
                </td>
                <td className="py-3.5 px-4 font-medium">{req.party}</td>
                <td className="py-3.5 px-4">{req.electionType} • {req.geography}</td>
                <td className="py-3.5 px-4 font-semibold">{req.requestedPlan}</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded font-bold text-[10px]" style={{ backgroundColor: req.status === 'Approved' ? t.successBg : t.warningBg, color: req.status === 'Approved' ? t.success : t.warning }}>
                    {req.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right space-x-1.5">
                  {req.status === 'Pending' ? (
                    <>
                      <button 
                        onClick={() => handleAction(req.id, 'Approved')}
                        className="px-2.5 py-1 rounded text-white font-semibold"
                        style={{ backgroundColor: t.success }}
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleAction(req.id, 'Rejected')}
                        className="px-2.5 py-1 rounded font-semibold"
                        style={{ backgroundColor: t.surface, color: t.error }}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="text-[11px] font-bold" style={{ color: t.textMuted }}>Decision Logged</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EnquiriesView({ t, enquiries, setEnquiries, triggerToast }) {
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const updateStatus = (enqId, nextStatus) => {
    setEnquiries(enquiries.map(e => e.id === enqId ? { ...e, status: nextStatus } : e));
    triggerToast(`Enquiry ${enqId} transitioned to ${nextStatus}.`);
    if (selectedEnquiry && selectedEnquiry.id === enqId) {
      setSelectedEnquiry({ ...selectedEnquiry, status: nextStatus });
    }
  };

  return (
    <div className="space-y-5 text-xs">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: t.textPrimary }}>Generated Enquiries</h1>
        <p className="text-xs mt-0.5" style={{ color: t.textSecondary }}>
          Centralized administrative management of service requests (recharges, AI users, historical data, printers).
        </p>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
        <table className="w-full text-left">
          <thead>
            <tr style={{ backgroundColor: t.surface, borderBottom: `1px solid ${t.border}`, color: t.textSecondary }}>
              <th className="py-3 px-4 font-semibold">Enquiry ID</th>
              <th className="py-3 px-4 font-semibold">Candidate</th>
              <th className="py-3 px-4 font-semibold">Service Type</th>
              <th className="py-3 px-4 font-semibold">Submitted</th>
              <th className="py-3 px-4 font-semibold">Requested Quota</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: t.border }}>
            {enquiries.map(enq => (
              <tr key={enq.id} className="hover:bg-black/[0.02]">
                <td className="py-3 px-4 font-mono font-bold" style={{ color: t.primary }}>{enq.id}</td>
                <td className="py-3 px-4 font-bold">{enq.candidateName}</td>
                <td className="py-3 px-4 font-medium">{enq.type}</td>
                <td className="py-3 px-4" style={{ color: t.textSecondary }}>{enq.submissionDate}</td>
                <td className="py-3 px-4 font-medium">{enq.requestedQuantity}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded font-bold text-[10px]" style={{ 
                    backgroundColor: enq.status === 'Completed' ? t.successBg : enq.status === 'Pending' ? t.warningBg : t.surface,
                    color: enq.status === 'Completed' ? t.success : enq.status === 'Pending' ? t.warning : t.primary
                  }}>
                    {enq.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button 
                    onClick={() => setSelectedEnquiry(enq)}
                    className="px-2.5 py-1 rounded font-semibold"
                    style={{ backgroundColor: t.surface, color: t.primary }}
                  >
                    Inspect
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-lg rounded-xl p-6 shadow-2xl" style={{ backgroundColor: t.card, border: `1px solid ${t.border}`, color: t.textPrimary }}>
            <div className="flex items-center justify-between pb-3 mb-4" style={{ borderBottom: `1px solid ${t.border}` }}>
              <div>
                <h3 className="font-bold text-base">{selectedEnquiry.type} ({selectedEnquiry.id})</h3>
                <span className="text-xs" style={{ color: t.textSecondary }}>Candidate: {selectedEnquiry.candidateName}</span>
              </div>
              <button onClick={() => setSelectedEnquiry(null)}><Icon name="x" size={18} /></button>
            </div>

            <div className="space-y-3 mb-6 text-xs">
              <div className="p-3 rounded-lg" style={{ backgroundColor: t.surface }}>
                <div>Requested Quantity: <strong>{selectedEnquiry.requestedQuantity}</strong></div>
                <div>Category: <strong>{selectedEnquiry.category}</strong></div>
                <div>Candidate Note: <em>"{selectedEnquiry.remarks}"</em></div>
              </div>
              <div>Workflow State: <strong>{selectedEnquiry.status}</strong></div>
            </div>

            <div className="flex items-center justify-end gap-2">
              {selectedEnquiry.status === 'Pending' && (
                <button 
                  onClick={() => updateStatus(selectedEnquiry.id, 'Under Review')}
                  className="px-3 py-1.5 rounded-lg font-semibold"
                  style={{ backgroundColor: t.surface, color: t.textPrimary }}
                >
                  Mark Under Review
                </button>
              )}
              {selectedEnquiry.status !== 'Approved' && selectedEnquiry.status !== 'Completed' && (
                <button 
                  onClick={() => updateStatus(selectedEnquiry.id, 'Approved')}
                  className="px-3.5 py-1.5 rounded-lg text-white font-semibold"
                  style={{ backgroundColor: t.success }}
                >
                  Approve Order
                </button>
              )}
              {selectedEnquiry.status === 'Approved' && (
                <button 
                  onClick={() => updateStatus(selectedEnquiry.id, 'Completed')}
                  className="px-3.5 py-1.5 rounded-lg text-white font-semibold"
                  style={{ backgroundColor: t.primary }}
                >
                  Mark Fully Completed
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CampaignDashboardView({ t, candidates, navigateTo }) {
  return (
    <div className="space-y-6 text-xs">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: t.textPrimary }}>Campaign Dashboard</h1>
        <p className="text-xs mt-0.5" style={{ color: t.textSecondary }}>
          Platform-wide monitoring of WhatsApp, SMS, and IVR voice broadcasts across active candidates.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
          <div style={{ color: t.textSecondary }}>Total Broadcasts</div>
          <div className="text-2xl font-bold mt-1">1,280</div>
          <div className="text-[10px] text-green-600 font-semibold">98.4% Delivery Success</div>
        </div>
        <div className="p-4 rounded-xl" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
          <div style={{ color: t.textSecondary }}>WhatsApp Relayed</div>
          <div className="text-2xl font-bold mt-1" style={{ color: t.chart1 }}>4,120,400</div>
          <div className="text-[10px]" style={{ color: t.textMuted }}>Through Meta Cloud API</div>
        </div>
        <div className="p-4 rounded-xl" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
          <div style={{ color: t.textSecondary }}>SMS Sent</div>
          <div className="text-2xl font-bold mt-1" style={{ color: t.chart2 }}>2,910,200</div>
          <div className="text-[10px]" style={{ color: t.textMuted }}>DLT Verified Headers</div>
        </div>
        <div className="p-4 rounded-xl" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
          <div style={{ color: t.textSecondary }}>Voice Call Mins</div>
          <div className="text-2xl font-bold mt-1" style={{ color: t.chart3 }}>180,450</div>
          <div className="text-[10px]" style={{ color: t.textMuted }}>Connected calls</div>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
        <div className="p-3 font-bold border-b" style={{ borderColor: t.border, color: t.textPrimary }}>
          Active High-Volume Campaigns
        </div>
        <table className="w-full text-left">
          <thead>
            <tr style={{ backgroundColor: t.surface, borderBottom: `1px solid ${t.border}`, color: t.textSecondary }}>
              <th className="py-2.5 px-3">Campaign</th>
              <th className="py-2.5 px-3">Candidate</th>
              <th className="py-2.5 px-3">Channel</th>
              <th className="py-2.5 px-3">Volume</th>
              <th className="py-2.5 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: t.border }}>
            <tr>
              <td className="py-3 px-3 font-semibold">Kothrud Rally Announcement</td>
              <td className="py-3 px-3">Rameshwar Patil</td>
              <td className="py-3 px-3"><span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px]">WhatsApp</span></td>
              <td className="py-3 px-3 font-bold">1,00,000</td>
              <td className="py-3 px-3 text-green-600 font-bold">Completed</td>
            </tr>
            <tr>
              <td className="py-3 px-3 font-semibold">Baramati Voter Slip Dispatch</td>
              <td className="py-3 px-3">Devendra Deshmukh</td>
              <td className="py-3 px-3"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px]">WhatsApp</span></td>
              <td className="py-3 px-3 font-bold">2,50,000</td>
              <td className="py-3 px-3 text-blue-600 font-bold">In Progress</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AIDashboardView({ t, candidates, navigateTo }) {
  return (
    <div className="space-y-6 text-xs">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: t.textPrimary }}>AI Dashboard</h1>
        <p className="text-xs mt-0.5" style={{ color: t.textSecondary }}>
          Centralized oversight of political LLM queries, demographic sentiment RAG engines, and user limits.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
          <div style={{ color: t.textSecondary }}>AI Subscribed Candidates</div>
          <div className="text-2xl font-bold mt-1" style={{ color: t.primary }}>48</div>
          <div className="text-[10px] text-green-600 font-semibold">34% of active base</div>
        </div>
        <div className="p-4 rounded-xl" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
          <div style={{ color: t.textSecondary }}>Authorized AI Users</div>
          <div className="text-2xl font-bold mt-1">112</div>
          <div className="text-[10px]" style={{ color: t.textMuted }}>Seats allocated</div>
        </div>
        <div className="p-4 rounded-xl" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
          <div style={{ color: t.textSecondary }}>AI Queries Executed</div>
          <div className="text-2xl font-bold mt-1" style={{ color: t.chart3 }}>24,910</div>
          <div className="text-[10px]" style={{ color: t.textMuted }}>This month</div>
        </div>
        <div className="p-4 rounded-xl" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
          <div style={{ color: t.textSecondary }}>Reports Synthesized</div>
          <div className="text-2xl font-bold mt-1" style={{ color: t.chart4 }}>1,420</div>
          <div className="text-[10px]" style={{ color: t.textMuted }}>Booth sentiment dossiers</div>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
        <div className="p-3 font-bold border-b" style={{ borderColor: t.border, color: t.textPrimary }}>
          Candidates with AI Access
        </div>
        <table className="w-full text-left">
          <thead>
            <tr style={{ backgroundColor: t.surface, borderBottom: `1px solid ${t.border}`, color: t.textSecondary }}>
              <th className="py-2.5 px-3">Candidate</th>
              <th className="py-2.5 px-3">Constituency</th>
              <th className="py-2.5 px-3">AI Seats</th>
              <th className="py-2.5 px-3">Queries (30d)</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: t.border }}>
            {candidates.filter(c => c.aiAccess).map(cand => (
              <tr key={cand.id}>
                <td className="py-3 px-3 font-bold">{cand.name}</td>
                <td className="py-3 px-3">{cand.geography}</td>
                <td className="py-3 px-3 font-semibold">6 Authorized</td>
                <td className="py-3 px-3 font-mono font-bold">1,840</td>
                <td className="py-3 px-3 text-right">
                  <button 
                    onClick={() => navigateTo('candidate-control-panel', cand.id)}
                    className="px-2.5 py-1 rounded text-white font-semibold"
                    style={{ backgroundColor: t.primary }}
                  >
                    Configure
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DistributorsView({ t, distributors, setDistributors, triggerToast }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDist, setNewDist] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    city: 'Pune',
    state: 'Maharashtra'
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const created = {
      id: `DIS-${Math.floor(105 + Math.random() * 50)}`,
      name: newDist.name,
      contactPerson: newDist.contactPerson,
      email: newDist.email,
      phone: newDist.phone,
      city: newDist.city,
      state: newDist.state,
      status: 'Active',
      candidateCount: 0,
      registeredDate: '2024-04-12'
    };
    setDistributors([created, ...distributors]);
    setShowAddModal(false);
    triggerToast(`Distributor ${created.name} onboarded successfully!`);
  };

  const toggleStatus = (id) => {
    setDistributors(distributors.map(d => {
      if (d.id === id) {
        const next = d.status === 'Active' ? 'Suspended' : 'Active';
        triggerToast(`Distributor status changed to ${next}.`);
        return { ...d, status: next };
      }
      return d;
    }));
  };

  return (
    <div className="space-y-5 text-xs">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: t.textPrimary }}>Distributor Management</h1>
          <p className="text-xs mt-0.5" style={{ color: t.textSecondary }}>
            Manage regional partners. (Note: Acquisition attribution remains immutable even if current distributor shifts).
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-lg text-white font-semibold"
          style={{ backgroundColor: t.primary }}
        >
          + Add Distributor
        </button>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
        <table className="w-full text-left">
          <thead>
            <tr style={{ backgroundColor: t.surface, borderBottom: `1px solid ${t.border}`, color: t.textSecondary }}>
              <th className="py-3 px-4 font-semibold">Distributor Name & ID</th>
              <th className="py-3 px-4 font-semibold">Contact Person</th>
              <th className="py-3 px-4 font-semibold">Location</th>
              <th className="py-3 px-4 font-semibold">Managed Candidates</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: t.border }}>
            {distributors.map(dist => (
              <tr key={dist.id}>
                <td className="py-3.5 px-4">
                  <div className="font-bold">{dist.name}</div>
                  <div className="text-[10px] font-mono" style={{ color: t.textMuted }}>{dist.id}</div>
                </td>
                <td className="py-3.5 px-4 font-medium">
                  <div>{dist.contactPerson}</div>
                  <div className="text-[10px]" style={{ color: t.textSecondary }}>{dist.phone}</div>
                </td>
                <td className="py-3.5 px-4">{dist.city}, {dist.state}</td>
                <td className="py-3.5 px-4 font-bold">{dist.candidateCount} Accounts</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded font-bold text-[10px]" style={{ 
                    backgroundColor: dist.status === 'Active' ? t.successBg : t.errorBg,
                    color: dist.status === 'Active' ? t.success : t.error
                  }}>
                    {dist.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button 
                    onClick={() => toggleStatus(dist.id)}
                    className="px-2.5 py-1 rounded font-semibold"
                    style={{ backgroundColor: t.surface, color: t.textPrimary }}
                  >
                    {dist.status === 'Active' ? 'Suspend' : 'Reactivate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Distributor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-md rounded-xl p-6 shadow-2xl" style={{ backgroundColor: t.card, border: `1px solid ${t.border}`, color: t.textPrimary }}>
            <div className="flex items-center justify-between pb-3 mb-4" style={{ borderBottom: `1px solid ${t.border}` }}>
              <h3 className="font-bold text-base">Add New Distributor</h3>
              <button onClick={() => setShowAddModal(false)}><Icon name="x" size={18} /></button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Company / Agency Name *</label>
                <input required type="text" value={newDist.name} onChange={e => setNewDist({ ...newDist, name: e.target.value })} className="w-full px-3 py-2 rounded-lg" style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }} />
              </div>
              <div>
                <label className="block font-semibold mb-1">Contact Person Name</label>
                <input required type="text" value={newDist.contactPerson} onChange={e => setNewDist({ ...newDist, contactPerson: e.target.value })} className="w-full px-3 py-2 rounded-lg" style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Phone</label>
                  <input required type="text" value={newDist.phone} onChange={e => setNewDist({ ...newDist, phone: e.target.value })} className="w-full px-3 py-2 rounded-lg" style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }} />
                </div>
                <div>
                  <label className="block font-semibold mb-1">City</label>
                  <input required type="text" value={newDist.city} onChange={e => setNewDist({ ...newDist, city: e.target.value })} className="w-full px-3 py-2 rounded-lg" style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }} />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-3 py-2 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg text-white font-semibold" style={{ backgroundColor: t.primary }}>Create Partner</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function DistributorRequestsView({ t, triggerToast }) {
  return (
    <div className="space-y-5 text-xs">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: t.textPrimary }}>Distributor Requests</h1>
        <p className="text-xs mt-0.5" style={{ color: t.textSecondary }}>Applications from media agencies seeking channel partner licenses.</p>
      </div>
      <div className="p-4 rounded-xl text-center" style={{ backgroundColor: t.card, border: `1px solid ${t.border}`, color: t.textSecondary }}>
        No pending distributor license applications at this time.
      </div>
    </div>
  );
}

function SubscriptionPlansView({ t, triggerToast }) {
  const plans = [
    { name: 'Municipal Starter', validity: '30 Days', userLimit: 10, ai: false, candidates: 22, tier: 'Municipal Tier' },
    { name: 'Vidhan Sabha Pro', validity: '180 Days', userLimit: 50, ai: true, candidates: 64, tier: 'Assembly Tier' },
    { name: 'Lok Sabha Enterprise', validity: '365 Days', userLimit: 150, ai: true, candidates: 48, tier: 'Parliamentary Tier' },
  ];

  return (
    <div className="space-y-5 text-xs">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: t.textPrimary }}>Subscription Plans</h1>
          <p className="text-xs mt-0.5" style={{ color: t.textSecondary }}>Platform-wide licensing templates governing feature entitlements and seat quotas.</p>
        </div>
        <button onClick={() => triggerToast('Plan template builder opened.')} className="px-4 py-2 rounded-lg text-white font-semibold" style={{ backgroundColor: t.primary }}>
          + New Plan Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((p, idx) => (
          <div key={idx} className="p-5 rounded-xl space-y-3" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold" style={{ color: t.textPrimary }}>{p.name}</h3>
                <span className="text-[10px]" style={{ color: t.textSecondary }}>Validity: {p.validity}</span>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: t.surface, color: t.textSecondary }}>
                {p.tier}
              </span>
            </div>
            <div className="p-3 rounded-lg space-y-1.5" style={{ backgroundColor: t.surface }}>
              <div>Max User Seats: <strong>{p.userLimit} Seats</strong></div>
              <div>AI Intelligence: <strong>{p.ai ? 'Included' : 'Not Included'}</strong></div>
              <div>Active Deployments: <strong>{p.candidates} Candidates</strong></div>
            </div>
            <button onClick={() => triggerToast(`Configuring ${p.name}`)} className="w-full py-2 rounded-lg font-semibold" style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }}>
              Edit Plan Parameters
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TutorialsView({ t, triggerToast }) {
  const articles = [
    { title: 'Super Admin Guide: Assigning Booth Geographies', category: 'Administrative Ops', date: '2024-03-20', status: 'Published' },
    { title: 'Configuring Meta WhatsApp Cloud API Credentials', category: 'Campaign Integration', date: '2024-03-15', status: 'Published' },
    { title: 'Handling DLT Templates and Bulk SMS Relays', category: 'Telecom Compliance', date: '2024-02-28', status: 'Draft' },
  ];

  return (
    <div className="space-y-5 text-xs">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: t.textPrimary }}>Tutorials & Knowledge CMS</h1>
          <p className="text-xs mt-0.5" style={{ color: t.textSecondary }}>Publish training modules for distributors and administrative operators.</p>
        </div>
        <button onClick={() => triggerToast('Tutorial creator opened.')} className="px-4 py-2 rounded-lg text-white font-semibold" style={{ backgroundColor: t.primary }}>
          + Add Tutorial Article
        </button>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
        <table className="w-full text-left">
          <thead>
            <tr style={{ backgroundColor: t.surface, borderBottom: `1px solid ${t.border}`, color: t.textSecondary }}>
              <th className="py-3 px-4 font-semibold">Title</th>
              <th className="py-3 px-4 font-semibold">Category</th>
              <th className="py-3 px-4 font-semibold">Updated</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: t.border }}>
            {articles.map((art, idx) => (
              <tr key={idx}>
                <td className="py-3 px-4 font-bold">{art.title}</td>
                <td className="py-3 px-4">{art.category}</td>
                <td className="py-3 px-4" style={{ color: t.textMuted }}>{art.date}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded font-bold text-[10px]" style={{ backgroundColor: art.status === 'Published' ? t.successBg : t.warningBg, color: art.status === 'Published' ? t.success : t.warning }}>
                    {art.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button onClick={() => triggerToast(`Editing ${art.title}`)} className="px-2.5 py-1 rounded" style={{ backgroundColor: t.surface }}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PlatformAuditView({ t, audits }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAudits = audits.filter(a => 
    a.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.affectedEntity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-5 text-xs">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: t.textPrimary }}>Platform Audit Trail</h1>
        <p className="text-xs mt-0.5" style={{ color: t.textSecondary }}>
          Cryptographically timestamped, immutable administrative event logs. (Read-only security record).
        </p>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
        <div className="p-3 border-b flex items-center justify-between" style={{ borderColor: t.border }}>
          <input 
            type="text" 
            placeholder="Search audit actions, actors, entities..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg w-64 outline-none"
            style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }}
          />
          <span style={{ color: t.textMuted }}>{filteredAudits.length} Events Logged</span>
        </div>

        <table className="w-full text-left font-mono">
          <thead>
            <tr style={{ backgroundColor: t.surface, borderBottom: `1px solid ${t.border}`, color: t.textSecondary }}>
              <th className="py-2.5 px-3">Timestamp</th>
              <th className="py-2.5 px-3">Actor</th>
              <th className="py-2.5 px-3">Action Event</th>
              <th className="py-2.5 px-3">Affected Target Entity</th>
              <th className="py-2.5 px-3">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: t.border }}>
            {filteredAudits.map(aud => (
              <tr key={aud.id}>
                <td className="py-2.5 px-3" style={{ color: t.textMuted }}>{aud.timestamp}</td>
                <td className="py-2.5 px-3 font-semibold">{aud.actor}</td>
                <td className="py-2.5 px-3 font-bold" style={{ color: t.primary }}>{aud.action}</td>
                <td className="py-2.5 px-3">{aud.affectedEntity}</td>
                <td className="py-2.5 px-3 font-bold text-green-600">{aud.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PlatformSettingsView({ t, triggerToast }) {
  return (
    <div className="space-y-6 text-xs max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: t.textPrimary }}>Platform Settings</h1>
        <p className="text-xs mt-0.5" style={{ color: t.textSecondary }}>Global system parameters governing Rajatantra Election Engine.</p>
      </div>

      <div className="p-5 rounded-xl space-y-4" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
        <h3 className="font-bold text-sm" style={{ color: t.textPrimary }}>Core System Configuration</h3>
        <div>
          <label className="block font-semibold mb-1" style={{ color: t.textSecondary }}>Platform Legal Entity Name</label>
          <input type="text" defaultValue="Rajatantra Election Management Technologies Pvt Ltd" className="w-full px-3 py-2 rounded-lg" style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }} />
        </div>
        <div>
          <label className="block font-semibold mb-1" style={{ color: t.textSecondary }}>Root Support Hotline</label>
          <input type="text" defaultValue="+91 (020) 2554-9000" className="w-full px-3 py-2 rounded-lg" style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }} />
        </div>
        <div>
          <label className="block font-semibold mb-1" style={{ color: t.textSecondary }}>Default Password Setup Token Expiry</label>
          <input type="text" defaultValue="48 Hours" className="w-full px-3 py-2 rounded-lg" style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }} />
        </div>
        <button onClick={() => triggerToast('Platform settings saved successfully.')} className="px-4 py-2 rounded-lg text-white font-semibold" style={{ backgroundColor: t.primary }}>
          Save Platform Changes
        </button>
      </div>
    </div>
  );
}

function ProfileView({ t, triggerToast }) {
  return (
    <div className="space-y-6 text-xs max-w-xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: t.textPrimary }}>Super Admin Profile</h1>
        <p className="text-xs mt-0.5" style={{ color: t.textSecondary }}>Root administrator credentials and session settings.</p>
      </div>

      <div className="p-5 rounded-xl space-y-4" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base" style={{ backgroundColor: t.primary }}>
            SA
          </div>
          <div>
            <div className="font-bold text-sm">Super Administrator</div>
            <div style={{ color: t.textSecondary }}>admin@rajatantra.gov.in • Root Authority</div>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <div>Full Name: <strong>Principal Admin Officer</strong></div>
          <div>Security Clearance: <strong>Tier 0 (Full Infrastructure Access)</strong></div>
          <div>Session Timeout: <strong>30 Minutes Inactivity</strong></div>
        </div>

        <button onClick={() => triggerToast('Profile preferences updated.')} className="px-4 py-2 rounded-lg text-white font-semibold" style={{ backgroundColor: t.primary }}>
          Update Profile Information
        </button>
      </div>
    </div>
  );
}