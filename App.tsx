import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import SignInScreen from "./src/screens/SignInScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import HomeScreen from "./src/screens/HomeScreen";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import { colors } from "./src/theme/colors";

const Stack = createNativeStackNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    text: colors.text,
    primary: colors.accentRed,
    card: colors.background,
    border: colors.accentGreen,
    notification: colors.accentRed,
  },
};

function RootNavigator() {
  const { user, loading } = useAuth();
  if (loading) return null;

  if (!user) {
    return (
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.background }, headerTintColor: colors.text }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ title: "Welcome" }} />
        <Stack.Screen name="SignIn" component={SignInScreen} options={{ title: "Accedi" }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: "Registrati" }} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.background }, headerTintColor: colors.text }}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: "HUBB" }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer theme={navTheme}>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
