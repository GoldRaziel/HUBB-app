import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { Platform } from "react-native";

let authInitDone = false;
let auth: import("firebase/auth").Auth;

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

// Web: getAuth standard
// Native (Expo/React Native): initializeAuth + AsyncStorage persistence
if (Platform.OS === "web") {
  auth = getAuth(app);
  authInitDone = true;
} else {
  // lazy import per evitare bundling web
  // @ts-ignore
  const { initializeAuth, getReactNativePersistence } = require("firebase/auth");
  // @ts-ignore
  const ReactNativeAsyncStorage = require("@react-native-async-storage/async-storage").default;
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
  authInitDone = true;
}

export { app, auth };
