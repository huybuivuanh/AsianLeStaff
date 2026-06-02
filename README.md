# AsianLeStaff

A React Native mobile app for staff clock-in and shift management, built with Expo.

## Features

- **Access code gate** — one-time code required on first launch, verified against Firestore
- **User login** — select your name from a list, authenticate with a 4-digit PIN
- **Clock in** — record your clock-in time for today's shift; re-clock-in if needed
- **Schedule** — monthly calendar view showing scheduled shifts, break times, and clock-in status; highlights late clock-ins and missed shifts
- **Profile** — view your name and change your PIN
- **Auto logout** — session clears after inactivity
- **Dark mode** — follows system appearance

## Tech Stack

| Layer | Library |
|---|---|
| Framework | Expo (SDK 54) + Expo Router |
| UI | React Native + NativeWind (Tailwind CSS) |
| State | Zustand |
| Backend | Firebase (Firestore) |
| Language | TypeScript |

## Project Structure

```
app/
  access-code.tsx     # One-time access code screen
  user-login.tsx      # User selection + PIN login
  (tabs)/
    index.tsx         # Home — today's shift + clock-in
    schedule.tsx      # Monthly calendar view
    profile.tsx       # Profile + change PIN
components/
  layout/             # SafeAreaViewWrapper, ScreenHeader
  ui/                 # PinModal, ChangePinModal, DayShiftModal
  user/               # UserList
services/
  accessCodeService.ts
  shiftService.ts
  storageService.ts   # AsyncStorage session helpers
  userService.ts
stores/
  shiftStore.ts       # Zustand shift state
  userStore.ts        # Zustand user list state
lib/
  firebase.ts         # Firebase initialisation
utils/
  utils.ts
  validation.ts
```

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo`)
- iOS Simulator / Android Emulator, or physical device with Expo Go

### Install

```bash
npm install
```

### Run

```bash
# Start dev server
npm start

# iOS
npm run ios

# Android
npm run android
```

### Firebase Setup

1. Create a Firebase project and enable Firestore.
2. Add your Firebase config to `lib/firebase.ts`.
3. Set the access code document in Firestore (the app reads it via `accessCodeService`).

### Build (EAS)

```bash
eas build --platform android
eas build --platform ios
```

## Authentication Flow

```
App launch
  └─ Access code verified?
       ├─ No  → Access Code screen → verify against Firestore → store locally
       └─ Yes → User Login screen → select name → enter PIN → Home tabs
```
