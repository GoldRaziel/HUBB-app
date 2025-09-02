// src/screens/HomeScreen.tsx
import React from "react";
import { View, Text, Button } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function HomeScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={{ flex: 1, padding: 20, gap: 12, justifyContent: "center" }}>
      <Text style={{ fontSize: 20 }}>Benvenuto su HUBB 👋</Text>
      <Text style={{ opacity: 0.7 }}>Email: {user?.email}</Text>
      <Button title="Esci" onPress={logout} />
    </View>
  );
}
