import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import { Platform, I18nManager } from 'react-native';

export type Lang = 'en'|'it'|'ar';
type Ctx = { lang:Lang; setLang:(l:Lang)=>void; isRTL:boolean; };

const LangContext = createContext<Ctx>({ lang:'en', setLang:()=>{}, isRTL:false });

function initialFromURL():Lang {
  if (Platform.OS==='web' && typeof window!=='undefined') {
    try {
      const q = new URLSearchParams(window.location.search).get('lang');
      if (q==='it'||q==='ar'||q==='en') return q as Lang;
    } catch {}
  }
  return 'en'; // default richiesto
}

export function LangProvider({children}:{children:React.ReactNode}) {
  const [lang, setLang] = useState<Lang>(initialFromURL);
  useEffect(()=>{
    if (Platform.OS==='web' && typeof window!=='undefined') {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('lang', lang);
        window.history.replaceState({}, '', url);
      } catch {}
    }
    if (Platform.OS!=='web') {
      const wantRTL = lang==='ar';
      try { I18nManager.allowRTL(wantRTL); I18nManager.forceRTL(wantRTL); } catch {}
    }
  }, [lang]);
  const isRTL = lang==='ar';
  const value = useMemo(()=>({lang,setLang,isRTL}),[lang,isRTL]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(){ return useContext(LangContext); }
