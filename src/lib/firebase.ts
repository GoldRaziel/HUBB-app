// src/lib/firebase.ts
import { Platform } from "react-native";
import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  initializeAuth,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReactNativePersistence } from "firebase/auth/react-native";
import { firebaseConfig } from "../config/firebaseConfig";

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

let auth = getAuth(app);

if (Platform.OS === "ios" || Platform.OS === "android") {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  setPersistence(auth, browserLocalPersistence);
}

export { app, auth };
