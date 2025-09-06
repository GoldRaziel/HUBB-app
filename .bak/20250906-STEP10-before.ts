import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import React, { useEffect } from "react";

// Usiamo ESATTAMENTE l'URI registrato in Google (https)
const REDIRECT_URI = "https://auth.expo.io/@goldraziel/hubb-app";

type UseGoogleAuthOpts = { webClientId?: string };

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth(opts?: UseGoogleAuthOpts) {
  const webClientId = opts?.webClientId ?? (process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID as string);

  // Config minima: solo clientId web + proxy Expo + redirect fisso https
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: webClientId,
    scopes: ["openid", "email", "profile"],
    responseType: "id_token",
    useProxy: true,
    redirectUri: REDIRECT_URI,
  } as any);

  useEffect(() => {
    console.log("[RedirectUri]", REDIRECT_URI);
  }, []);

  return { request, response, promptAsync };
}
