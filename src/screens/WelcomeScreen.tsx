import React from "react";
import { View, Text, Button } from "react-native";

export default function WelcomeScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1, padding: 24, gap: 16, justifyContent: "center" }}>
      <Text style={{ fontSize: 28, fontWeight: "700", textAlign: "center" }}>
        What are you in the mood for?
      </Text>
      <Text style={{ fontSize: 16, opacity: 0.8, textAlign: "center" }}>
        Beer or Wine? First, sign in or create your account.
      </Text>

      <View style={{ gap: 12, marginTop: 16 }}>
        <Button title="Accedi con email" onPress={() => navigation.navigate("SignIn")} />
        <Button title="Registrati con email" onPress={() => navigation.navigate("SignUp")} />
      </View>
    </View>
  );
}
