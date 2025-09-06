import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { Platform } from "react-native";
import React, { useEffect } from "react";
import appJson from "../../app.json";

WebBrowser.maybeCompleteAuthSession();

// Costruiamo *esplicitamente* l'URI HTTPS del proxy Expo
const OWNER = appJson.expo?.owner || "anonymous";
const SLUG  = appJson.expo?.slug  || "hubb-app";
const REDIRECT_URI = `https://auth.expo.io/@${OWNER}/${SLUG}`;

type UseGoogleAuthOpts = {
  expoClientId?: string;
  webClientId?: string;
};

export function useGoogleAuth(opts?: UseGoogleAuthOpts) {
  const isWeb = Platform.OS === "web";
  const webClientId  = opts?.webClientId  ?? (process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID as string);
  const expoClientId = opts?.expoClientId; // se passato da WelcomeScreen

  const config: any = {
    clientId: webClientId,
    scopes: ["openid", "email", "profile"],
    responseType: "id_token",
    useProxy: true,
    redirectUri: REDIRECT_URI,
  };
  if (!isWeb && expoClientId) {
    // su native aggiungiamo anche l'expoClientId quando disponibile
    config.expoClientId = expoClientId;
  }

  const [request, response, promptAsync] = Google.useAuthRequest(config);

  useEffect(() => {
    if (request?.redirectUri) {
      console.log("[RedirectUri]", request.redirectUri);
    } else {
      console.log("[RedirectUri]", REDIRECT_URI);
    }
  }, [request]);

  return { request, response, promptAsync };
}
