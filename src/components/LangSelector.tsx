import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useLang } from '../context/LangContext';

const COLORS = { gold:'#D4AF37' };

export default function LangSelector(){
  const { lang, setLang } = useLang();
  const langs: ('en'|'it'|'ar')[] = ['en','it','ar'];
  const labels:any = { en:'EN', it:'IT', ar:'AR' };
  return (
    <View style={styles.wrap}>
      {langs.map(l=>(
        <Pressable key={l} onPress={()=>setLang(l)} style={[styles.pill, lang===l && styles.pillActive]}>
          <Text style={[styles.txt, lang===l && styles.txtActive]}>{labels[l]}</Text>
        </Pressable>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  wrap:{ flexDirection:'row', backgroundColor:'#111', borderRadius:999, borderWidth:1, borderColor:'#222', padding:4, gap:4 as any, alignSelf:'flex-end', marginBottom:12 },
  pill:{ paddingVertical:6, paddingHorizontal:12, borderRadius:999, backgroundColor:'transparent' },
  pillActive:{ backgroundColor:COLORS.gold },
  txt:{ color:'#E6E6E6', fontWeight:'700', fontSize:12 },
  txtActive:{ color:'#000' }
});
