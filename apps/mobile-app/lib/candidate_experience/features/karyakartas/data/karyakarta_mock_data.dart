import '../models/karyakarta_model.dart';
import '../models/update_request_model.dart';

class PhoneBookContact {
  final String id;
  final String name;
  final String designation;
  final String category; // Booth Presidents, Core Committee, Prabhaag Leads, Legal & Admin, Government BLO
  final String phone;
  final String alternatePhone;
  final String email;
  final String location;
  final bool isPriority;

  const PhoneBookContact({
    required this.id,
    required this.name,
    required this.designation,
    required this.category,
    required this.phone,
    this.alternatePhone = "",
    this.email = "",
    required this.location,
    this.isPriority = false,
  });
}

class KaryakartaMockData {
  static final List<KaryakartaModel> karyakartas = [
    const KaryakartaModel(
      id: "KAR-042-01",
      name: "Mahesh Deshmukh",
      nameMr: "महेश देशमुख",
      mobile: "9822011223",
      email: "mahesh.deshmukh@rajtantra.in",
      role: KaryakartaRole.boothPresident,
      status: KaryakartaStatus.onDuty,
      assignedBooth: 42,
      assignedPrabhaag: 14,
      targetSurveys: 1180,
      completedSurveys: 1045,
      todaySurveys: 28,
      distributedSlips: 940,
      totalSlips: 1180,
      lastActiveLocation: "Shaniwar Wada Chowk (GPS Locked)",
      lastActiveTime: "Active 4m ago",
      latitude: 18.5196,
      longitude: 73.8553,
      isAlertInactive: false,
    ),

    const KaryakartaModel(
      id: "KAR-104-02",
      name: "Suresh Gaikwad",
      nameMr: "सुरेश गायकवाड",
      mobile: "9822044556",
      email: "suresh.gaikwad@rajtantra.in",
      role: KaryakartaRole.fieldSurveyor,
      status: KaryakartaStatus.onDuty,
      assignedBooth: 104,
      assignedPrabhaag: 14,
      targetSurveys: 1240,
      completedSurveys: 918,
      todaySurveys: 19,
      distributedSlips: 710,
      totalSlips: 1240,
      lastActiveLocation: "Kasba Ganpati Temple Lane",
      lastActiveTime: "Active 12m ago",
      latitude: 18.5204,
      longitude: 73.8567,
      isAlertInactive: false,
    ),

    const KaryakartaModel(
      id: "KAR-015-01",
      name: "Anand Shinde",
      nameMr: "आनंद शिंदे",
      mobile: "9822099001",
      email: "anand.shinde@rajtantra.in",
      role: KaryakartaRole.boothPresident,
      status: KaryakartaStatus.onDuty,
      assignedBooth: 15,
      assignedPrabhaag: 12,
      targetSurveys: 1050,
      completedSurveys: 955,
      todaySurveys: 34,
      distributedSlips: 880,
      totalSlips: 1050,
      lastActiveLocation: "Budhwar Peth Health Center",
      lastActiveTime: "Active 2m ago",
      latitude: 18.5178,
      longitude: 73.8580,
      isAlertInactive: false,
    ),

    const KaryakartaModel(
      id: "KAR-162-01",
      name: "Dattatray Pawar",
      nameMr: "दत्तात्रय पवार",
      mobile: "9822033445",
      email: "dattatray.pawar@rajtantra.in",
      role: KaryakartaRole.fieldSurveyor,
      status: KaryakartaStatus.onDuty,
      assignedBooth: 162,
      assignedPrabhaag: 15,
      targetSurveys: 1320,
      completedSurveys: 825,
      todaySurveys: 14,
      distributedSlips: 620,
      totalSlips: 1320,
      lastActiveLocation: "Mangalwar Peth ZP School",
      lastActiveTime: "Active 18m ago",
      latitude: 18.5240,
      longitude: 73.8610,
      isAlertInactive: false,
    ),

    const KaryakartaModel(
      id: "KAR-078-01",
      name: "Kishor Jadhav",
      nameMr: "किशोर जाधव",
      mobile: "9822077889",
      email: "kishor.jadhav@rajtantra.in",
      role: KaryakartaRole.boothPresident,
      status: KaryakartaStatus.offDuty,
      assignedBooth: 78,
      assignedPrabhaag: 13,
      targetSurveys: 980,
      completedSurveys: 404,
      todaySurveys: 0,
      distributedSlips: 310,
      totalSlips: 980,
      lastActiveLocation: "Raviwar Peth Market Library",
      lastActiveTime: "Offline (Last seen 3h ago)",
      isAlertInactive: false,
    ),

    const KaryakartaModel(
      id: "KAR-198-01",
      name: "Nilesh Kulkarni",
      nameMr: "निलेश कुलकर्णी",
      mobile: "9822055667",
      email: "nilesh.kulkarni@rajtantra.in",
      role: KaryakartaRole.fieldSurveyor,
      status: KaryakartaStatus.inactive,
      assignedBooth: 198,
      assignedPrabhaag: 16,
      targetSurveys: 1110,
      completedSurveys: 422,
      todaySurveys: 0,
      distributedSlips: 240,
      totalSlips: 1110,
      lastActiveLocation: "Bhavani Peth Vyapari Bhavan",
      lastActiveTime: "No activity in past 52 hours!",
      isAlertInactive: true,
    ),
  ];

  static final List<UpdateRequestModel> updateRequests = [
    const UpdateRequestModel(
      id: "REQ-2026-0042",
      voterId: "VOT-042-0012",
      voterName: "Rajesh Vithal Patil",
      voterNameMr: "राजेश विठ्ठल पाटील",
      boothNumber: 42,
      serialNumber: "012",
      karyakartaName: "Mahesh Deshmukh",
      karyakartaPhone: "9822011223",
      fieldType: UpdateFieldType.mobileNumber,
      fieldLabel: "Voter Mobile Number",
      oldValue: "+91 98221 11221",
      newValue: "+91 98999 55443",
      reason: "Citizen changed primary SIM card last month. Verified during doorstep verification.",
      submittedAt: "Today, 11:30 AM",
      status: UpdateRequestStatus.pending,
    ),

    const UpdateRequestModel(
      id: "REQ-2026-0089",
      voterId: "VOT-104-0089",
      voterName: "Suresh Anant Gaikwad",
      voterNameMr: "सुरेश अनंत गायकवाड",
      boothNumber: 104,
      serialNumber: "089",
      karyakartaName: "Suresh Gaikwad",
      karyakartaPhone: "9822044556",
      fieldType: UpdateFieldType.sentimentChanged,
      fieldLabel: "Political Stance",
      oldValue: "Swing Voter (डळमळीत)",
      newValue: "Confirmed Supporter (अनुकूल)",
      reason: "Candidate personally visited wada meeting yesterday. Citizen family confirmed 100% vote commitment.",
      submittedAt: "Today, 10:15 AM",
      status: UpdateRequestStatus.pending,
    ),

    const UpdateRequestModel(
      id: "REQ-2026-0145",
      voterId: "VOT-078-0145",
      voterName: "Ganesh Anant Kulkarni",
      voterNameMr: "गणेश अनंत कुलकर्णी",
      boothNumber: 78,
      serialNumber: "145",
      karyakartaName: "Kishor Jadhav",
      karyakartaPhone: "9822077889",
      fieldType: UpdateFieldType.addressShifted,
      fieldLabel: "Residential Address",
      oldValue: "House #145, Sonya Maruti Chowk",
      newValue: "House #204, Venkatesh Heritage 2nd Floor",
      reason: "Shifted residence permanently to newly built apartment complex. Polling booth remains same.",
      submittedAt: "Yesterday, 04:45 PM",
      status: UpdateRequestStatus.pending,
    ),

    const UpdateRequestModel(
      id: "REQ-2026-0198",
      voterId: "VOT-198-0412",
      voterName: "Tukaram Bhiva Kamble",
      voterNameMr: "तुकाराम भिवा कांबळे",
      boothNumber: 198,
      serialNumber: "410",
      karyakartaName: "Nilesh Kulkarni",
      karyakartaPhone: "9822055667",
      fieldType: UpdateFieldType.deceasedVoter,
      fieldLabel: "Electoral Roll Vital Status",
      oldValue: "Active Registered Voter",
      newValue: "DECEASED (मयत मतदार)",
      reason: "Passed away in October 2025. Death certificate verified by Karyakarta with local ward office.",
      submittedAt: "08 Feb 2026, 02:15 PM",
      status: UpdateRequestStatus.pending,
    ),
  ];

  static final List<PhoneBookContact> phoneBookContacts = [
    // Core Committee
    const PhoneBookContact(
      id: "CON-01",
      name: "Adv. Diliprao Thorat",
      designation: "Chief Campaign Strategist",
      category: "Core Strategy",
      phone: "+91 98220 90001",
      location: "Central Election War Room",
      isPriority: true,
    ),
    const PhoneBookContact(
      id: "CON-02",
      name: "Prof. Sudhir Joshi",
      designation: "Data Intelligence Head",
      category: "Core Strategy",
      phone: "+91 98220 90002",
      location: "Analytics Desk, Pune",
      isPriority: true,
    ),

    // Booth Presidents
    const PhoneBookContact(
      id: "CON-03",
      name: "Mahesh Deshmukh",
      designation: "Booth President (#42)",
      category: "Booth Presidents",
      phone: "+91 98220 11223",
      location: "Shaniwar Peth",
      isPriority: true,
    ),
    const PhoneBookContact(
      id: "CON-04",
      name: "Anand Shinde",
      designation: "Booth President (#15)",
      category: "Booth Presidents",
      phone: "+91 98220 99001",
      location: "Budhwar Peth",
    ),
    const PhoneBookContact(
      id: "CON-05",
      name: "Kishor Jadhav",
      designation: "Booth President (#78)",
      category: "Booth Presidents",
      phone: "+91 98220 77889",
      location: "Raviwar Peth",
    ),

    // Prabhaag Leads
    const PhoneBookContact(
      id: "CON-06",
      name: "Vinayak Jagtap",
      designation: "Prabhaag Incharge (Prabhaag 14)",
      category: "Prabhaag Leads",
      phone: "+91 98220 88771",
      location: "Kasba - Shaniwar Corridor",
      isPriority: true,
    ),
    const PhoneBookContact(
      id: "CON-07",
      name: "Smt. Sunita Bhosale",
      designation: "Mahila Aghadi Incharge",
      category: "Prabhaag Leads",
      phone: "+91 98220 88772",
      location: "Bhavani - Nana Peth Corridor",
    ),

    // Government BLOs
    const PhoneBookContact(
      id: "CON-08",
      name: "Shri. Prakash Salunkhe",
      designation: "Govt BLO (Booths 40-45)",
      category: "Government BLO",
      phone: "+91 98220 77112",
      location: "Kasba Electoral Registration Office",
    ),
    const PhoneBookContact(
      id: "CON-09",
      name: "Smt. Manisha More",
      designation: "Govt BLO (Booths 100-106)",
      category: "Government BLO",
      phone: "+91 98220 77114",
      location: "Pune City Tahsil Office",
    ),

    // Legal & Election Desk
    const PhoneBookContact(
      id: "CON-10",
      name: "Adv. Rohidas Kadam",
      designation: "Chief Legal & Returning Officer Liaison",
      category: "Legal & Admin",
      phone: "+91 98220 66554",
      location: "District Court Pune",
      isPriority: true,
    ),
  ];
}
