# RAJTANTRA Candidate Mobile Application

**Product:** RAJTANTRA Election Management & Campaign Intelligence Platform  
**Target:** Candidate Mobile Application (War Room Command Center)  
**Framework:** Flutter (Dart 3.5.4, Material 3)  
**Package:** `in.indiata.mobile_candidate`  

---

## Architecture Overview

```
apps/mobile-candidate/
├── android/                             # Isolated Android app module & build configs
├── ios/                                 # Isolated iOS app module
├── lib/
│   ├── main.dart                        # Application bootstrap
│   ├── app/
│   │   ├── candidate_app.dart           # MaterialApp root with dynamic ThemeMode
│   │   └── routes.dart                  # Named routing table
│   ├── core/
│   │   ├── constants/app_constants.dart # App constants, constituency defaults
│   │   ├── theme/candidate_theme.dart   # Executive Candidate Design System
│   │   └── components/                  # Reusable UI widgets (KpiCard, StatusPill, AppBar)
│   ├── navigation/
│   │   ├── main_navigation_scaffold.dart # 5-Tab Persistent Navigation Shell
│   │   └── candidate_drawer.dart        # Executive Drawer
│   └── features/
│       ├── dashboard/                   # Home: War Room Dashboard & Telemetry
│       ├── voters/                      # Voters: 22 Quick Filters, Directory, Dossier
│       ├── field_operations/            # Field: Live Map, Workforce, Booth Directory
│       ├── campaigns/                   # Campaign: Broadcast Control & Composer
│       └── more/                        # More: Full 18-Module Management Suite
```

## How to Run

### In Chrome (Web Mode):
```powershell
cd apps/mobile-candidate
flutter run -d chrome
```

### Build Android APK:
```powershell
cd apps/mobile-candidate
flutter build apk --debug
```
The APK output is saved at:
`apps/mobile-candidate/build/app/outputs/flutter-apk/app-debug.apk`
