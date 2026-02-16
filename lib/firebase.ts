/* eslint-disable @typescript-eslint/no-require-imports -- getReactNativePersistence from @firebase/auth RN build */
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, initializeAuth, type Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

// Firebase client config (public keys are safe to expose; use env vars if you prefer)
const firebaseConfig = {
  apiKey: "AIzaSyAjcnTLmIcnPAFwpyTcRpK7sdmsLp4ycyc",
  authDomain: "asianlestaff.firebaseapp.com",
  projectId: "asianlestaff",
  storageBucket: "asianlestaff.firebasestorage.app",
  messagingSenderId: "510736376525",
  appId: "1:510736376525:web:628dce17d5cc4afe8a3f84",
  measurementId: "G-7478CR3VZF",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

let auth: Auth;
if (Platform.OS === "web") {
  auth = getAuth(app);
} else {
  const { getReactNativePersistence } = require("@firebase/auth");
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
}

export const db = getFirestore(app);
export { auth };
