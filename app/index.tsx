import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const COLORS = {
  white: "#ffffff",
  ochre: "#C88C00",
  burgundy: "#7A0026",
  black: "#111111",
  gray: "#666666",
};

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>HUBB</Text>

      <Text style={styles.title}>What are you in the mood for?</Text>
      <Text style={styles.subtitle}>Beer or Wine?</Text>

      <View style={styles.choiceRow}>
        <TouchableOpacity style={styles.choiceCard} onPress={() => router.push("/home?mode=beer")}>
          <View style={styles.circleIcon}><Text style={styles.circleIconText}>🍺</Text></View>
          <Text style={styles.choiceText}>Beer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.choiceCard} onPress={() => router.push("/home?mode=wine")}>
          <View style={styles.circleIcon}><Text style={styles.circleIconText}>🍷</Text></View>
          <Text style={styles.choiceText}>Wine</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.authBox}>
        <TouchableOpacity style={styles.googleBtn} onPress={() => router.push("/home")}>
          <Text style={styles.googleBtnText}>Continue with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.emailBtn} onPress={() => router.push("/home")}>
          <Text style={styles.emailBtnText}>Continue with Email</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footerNote}>By continuing, you agree to our Terms & Privacy.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, alignItems: "center", justifyContent: "center", paddingHorizontal: 24, gap: 12 },
  logo: { fontSize: 36, fontWeight: "800", letterSpacing: 2, color: COLORS.black, marginBottom: 8 },
  title: { fontSize: 18, color: COLORS.black, fontWeight: "700" },
  subtitle: { fontSize: 16, color: COLORS.gray, marginBottom: 8 },
  choiceRow: { flexDirection: "row", gap: 16, marginVertical: 12 },
  choiceCard: { backgroundColor: "#FFF7E5", borderRadius: 16, paddingVertical: 16, paddingHorizontal: 22, alignItems: "center", borderWidth: 1, borderColor: "#FFE2A8" },
  circleIcon: { width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.ochre, marginBottom: 8 },
  circleIconText: { fontSize: 28, color: COLORS.white },
  choiceText: { fontSize: 16, fontWeight: "700", color: COLORS.black },
  authBox: { width: "100%", gap: 10, marginTop: 18 },
  googleBtn: { backgroundColor: COLORS.black, paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  googleBtnText: { color: COLORS.white, fontWeight: "700" },
  emailBtn: { backgroundColor: COLORS.ochre, paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  emailBtnText: { color: COLORS.white, fontWeight: "700" },
  footerNote: { marginTop: 8, fontSize: 12, color: COLORS.gray },
});
