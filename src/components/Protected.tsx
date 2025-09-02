// src/components/Protected.tsx
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/AuthContext";

const Protected: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!user) return null;

  return <>{children}</>;
};

export default Protected;
