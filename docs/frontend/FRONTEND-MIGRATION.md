# Frontend Migration: React Native (Expo) Migration Report

## Overview
This document records the migration of the active frontend in the Sakhi project from the legacy React 19 / Vite web client to the React Native (Expo SDK 57) mobile application.

---

## 1. Migration Metadata
- **Migration Branch**: `frontend-rn-migration`
- **Source Branch**: `native` (`origin/native`)
- **Active Frontend Path**: `frontend/` (React Native + Expo Router)
- **Archived Web Frontend Path**: `frontend-web-archive/` (Legacy React/Vite web application, preserved 1:1 for reference)
- **FastAPI Backend Path**: `backend/` (**100% READ-ONLY / UNTOUCHED**)

---

## 2. Technology Stack & Key Versions

| Component | Framework / Library | Version |
| :--- | :--- | :--- |
| **Framework** | Expo SDK | `~57.0.24` |
| **Mobile Runtime** | React Native | `0.86.3` |
| **Core UI Library** | React | `19.2.3` |
| **Routing** | Expo Router | `~57.0.22` |
| **Styling** | NativeWind / TailwindCSS | `^4.2.7` / `^3.4.17` |
| **Type System** | TypeScript | `~6.0.3` |
| **Animations** | React Native Reanimated | `4.5.1` |
| **Icons & Symbols** | `@expo/vector-icons`, `expo-symbols` | `^15.0.2`, `~57.0.3` |

---

## 3. Project Structure

```text
sakhi/
├── backend/                       # Complete FastAPI Backend (READ-ONLY, UNTOUCHED)
│   ├── app/
│   ├── tests/
│   └── ...
│
├── frontend/                      # Active Frontend (React Native + Expo)
│   ├── app/                       # Expo Router file-based routes
│   │   ├── _layout.tsx            # Root Stack Navigator
│   │   ├── (tabs)/                # Bottom Tabs Navigation (5 tabs)
│   │   │   ├── _layout.tsx        # Tab bar configuration & styling
│   │   │   ├── index.tsx          # Home / Overview tab
│   │   │   ├── money.tsx          # Cashflow tab
│   │   │   ├── goals.tsx          # Dream Pots / Goals tab
│   │   │   ├── schemes.tsx        # Benefits & Government Schemes tab
│   │   │   ├── journey.tsx        # 7-Stage Financial Roadmap tab
│   │   │   └── learn.tsx          # Audio/Video Financial Learning tab
│   │   ├── splash.tsx             # Animated Splash Screen
│   │   ├── onboarding.tsx         # User Onboarding Flow
│   │   ├── matcher.tsx            # Scheme Matcher Wizard
│   │   ├── settings.tsx           # User Settings / Preferences
│   │   ├── tour.tsx               # Guided App Tour
│   │   └── modal.tsx              # Generic Modal Stack Route
│   ├── components/                # Reusable React Native UI Components
│   ├── constants/                 # Theme tokens, colors, typography
│   ├── context/                   # AppContext & local state management
│   ├── assets/                    # App icons, splash images, local media
│   ├── global.css                 # NativeWind base styles
│   ├── tailwind.config.js         # Tailwind theme & color definitions
│   ├── metro.config.js            # Metro bundler config with NativeWind
│   ├── babel.config.js            # Babel preset for Expo & NativeWind
│   ├── app.json                   # Expo application manifest
│   ├── tsconfig.json              # TypeScript configuration
│   └── package.json               # Frontend dependencies & scripts
│
├── frontend-web-archive/          # Inactive Archive of Legacy Web Frontend
│   ├── src/                       # Legacy React web components & pages
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── docs/                          # Architecture & Migration Documentation
│   ├── backend/
│   └── frontend/
│       └── FRONTEND-MIGRATION.md
│
└── .gitignore                     # Repository ignore rules (including Expo and archive caches)
```

---

## 4. Frontend Startup & Run Commands

All commands should be executed from within the `frontend/` directory:

```bash
cd frontend

# Install dependencies (already installed during migration)
npm install

# Start the Expo development server (Metro bundler)
npm start
# or
npx expo start

# Run on Android Emulator / Device
npm run android
# or
npx expo start --android

# Run on iOS Simulator (macOS)
npm run ios
# or
npx expo start --ios

# Run in Web Browser
npm run web
# or
npx expo start --web
```

---

## 5. Migration Verification Results

### A. TypeScript Compilation Check
- **Command**: `npx tsc --noEmit`
- **Result**: Passed with exit code `0`. Zero type errors.

### B. Expo Configuration Validation
- **Command**: `npx expo config --type public`
- **Result**: Valid configuration loaded successfully (`sdkVersion: 57.0.0`, `scheme: swapp`, `typedRoutes: true`).

### C. Route & Navigation Architecture
- **Root Stack**: `app/_layout.tsx` defines top-level screens (`(tabs)`, `splash`, `onboarding`, `matcher`, `settings`, `tour`, `modal`).
- **Bottom Tabs**: `app/(tabs)/_layout.tsx` configures bottom tabs for Home (`index`), Money (`money`), Goals (`goals`), Schemes (`schemes`), Journey (`journey`), Learn (`learn`).

### D. Asset & Styling Configuration
- NativeWind v4 preset configured in `metro.config.js` and `babel.config.js`.
- Custom color palette, typography, and container styles defined in `tailwind.config.js`.

---

## 6. Backend Integrity Verification

- **Git Status on `backend/`**: Zero changes.
- `backend/` directory remains **100% intact, untouched, and read-only**.
- No Python files, schemas, APIs, migrations, or database configurations were modified.

---

## 7. Status of API Integration

> [!IMPORTANT]
> **API Integration has NOT been started.**
> - The React Native frontend in `frontend/` currently utilizes local/in-memory state via `AppContext.tsx` and built-in mock structures.
> - No network calls to FastAPI (`http://localhost:8000`) or Gemini endpoints have been added.
> - Frontend ↔ Backend integration will take place in the subsequent phase.
