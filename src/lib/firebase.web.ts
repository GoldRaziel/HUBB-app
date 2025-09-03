import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

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
  auth = getAuth(app);
} else {
  app = getApps()[0]!;
  auth = getAuth(app);
}

export { app, auth };
