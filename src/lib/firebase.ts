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
import { firebaseConfig } from "../config/firebaseConfig";

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Base: ottieni l'istanza di Auth
let auth = getAuth(app);

// Nativo: inizializza con persistence React Native (evita import statico)
if (Platform.OS === "ios" || Platform.OS === "android") {
  // Usa eval('require') per NON far risolvere il modulo al bundler web
  const rnAuth = (0, eval)("require")("firebase/auth/react-native");
  const getReactNativePersistence = rnAuth.getReactNativePersistence;

  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  // Web: usa il localStorage del browser
  setPersistence(auth, browserLocalPersistence);
}

export { app, auth };
