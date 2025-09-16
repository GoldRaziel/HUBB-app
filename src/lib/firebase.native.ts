// @ts-nocheck
import { initializeApp, getApps } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

// Prefer ENV (EXPO_PUBLIC_*) then fallback to app.json/app.config "extra.firebase"
const extra = (Constants.expoConfig?.extra as any) || {};
const extraFirebase = extra.firebase || {};

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? extra.EXPO_PUBLIC_FIREBASE_API_KEY ?? extraFirebase.apiKey,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? extra.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? extraFirebase.authDomain,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? extra.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? extraFirebase.projectId,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? extra.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? extraFirebase.storageBucket,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? extra.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? extraFirebase.messagingSenderId,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? extra.EXPO_PUBLIC_FIREBASE_APP_ID ?? extraFirebase.appId,
};

if (!firebaseConfig.apiKey) {
  console.warn("[HUBB] Firebase apiKey assente. Verifica ENV EXPO_PUBLIC_* o extra.firebase in app.json/app.config.");
}

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
