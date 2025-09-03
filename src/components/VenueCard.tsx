import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { openGoogleMaps, tel } from "../utils/maps";

const COLORS = { gold:"#D4AF37", white:"#fff", black:"#000", green:"#009639" };

type Props = {
  venue: {
    id:string; name:string; address:string; phone?:string;
    lat:number; lng:number; categories:string[]; brands:string[];
    distanceKm?: number;
  }
}

export default function VenueCard({ venue }:Props){
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{venue.name}</Text>
      <Text style={styles.addr}>{venue.address}</Text>
      <View style={styles.row}>
        <Text style={styles.meta}>
          {venue.categories.join(" · ")}{venue.distanceKm!=null?`  ·  ${venue.distanceKm.toFixed(1)} km`:''}
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable onPress={()=>openGoogleMaps({lat:venue.lat,lng:venue.lng,q:venue.name})} style={[styles.iconBtn, {marginRight:14}]} accessibilityLabel="Open in Google Maps">
          <Ionicons name="map-outline" size={20} color={COLORS.green}/>
          <Text style={styles.iconTxt}>Maps</Text>
        </Pressable>

        {venue.phone ? (
          <Pressable onPress={()=>tel(venue.phone)} style={styles.iconBtn} accessibilityLabel="Call venue">
            <MaterialIcons name="phone" size={20} color={COLORS.gold}/>
            <Text style={styles.iconTxt}>Call</Text>
          </Pressable>
        ): null}
      </View>

      <View style={styles.brands}>
        {venue.brands.slice(0,6).map(b=>(
          <View key={b} style={styles.brandPill}><Text style={styles.brandTxt}>{b}</Text></View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card:{ backgroundColor:"#0E1116", borderRadius:14, padding:14, marginBottom:12, borderWidth:1, borderColor:"#222" },
  name:{ color:COLORS.gold, fontSize:18, fontWeight:"700", marginBottom:4 },
  addr:{ color:"#D9D9D9", fontSize:13, marginBottom:6 },
  row:{ flexDirection:"row", alignItems:"center", marginBottom:8 },
  meta:{ color:"#AAA", fontSize:12 },
  actions:{ flexDirection:"row", marginTop:4 },
  iconBtn:{ flexDirection:"row", alignItems:"center", backgroundColor:"#111", paddingHorizontal:10, paddingVertical:8, borderRadius:999, borderWidth:1, borderColor:"#2a2a2a" },
  iconTxt:{ color:"#E6E6E6", fontSize:12, fontWeight:"600", marginLeft:6 },
  brands:{ flexDirection:"row", flexWrap:"wrap", marginTop:12 },
  brandPill:{ backgroundColor:"#151922", borderRadius:999, paddingVertical:6, paddingHorizontal:10, borderWidth:1, borderColor:"#222", marginRight:8, marginBottom:8 },
  brandTxt:{ color:"#EDEDED", fontSize:12 }
});
