import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import { Platform } from "react-native";

WebBrowser.maybeCompleteAuthSession();

type Params = {
  expoClientId: string;   // Client ID per Expo Go / native
  webClientId: string;    // Client ID per Web
  androidClientId?: string;
  iosClientId?: string;
};

export function useGoogleAuth(params: Params) {
  const isWeb = Platform.OS === "web";

  // Su WEB: NO scheme personalizzato; useProxy:false
  // Su NATIVE (Expo Go): usa il Proxy (redirect di Expo) => useProxy:true
  const redirectUri = isWeb
    ? makeRedirectUri({ useProxy: false })             // es. http://localhost:8081 o URL prod
    : makeRedirectUri({ useProxy: true });             // es. https://auth.expo.dev/...

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: params.expoClientId,
    webClientId: params.webClientId,
    androidClientId: params.androidClientId,
    iosClientId: params.iosClientId,
    scopes: ["openid", "email", "profile"],
    responseType: "id_token",
    redirectUri,
    useProxy: !isWeb, // proxy solo su native
  });

  return { request, response, promptAsync };
}
