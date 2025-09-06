import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import React, { useEffect } from "react";

WebBrowser.maybeCompleteAuthSession();

type UseGoogleAuthOpts = { webClientId?: string };

export function useGoogleAuth(opts?: UseGoogleAuthOpts) {
  const webClientId = opts?.webClientId ?? (process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID as string);

  // Lasciamo gestire a Expo il returnUrl/redirect dinamico (proxy)
  const redirectUri = makeRedirectUri({ useProxy: true });

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: webClientId,
    scopes: ["openid", "email", "profile"],
    responseType: "id_token",
    useProxy: true,
    redirectUri,
  } as any);

  useEffect(() => {
    console.log("[RedirectUri]", redirectUri);
  }, [redirectUri]);

  return { request, response, promptAsync };
}
