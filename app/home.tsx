import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const COLORS = {
  white: "#ffffff",
  ochre: "#C88C00",
  burgundy: "#7A0026",
  black: "#111111",
  gray: "#666666",
};

export default function HomeScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HUBB – Home</Text>
      <Text style={styles.subtitle}>Mode: {mode ?? "both"}</Text>

      <View style={styles.filtersRow}>
        <TouchableOpacity style={[styles.pill, styles.pillActive]}>
          <Text style={styles.pillText}>Beer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.pill}>
          <Text style={styles.pillText}>Wine</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.pill}>
          <Text style={styles.pillText}>Both</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.note}>
        Qui inseriremo: barra ricerca, filtri brand, switch “Near me”, lista locali con distanza e icone (draft/can/glass/bottle).
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, padding: 20 },
  title: { fontSize: 24, fontWeight: "800", color: COLORS.black },
  subtitle: { fontSize: 14, color: COLORS.gray, marginBottom: 16 },
  filtersRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  pill: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1, borderColor: "#E5E5E5", backgroundColor: "#F9F9F9" },
  pillActive: { backgroundColor: COLORS.ochre, borderColor: COLORS.ochre },
  pillText: { color: COLORS.black, fontWeight: "700" },
  note: { color: COLORS.gray, lineHeight: 20 },
});
