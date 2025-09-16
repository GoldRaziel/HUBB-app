import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../lib/firebase";
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import VenueCard from "../components/VenueCard";
import venuesData from "../data/mock_venues.json";
import { BEER_BRANDS } from "../data/brands";
import { haversineKm } from "../utils/distance";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
// import LangSelector from "../components/LangSelector"; // non usato al momento
import { useLang } from "../context/LangContext";

type Lang = "en" | "it" | "ar";
const STR: any = {
  en: {
    home: "Nearby venues",
    search: "Search by name, area...",
    filters: "Filters",
    beer: "Beer",
    wine: "Wine",
    both: "Both",
    cocktail: "Cocktail",
    brands: "Brands",
    near: "Near me",
  },
  it: {
    home: "Locali vicini",
    search: "Cerca per nome, zona...",
    filters: "Filtri",
    beer: "Birra",
    wine: "Vino",
    both: "Entrambi",
    cocktail: "Cocktail",
    brands: "Marche",
    near: "Vicino a me",
  },
  ar: {
    home: "أماكن قريبة",
    search: "ابحث بالاسم أو المنطقة...",
    filters: "فلاتر",
    beer: "بيرة",
    wine: "نبيذ",
    both: "كلاهما",
    cocktail: "كوكتيل",
    brands: "العلامات",
    near: "بالقرب مني",
  },
};

// Etichette multilingua per i titoli del drawer
const LABELS = {
  what: { en: "What are you looking for?", it: "Cosa cerchi?", ar: "ماذا تبحث؟" },
  brand: { en: "Brand", it: "Marchio", ar: "ماركة" },
};

type Venue = {
  id: string;
  name: string;
  address: string;
  phone?: string;
  lat: number;
  lng: number;
  categories: string[];
  brands: string[];
  distanceKm?: number;
};

export default function HomeScreen() {
  const { lang, setLang, isRTL } = useLang();
  const T = STR[lang];

  const [q, setQ] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [nearby, setNearby] = useState(false);
  const [myPos, setMyPos] = useState<{ lat: number; lng: number } | null>(null);
  const [loadingLoc, setLoadingLoc] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const all: Venue[] = venuesData as any;

  useEffect(() => {
    if (!nearby) return;
    (async () => {
      try {
        setLoadingLoc(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setNearby(false);
          return;
        }
        const loc = await Location.getCurrentPositionAsync({});
        setMyPos({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      } finally {
        setLoadingLoc(false);
      }
    })();
  }, [nearby]);

  const data = useMemo(() => {
    let arr = [...all];
    if (myPos)
      arr = arr.map((v) => ({
        ...v,
        distanceKm: haversineKm(myPos, { lat: v.lat, lng: v.lng }),
      }));
    if (q.trim()) {
      const s = q.trim().toLowerCase();
      arr = arr.filter((v) =>
        (v.name + " " + v.address).toLowerCase().includes(s)
      );
    }
    if (selectedTypes.length) {
      arr = arr.filter((v) =>
        selectedTypes.some((t) => v.categories.includes(t))
      );
    }
    if (selectedBrands.length) {
      arr = arr.filter((v) =>
        selectedBrands.every((b) => v.brands.includes(b))
      );
    }
    if (myPos && nearby) {
      arr.sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
    } else {
      arr.sort((a, b) => a.name.localeCompare(b.name));
    }
    return arr;
  }, [all, q, selectedTypes, selectedBrands, myPos, nearby]);

  function toggleBrand(b: string) {
    setSelectedBrands((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    );
  }
  function toggleType(k: "beer" | "wine" | "cocktail") {
    setSelectedTypes((prev) =>
      prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]
    );
  }

  return (
    <View style={[styles.wrap, isRTL && styles.rtl]}>
      <View style={styles.topbar}>
        <Pressable
          onPress={() => setMenuOpen(true)}
          style={styles.hamburgerBtn}
        >
          <Ionicons name="menu" size={18} color="#fff" />
        </Pressable>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#888" />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder={T.search}
            placeholderTextColor="#999"
            style={styles.searchInput}
          />
        </View>

        <View style={styles.filtersRow}>
          {(["beer", "wine", "cocktail"] as const).map((k) => (
            <Pressable
              key={k}
              onPress={() => toggleType(k)}
              style={[styles.pill, selectedTypes.includes(k) && styles.pillActive]}
            >
              <Text
                style={[styles.pillTxt, selectedTypes.includes(k) && styles.pillTxtActive]}
              >
                {T[k]}
              </Text>
            </Pressable>
          ))}
          <Pressable
            onPress={() => setNearby((x) => !x)}
            style={[styles.pill, nearby && styles.pillActive]}
          >
            {loadingLoc ? (
              <ActivityIndicator />
            ) : (
              <Ionicons
                name="navigate-outline"
                size={16}
                color={nearby ? "#000" : "#E6E6E6"}
              />
            )}
            <Text style={[styles.pillTxt, nearby && styles.pillTxtActive]}>
              {T.near}
            </Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        contentContainerStyle={{ padding: 16 }}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <VenueCard venue={item} />}
      />

      {menuOpen && (
        <>
          <Pressable style={styles.scrim} onPress={() => setMenuOpen(false)} />
          <View style={styles.drawer}>
            {/* User info */}
            <View style={styles.userBox}>
              <FontAwesome
                name="user-circle"
                size={22}
                color="#000"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.userTxt}>{user?.email || "Guest"}</Text>
            </View>

            {/* Lingue (allineate a sinistra) */}
            <View style={styles.langRow}>
              {(["en", "it", "ar"] as const).map((lng) => (
                <Pressable
                  key={lng}
                  onPress={() => setLang(lng)}
                  style={[styles.langBtn, lang === lng && styles.langBtnActive]}
                >
                  <Text
                    style={[styles.langTxt, lang === lng && styles.langTxtActive]}
                  >
                    {lng.toUpperCase()}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Filtri */}
            <Text style={styles.sectionTitle}>{LABELS.what[lang]}</Text>
            <View style={styles.filterBox}>
              {(["beer", "wine", "cocktail"] as const).map((k) => (
                <Pressable
                  key={k}
                  onPress={() => toggleType(k)}
                  style={[
                    styles.pillDrawer,
                    selectedTypes.includes(k) && styles.pillActiveDrawer,
                  ]}
                >
                  <Text
                    style={[
                      styles.pillTxtDrawer,
                      selectedTypes.includes(k) && styles.pillTxtActiveDrawer,
                    ]}
                  >
                    {T[k]}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Brands */}
            <Text style={styles.sectionTitle}>{LABELS.brand[lang]}</Text>
            <View style={styles.filterBox}>
              {BEER_BRANDS.map((b) => (
                <Pressable
                  key={b}
                  onPress={() => toggleBrand(b)}
                  style={[
                    styles.brand,
                    selectedBrands.includes(b) && styles.brandActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.brandTxt,
                      selectedBrands.includes(b) && styles.brandTxtActive,
                    ]}
                  >
                    {b}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Logout in basso a destra */}
            <View style={styles.logoutRow}>
              <Pressable onPress={() => signOut(auth)} style={styles.logoutBtnDrawer}>
                <MaterialIcons name="logout" size={18} color="#fff" />
                <Text style={styles.logoutTxtDrawer}>Logout</Text>
              </Pressable>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const C = { gold: "#D4AF37", bg: "#000", green: "#2e7d32" };

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: C.bg },
  rtl: { direction: "rtl" as any, writingDirection: "rtl" as any },
  topbar: { paddingHorizontal: 16, paddingTop: 18 },
  hamburgerBtn: { backgroundColor: "#000", padding: 8, borderRadius: 8, alignSelf: "flex-start" },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#222",
    paddingHorizontal: 12,
    height: 44,
    marginTop: 10,
  },
  searchInput: { color: "#fff", flex: 1 },
  filtersRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 12, marginBottom: 10 },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    backgroundColor: "#111",
    marginRight: 8,
  },
  pillActive: { backgroundColor: "#fff" },
  pillTxt: { color: "#E6E6E6", fontWeight: "600" },
  pillTxtActive: { color: "#000" },

  // Drawer
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.5)" },
  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    width: 280,
    backgroundColor: "#fff",
    padding: 16,
  },
  userBox: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  userTxt: { fontWeight: "600", fontSize: 14, color: "#000" },

  // Lingue
  langRow: { flexDirection: "row", justifyContent: "flex-start", marginBottom: 16 },
  langBtn: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    minHeight: 32,
    marginRight: 6,
    backgroundColor: "#fff",
  },
  langTxt: { color: "#000", fontWeight: "600" },
  langBtnActive: { backgroundColor: C.green },
  langTxtActive: { color: "#fff" },

  sectionTitle: { color: "#000", fontWeight: "700", marginTop: 8 },

  // Container con disposizione compatta su più colonne
  filterBox: { marginTop: 8, flexDirection: "row", flexWrap: "wrap", alignItems: "flex-start" },

  // Chip filtri nel drawer
  pillDrawer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minHeight: 34,
    margin: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  pillTxtDrawer: { color: "#000", fontWeight: "600" },
  pillActiveDrawer: { backgroundColor: C.green },
  pillTxtActiveDrawer: { color: "#fff" },

  // Chip brand
  brand: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minHeight: 34,
    margin: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  brandActive: { backgroundColor: C.green },
  brandTxt: { color: "#000", fontSize: 12, fontWeight: "600" },
  brandTxtActive: { color: "#fff", fontWeight: "700" },

  // Logout in basso a destra
  logoutRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: "auto" },
  logoutBtnDrawer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  logoutTxtDrawer: { color: "#fff", fontWeight: "600", marginLeft: 6 },
});
