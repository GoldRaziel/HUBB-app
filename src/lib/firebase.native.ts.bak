import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, initializeAuth, type Auth } from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Config Web del tuo progetto
const firebaseConfig = {
  apiKey: "AIzaSyA3Ru7RWUl-Dhlf2rgRgevOd58whtDUjVw",
  authDomain: "hubb-prod-11b40.firebaseapp.com",
  projectId: "hubb-prod-11b40",
  storageBucket: "hubb-prod-11b40.firebasestorage.app",
  messagingSenderId: "442951244084",
  appId: "1:442951244084:web:a996b705b0ca66fb756d61"
};

let app: FirebaseApp;
let auth: Auth;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  app = getApps()[0]!;
  auth = getAuth(app);
}

export { app, auth };
