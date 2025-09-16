import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useLang } from "../context/LangContext";
import { useAuth } from "../context/AuthContext";

const COLORS = {
  white: "#fff",
  black: "#000",
  green: "#2e7d32"
};

export default function CustomDrawer(props: any) {
  const { navigation } = props;
  const { lang, setLang } = useLang();
  const { user, logout } = useAuth();

  const filters = ["Beer", "Wine", "Peroni"];

  return (
    <View style={{ flex: 1, justifyContent: "space-between" }}>
      <DrawerContentScrollView {...props}>

        {/* User info */}
        <View style={styles.userBox}>
          <FontAwesome name="user-circle" size={24} color={COLORS.black} style={{ marginRight: 8 }}/>
          <Text style={styles.userText}>{user?.email || "Guest"}</Text>
        </View>

        {/* Language selector */}
        <View style={styles.langRow}>
          {["en", "it", "ar"].map((lng) => (
            <Pressable
              key={lng}
              onPress={() => setLang(lng)}
              style={[styles.langBtn, lang === lng && styles.langBtnActive]}
            >
              <Text style={[styles.langTxt, lang === lng && styles.langTxtActive]}>{lng.toUpperCase()}</Text>
            </Pressable>
          ))}
        </View>

        {/* Filters */}
        <View style={styles.filterBox}>
          {filters.map((f) => (
            <Pressable
              key={f}
              style={({ pressed }) => [
                styles.filterBtn,
                pressed && { opacity: 0.7 }
              ]}
              onPress={() => console.log("filter", f)}
            >
              <Text style={styles.filterTxt}>{f}</Text>
            </Pressable>
          ))}
        </View>
      </DrawerContentScrollView>

      {/* Logout row */}
      <View style={styles.logoutRow}>
        <Pressable style={styles.logoutBtn} onPress={logout}>
          <MaterialIcons name="logout" size={18} color={COLORS.white} />
          <Text style={styles.logoutTxt}>Logout</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  userBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#ccc"
  },
  userText: {
    fontWeight: "600",
    fontSize: 14,
    color: COLORS.black
  },
  langRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: 10
  },
  langBtn: {
    borderWidth: 1,
    borderColor: COLORS.black,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    backgroundColor: COLORS.white
  },
  langTxt: {
    color: COLORS.black,
    fontWeight: "600"
  },
  langBtnActive: {
    backgroundColor: COLORS.green
  },
  langTxtActive: {
    color: COLORS.white
  },
  filterBox: {
    padding: 10
  },
  filterBtn: {
    marginVertical: 6,
    padding: 10,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.black
  },
  filterTxt: {
    fontWeight: "600",
    color: COLORS.black
  },
  logoutRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "#ccc"
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.black,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  logoutTxt: {
    color: COLORS.white,
    marginLeft: 6,
    fontWeight: "600"
  }
});

// === Aggiornamento stili richiesti ===
const updatedStyles = StyleSheet.create({
  langRow: {
    flexDirection: "row",
    justifyContent: "flex-start", // allinea a sinistra
    padding: 10
  },
  langBtn: {
    borderWidth: 1,
    borderColor: COLORS.black,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    backgroundColor: COLORS.white
  },
  langTxt: {
    color: COLORS.black,
    fontWeight: "600"
  },
  langBtnActive: {
    backgroundColor: COLORS.green
  },
  langTxtActive: {
    color: COLORS.white
  },
  filterBtn: {
    marginVertical: 6,
    padding: 10,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.black
  },
  filterTxt: {
    fontWeight: "600",
    color: COLORS.black
  },
  logoutRow: {
    flexDirection: "row",
    justifyContent: "flex-end", // in basso a destra
    padding: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "#ccc"
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.black,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  logoutTxt: {
    color: COLORS.white,
    marginLeft: 6,
    fontWeight: "600"
  }
});
