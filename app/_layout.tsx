import "react-native-gesture-handler";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";

export default function RootLayout() {
  return (
    <>
      <StatusBar style={Platform.OS === "ios" ? "dark" : "auto"} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#ffffff" } }} />
    </>
  );
}
