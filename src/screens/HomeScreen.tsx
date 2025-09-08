import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../lib/firebase";
import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import VenueCard from "../components/VenueCard";
import venuesData from "../data/mock_venues.json";
import { BEER_BRANDS } from "../data/brands";
import { haversineKm } from "../utils/distance";
import { Ionicons } from "@expo/vector-icons";
import LangSelector from "../components/LangSelector";
import { useLang } from "../context/LangContext";

type Lang = "en"|"it"|"ar";
const STR:any = {
  en:{ home:"Nearby venues", search:"Search by name, area...", filters:"Filters", beer:"Beer", wine:"Wine", both:"Both", cocktail:"Cocktail", brands:"Brands", near:"Near me" },
  it:{ home:"Locali vicini", search:"Cerca per nome, zona...", filters:"Filtri", beer:"Birra", wine:"Vino", both:"Entrambi", cocktail:"Cocktail", brands:"Marche", near:"Vicino a me" },
  ar:{ home:"أماكن قريبة", search:"ابحث بالاسم أو المنطقة...", filters:"فلاتر", beer:"بيرة", wine:"نبيذ", both:"كلاهما", cocktail:"كوكتيل", brands:"العلامات", near:"بالقرب مني" },
};
type Venue = { id:string; name:string; address:string; phone?:string; lat:number; lng:number; categories:string[]; brands:string[]; distanceKm?:number; };

export default function HomeScreen(){
  const { lang, isRTL } = useLang();
  const T=STR[lang];

  const [q,setQ]=useState("");
  const [type,setType]=useState<"beer"|"wine"|"both"|"cocktail">("both");
  const [selectedBrands,setSelectedBrands]=useState<string[]>([]);
  const [nearby,setNearby]=useState(false);
  const [myPos,setMyPos]=useState<{lat:number,lng:number}|null>(null);
  const [loadingLoc,setLoadingLoc]=useState(false);

  const [user,setUser] = useState<User|null>(null);

  // NEW: stato per aprire/chiudere il menu hamburger
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, (u)=>setUser(u));
    return () => unsub();
  },[]);

  const all:Venue[] = venuesData as any;

  useEffect(()=>{
    if(!nearby) return;
    (async()=>{
      try{
        setLoadingLoc(true);
        const {status} = await Location.requestForegroundPermissionsAsync();
        if(status!=="granted"){ setNearby(false); return; }
        const loc = await Location.getCurrentPositionAsync({});
        setMyPos({lat: loc.coords.latitude, lng: loc.coords.longitude});
      } finally { setLoadingLoc(false); }
    })();
  },[nearby]);

  const data = useMemo(()=>{
    let arr = [...all];
    if (myPos) arr = arr.map(v=>({...v, distanceKm:haversineKm(myPos, {lat:v.lat,lng:v.lng})}));
    if (q.trim()){
      const s=q.trim().toLowerCase();
      arr = arr.filter(v => (v.name+" "+v.address).toLowerCase().includes(s));
    }
    if (type!=="both"){
      arr = arr.filter(v => v.categories.includes(type));
    }
    if (selectedBrands.length){
      arr = arr.filter(v => selectedBrands.every(b => v.brands.includes(b)));
    }
    if (myPos && nearby){
      arr.sort((a,b)=>(a.distanceKm??999)-(b.distanceKm??999));
    } else {
      arr.sort((a,b)=>a.name.localeCompare(b.name));
    }
    return arr;
  },[all,q,type,selectedBrands,myPos,nearby]);

  function toggleBrand(b:string){
    setSelectedBrands(prev => prev.includes(b) ? prev.filter(x=>x!==b) : [...prev,b]);
  }

  return (
    <View style={[styles.wrap, isRTL && styles.rtl]}>
      <View style={styles.topbar}>
        {/* NEW: bottone hamburger a sinistra */}
        <Pressable
          onPress={()=>setMenuOpen(true)}
          style={styles.hamburgerBtn}
          accessibilityLabel="Open menu"
          accessibilityRole="button"
        >
          <Ionicons name="menu" size={18} color="#fff" />
        </Pressable>

        <LangSelector />
        <Text style={styles.title}>{T.home}</Text>
        {user && (
          <View style={styles.userRow}>
            <Text style={styles.userName}>{user.displayName || user.email}</Text>
            <Pressable onPress={()=>signOut(auth)} style={styles.logoutBtn}>
              <Text style={styles.logoutTxt}>Logout</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#888"/>
          <TextInput
            value={q} onChangeText={setQ}
            placeholder={T.search} placeholderTextColor="#999"
            style={styles.searchInput}
          />
        </View>

        <View style={styles.filtersRow}>
          {(["both","beer","wine","cocktail"] as const).map(k=>(
            <Pressable key={k} onPress={()=>setType(k)} style={[styles.pill, type===k && styles.pillActive]}>
              <Text style={[styles.pillTxt, type===k && styles.pillTxtActive]}>
                {T[k]}
              </Text>
            </Pressable>
          ))}
          <Pressable onPress={()=>setNearby(x=>!x)} style={[styles.pill, nearby && styles.pillActive]}>
            {loadingLoc ? <ActivityIndicator/> : <Ionicons name="navigate-outline" size={16} color={nearby?"#000":"#E6E6E6"}/>}
            <Text style={[styles.pillTxt, nearby && styles.pillTxtActive]}>{T.near}</Text>
          </Pressable>
        </View>

        <Text style={styles.section}>{T.brands}</Text>
        <View style={styles.brandsWrap}>
          {BEER_BRANDS.map(b=>(
            <Pressable key={b} onPress={()=>toggleBrand(b)} style={[styles.brand, selectedBrands.includes(b)&&styles.brandActive]}>
              <Text style={[styles.brandTxt, selectedBrands.includes(b)&&styles.brandTxtActive]}>{b}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <FlatList
        contentContainerStyle={{padding:16}}
        data={data}
        keyExtractor={item=>item.id}
        renderItem={({item})=><VenueCard venue={item}/>}
      />

      {/* NEW: Drawer laterale sovrapposto (non altera layout esistente) */}
      {menuOpen && (
        <>
          <Pressable style={styles.scrim} onPress={()=>setMenuOpen(false)} />
          <View style={styles.drawer}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>{T.filters}</Text>
              <Pressable onPress={()=>setMenuOpen(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={18} color="#000" />
              </Pressable>
            </View>

            <View style={styles.drawerSection}>
              <Text style={styles.drawerLabel}>{T.both}/{T.beer}/{T.wine}/{T.cocktail}</Text>
              <View style={{flexDirection:"row", flexWrap:"wrap", gap:8 as any, marginTop:8}}>
                {(["both","beer","wine","cocktail"] as const).map(k=>(
                  <Pressable key={k} onPress={()=>{ setType(k); setMenuOpen(false); }} style={[styles.pill, type===k && styles.pillActive]}>
                    <Text style={[styles.pillTxt, type===k && styles.pillTxtActive]}>{T[k]}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.drawerSection}>
              <Pressable onPress={()=>{ setNearby(x=>!x); }} style={[styles.pill, nearby && styles.pillActive]}>
                <Ionicons name="navigate-outline" size={16} color={nearby?"#000":"#E6E6E6"}/>
                <Text style={[styles.pillTxt, nearby && styles.pillTxtActive]}>{T.near}</Text>
              </Pressable>
            </View>

            <View style={styles.drawerSection}>
              <Text style={styles.drawerLabel}>{T.brands}</Text>
              <View style={{flexDirection:"row", flexWrap:"wrap", gap:8 as any, marginTop:8}}>
                {BEER_BRANDS.map(b=>(
                  <Pressable key={b} onPress={()=>toggleBrand(b)} style={[styles.brand, selectedBrands.includes(b)&&styles.brandActive]}>
                    <Text style={[styles.brandTxt, selectedBrands.includes(b)&&styles.brandTxtActive]}>{b}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const C = { gold:"#D4AF37", bg:"#000", panel:"#0E1116" };

const styles = StyleSheet.create({
  wrap:{ flex:1, backgroundColor:C.bg },
  rtl:{ direction:"rtl" as any, writingDirection:"rtl" as any },
  topbar:{ paddingHorizontal:16, paddingTop:18 },
  title:{ color:"#fff", fontSize:22, fontWeight:"800", marginBottom:10 },
  searchBox:{ flexDirection:"row", alignItems:"center", gap:8 as any, backgroundColor:"#111", borderRadius:999, borderWidth:1, borderColor:"#222", paddingHorizontal:12, height:44 },
  searchInput:{ color:"#fff", flex:1 },
  filtersRow:{ flexDirection:"row", flexWrap:"wrap", gap:8 as any, marginTop:12, marginBottom:10 },
  pill:{ flexDirection:"row", alignItems:"center", gap:6 as any, borderRadius:999, paddingVertical:8, paddingHorizontal:12, borderWidth:1, borderColor:"#2a2a2a", backgroundColor:"#111" },
  pillActive:{ backgroundColor:"#fff" },
  pillTxt:{ color:"#E6E6E6", fontWeight:"600" },
  pillTxtActive:{ color:"#000" },
  section:{ color:C.gold, fontWeight:"700", marginTop:6, marginBottom:6 },
  brandsWrap:{ flexDirection:"row", flexWrap:"wrap", gap:8 as any },
  brand:{ backgroundColor:"#111", borderWidth:1, borderColor:"#222", borderRadius:999, paddingVertical:6, paddingHorizontal:10 },
  brandActive:{ backgroundColor:"#fff" },
  brandTxt:{ color:"#EDEDED", fontSize:12 },
  brandTxtActive:{ color:"#000", fontSize:12, fontWeight:"700" },
  userRow:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginBottom:8},
  userName:{color:"#fff",fontWeight:"700"},
  logoutBtn:{ backgroundColor:"#fff", paddingVertical:6, paddingHorizontal:10, borderRadius:999, marginLeft:10 },
  logoutTxt:{ color:"#000", fontWeight:"700" },

  // NEW: stili hamburger/drawer non invasivi
  hamburgerBtn:{ width:36, height:36, borderRadius:18, alignItems:"center", justifyContent:"center", borderWidth:1, borderColor:"#222", backgroundColor:"#111", marginBottom:10 },
  scrim:{ position:"absolute", top:0, bottom:0, left:0, right:0, backgroundColor:"rgba(0,0,0,0.35)" },
  drawer:{ position:"absolute", top:0, bottom:0, left:0, width:300, backgroundColor:"#fff", paddingTop:16, paddingHorizontal:12 },
  drawerHeader:{ flexDirection:"row", alignItems:"center", justifyContent:"space-between", marginBottom:8 },
  drawerTitle:{ fontSize:18, fontWeight:"800", color:"#000" },
  closeBtn:{ width:34, height:34, borderRadius:17, alignItems:"center", justifyContent:"center", backgroundColor:"#f2f2f2" },
  drawerSection:{ marginTop:10 },
  drawerLabel:{ color:"#111", fontWeight:"700" },
});
