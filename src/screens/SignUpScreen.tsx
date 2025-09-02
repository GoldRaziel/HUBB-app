// src/screens/SignUpScreen.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function SignUpScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSignUp = async () => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      try { await sendEmailVerification(cred.user); } catch {}
      Alert.alert("Registrazione ok", "Controlla l’email per verificare l’account.");
      navigation.navigate("SignIn");
    } catch (e: any) {
      Alert.alert("Errore registrazione", e.message);
    }
  };

  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "600" }}>Crea un account</Text>
      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
      />
      <Button title="Registrati" onPress={onSignUp} />
      <Text onPress={() => navigation.navigate("SignIn")} style={{ color: "#0a84ff", marginTop: 10 }}>
        Hai già un account? Accedi
      </Text>
    </View>
  );
}
