import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { Platform } from "react-native";

// Configurazione Firebase (fornita da te)
const firebaseConfig = {
  apiKey: "AIzaSyA3Ru7RWUl-Dhlf2rgRgevOd58whtDUjVw",
  authDomain: "hubb-prod-11b40.firebaseapp.com",
  projectId: "hubb-prod-11b40",
  storageBucket: "hubb-prod-11b40.firebasestorage.app",
  messagingSenderId: "442951244084",
  appId: "1:442951244084:web:a996b705b0ca66fb756d61"
};

// Inizializza l'app
const app = initializeApp(firebaseConfig);

// Auth: web vs native (Expo/React Native)
let auth: import("firebase/auth").Auth;

if (Platform.OS === "web") {
  // Web → normale getAuth
  auth = getAuth(app);
} else {
  // Native → AsyncStorage per persistenza
  // require() per evitare che il bundler web includa moduli RN
  const { initializeAuth, getReactNativePersistence } = require("firebase/auth");
  const ReactNativeAsyncStorage = require("@react-native-async-storage/async-storage").default;
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
}

export { app, auth };
