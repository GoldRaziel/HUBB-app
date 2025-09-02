// src/screens/SignInScreen.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function SignInScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (e: any) {
      Alert.alert("Errore login", e.message);
    }
  };

  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "600" }}>Accedi a HUBB</Text>
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
      <Button title="Accedi" onPress={onSignIn} />
      <Text onPress={() => navigation.navigate("SignUp")} style={{ color: "#0a84ff", marginTop: 10 }}>
        Non hai un account? Registrati
      </Text>
    </View>
  );
}
