import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { Platform } from "react-native";
import React, { useEffect } from "react";
import appJson from "../../app.json";

WebBrowser.maybeCompleteAuthSession();

// Redirect HTTPS fisso del proxy Expo (deve essere registrato in Google OAuth)
const OWNER = appJson.expo?.owner || "anonymous";
const SLUG  = appJson.expo?.slug  || "hubb-app";
const REDIRECT_URI = `https://auth.expo.io/@${OWNER}/${SLUG}`;

type UseGoogleAuthOpts = {
  expoClientId?: string; // per Expo Go / native (proxy)
  webClientId?: string;  // per Web
  androidClientId?: string; // opzionale
};

export function useGoogleAuth(opts?: UseGoogleAuthOpts) {
  const webClientId     = opts?.webClientId  ?? (process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID as string);
  const expoClientId    = opts?.expoClientId;
  const androidClientId = opts?.androidClientId ?? expoClientId ?? webClientId; // fallback per evitare l'errore di presenza

  const config: any = {
    webClientId,
    expoClientId,
    androidClientId,
    scopes: ["openid", "email", "profile"],
    responseType: "id_token",
    useProxy: true,
    redirectUri: REDIRECT_URI,
  };

  const [request, response, promptAsync] = Google.useAuthRequest(config);

  useEffect(() => {
    console.log("[RedirectUri]", REDIRECT_URI);
    console.log("[IDs]", { webClientId: !!webClientId, expoClientId: !!expoClientId, androidClientId: !!androidClientId });
  }, []);

  return { request, response, promptAsync };
}
