import React, { useEffect, useState, useCallback } from "react";
import {
  View, Text, Pressable, ActivityIndicator, Alert,
  TextInput, Image, Platform, I18nManager, StyleSheet,
} from "react-native";
import {
  onAuthStateChanged, signOut, User, GoogleAuthProvider,
  signInWithCredential, signInWithEmailAndPassword,
  setPersistence, browserLocalPersistence,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { useLang } from "../context/LangContext";
import LangSelector from "../components/LangSelector";

// Testi EN default + IT/AR
type Lang = "en" | "it" | "ar";
const STRINGS: Record<Lang, any> = {
  en: {
    title: "Sign in or Register",
    emailLabel: "Email",
    passwordLabel: "Password",
    continueWithEmail: "Continue with email",
    continueWithGoogle: "Continue with Google",
    welcome: "Welcome",
    signOut: "Sign out",
    emailPlaceholder: "you@example.com",
  },
  it: {
    title: "Accedi o Registrati",
    emailLabel: "Email",
    passwordLabel: "Password",
    continueWithEmail: "Continua con email",
    continueWithGoogle: "Continua con Google",
    welcome: "Benvenuto",
    signOut: "Esci",
    emailPlaceholder: "tu@esempio.com",
  },
  ar: {
    title: "سجّل الدخول أو أنشئ حسابًا",
    emailLabel: "البريد الإلكتروني",
    passwordLabel: "كلمة المرور",
    continueWithEmail: "تابع عبر البريد الإلكتروني",
    continueWithGoogle: "تابع باستخدام Google",
    welcome: "مرحبًا",
    signOut: "تسجيل الخروج",
    emailPlaceholder: "you@example.com",
  },
};

const COLORS = {
  gold: "#D4AF37",
  white: "#FFFFFF",
  black: "#000000",
  googleText: "#3c4043",
  googleBorder: "#dadce0",
  muted: "#8A8F98",
};

export default function WelcomeScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { lang, isRTL } = useLang();
  const T = STRINGS[lang];

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  // Abilita RTL su native (web gestito via style)
  useEffect(() => {
    const wantRTL = lang === "ar";
    if (I18nManager.isRTL !== wantRTL && Platform.OS !== "web") {
      try { I18nManager.allowRTL(wantRTL); I18nManager.forceRTL(wantRTL); } catch {}
    }
  }, [lang]);

  const EXPO_CLIENT_ID = "442951244084-lj40t8dv4lh7vke5tliijk6ke9pf94ss.apps.googleusercontent.com";
  const WEB_CLIENT_ID  = "442951244084-1ujfjj5cvi06hd6jdknuq11j0r2u67ro.apps.googleusercontent.com";
// 
//     expoClientId: EXPO_CLIENT_ID,
//     webClientId: WEB_CLIENT_ID,
//   });
// 
    const handleGoogle = useCallback(async () => {
//     try {
//       if (!request) return;
      setBusy(true);
        try {
          await signInWithPopup(auth, provider);
          // TODO: naviga alla Home
        } catch (e) {
          console.error(e);
          alert("Login failed");
        }
    }, []);

  const handleEmailLogin = useCallback(async () => {
    if (!email || !password) {
      Alert.alert(T.continueWithEmail, lang === "it" ? "Inserisci email e password." : lang === "ar" ? "يرجى إدخال البريد الإلكتروني وكلمة المرور." : "Enter email and password.");
      return;
    }
    try {
      setBusy(true);
      if (Platform.OS === "web") { try { await setPersistence(auth, browserLocalPersistence); } catch {} }
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (e: any) {
      Alert.alert(T.continueWithEmail, e?.message || "Invalid credentials");
    } finally {
      setBusy(false);
    }
  }, [email, password, lang]);

  if (user) {
    return (
      <View style={[styles.container, isRTL && styles.rtl]}>
        <LangSelector />
        <Image source={require("../../assets/Logo.png")} resizeMode="contain" style={styles.logo}/>
        <Text style={styles.title}>{T.welcome}</Text>
        <Text style={styles.subtitle}>{user.email || user.displayName || "User"}</Text>
        <Pressable onPress={() => signOut(auth)} style={[styles.buttonBase, styles.btnRed]}>
          <Text style={styles.btnTextWhite}>{T.signOut}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, isRTL && styles.rtl]}>
      <LangSelector />

      <Image source={require("../../assets/Logo.png")} resizeMode="contain" style={styles.logo}/>
      <Text style={styles.title}>{T.title}</Text>

      {/* Email / Password */}
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{T.emailLabel}</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder={T.emailPlaceholder}
            placeholderTextColor={COLORS.muted}
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{T.passwordLabel}</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            secureTextEntry
            placeholder="••••••••"
            placeholderTextColor={COLORS.muted}
            style={styles.input}
          />
        </View>

        <Pressable disabled={busy} onPress={handleEmailLogin} style={[styles.buttonBase, styles.btnGreen, busy && styles.btnDisabled]}>
          {busy ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.btnTextWhite}>{T.continueWithEmail}</Text>}
        </Pressable>
      </View>

      {/* Google style button */}
      <Pressable disabled={!request || busy} onPress={handleGoogle} style={[styles.googleBtn, (!request || busy) && styles.btnDisabled]}>
        <Image source={{ uri: "https://developers.google.com/identity/images/g-logo.png" }} style={styles.googleIcon}/>
        <Text style={styles.googleText}>{T.continueWithGoogle}</Text>
      </Pressable>
    </View>
  );

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: COLORS.black,
    paddingHorizontal: 24, paddingVertical: 32,
    alignItems: "center", justifyContent: "center",
  },
  rtl: { direction: "rtl" as any, writingDirection: "rtl" as any },
  logo: { width: 140, height: 140, marginBottom: 12 },
  title: { fontSize: 24, fontWeight: "800", color: COLORS.white, textAlign: "center", marginBottom: 18 },
  subtitle: { fontSize: 14, color: COLORS.white, opacity: 0.9, textAlign: "center", marginBottom: 20 },
  form: { width: "100%", maxWidth: 420, marginBottom: 16 },
  inputGroup: { marginBottom: 12 },
  label: { color: COLORS.gold, marginBottom: 6, fontWeight: "600" },
  input: {
    backgroundColor: COLORS.white, color: "#111",
    paddingHorizontal: 14, paddingVertical: Platform.OS === "web" ? 12 : 10,
    borderRadius: 999, borderWidth: 1, borderColor: COLORS.googleBorder,
  },
  buttonBase: {
    width: "100%", maxWidth: 420, paddingVertical: 14, borderRadius: 999,
    alignItems: "center", justifyContent: "center", marginTop: 8,
  },
  btnGreen: { backgroundColor: "#009639" },
  btnRed: { backgroundColor: "#EF3340", marginTop: 22 },
  btnDisabled: { opacity: 0.6 },
  btnTextWhite: { color: COLORS.white, fontWeight: "700", letterSpacing: 0.3 },
  googleBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 as any,
    width: "100%", maxWidth: 420, height: 48, backgroundColor: COLORS.white,
    borderRadius: 999, borderWidth: 1, borderColor: COLORS.googleBorder, marginTop: 10, paddingHorizontal: 14,
  },
  googleIcon: { width: 18, height: 18, marginRight: 8 },
  googleText: { color: "#3c4043", fontWeight: "600" },
});
}
