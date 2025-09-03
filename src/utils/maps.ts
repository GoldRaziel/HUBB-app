import { Linking } from "react-native";
export function openGoogleMaps(opts:{lat:number,lng:number, q?:string}) {
  const {lat,lng,q} = opts;
  const url = `https://www.google.com/maps?q=${lat},${lng}${q?`(${encodeURIComponent(q)})`:''}`;
  Linking.openURL(url);
}
export function tel(phone?:string){ if(!phone) return; Linking.openURL(`tel:${phone}`); }
