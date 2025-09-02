
import React from "react";
import { View, Text, Button, Image } from "react-native";
import { colors } from "../theme/colors";


export default function WelcomeScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 24, gap: 16, justifyContent: "center" }}>
      <Image
        source={require("../../assets/Logo.png")}
        style={{ width: 200, height: 200, alignSelf: "center", marginBottom: 20 }}
        resizeMode="contain"
      />
      <Text style={{ fontSize: 28, fontWeight: "700", textAlign: "center", color: colors.text }}>
        What are you in the mood for?
      </Text>
      <Text style={{ fontSize: 16, opacity: 0.8, textAlign: "center", color: colors.accentWhite }}>
        Beer or Wine? First, sign in or create your account.
      </Text>

      <View style={{ gap: 12, marginTop: 16 }}>
        <Button title="Accedi con email" color={colors.accentGreen} onPress={() => navigation.navigate("SignIn")} />
        <Button title="Registrati con email" color={colors.accentRed} onPress={() => navigation.navigate("SignUp")} />
      </View>
    </View>
  );
}
