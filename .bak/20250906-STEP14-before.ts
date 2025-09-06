import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import { Platform } from "react-native";
import React, { useEffect } from "react";

WebBrowser.maybeCompleteAuthSession();

type UseGoogleAuthOpts = {
  expoClientId?: string;
  webClientId?: string;
};

export function useGoogleAuth(opts?: UseGoogleAuthOpts) {
  const isWeb = Platform.OS === "web";
  const webClientId =
    opts?.webClientId ??
    (process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID as string);

  // Usa SEMPRE il proxy Expo (https://auth.expo.io/@owner/slug)
  const redirectUri = makeRedirectUri({ useProxy: true });

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: webClientId,
    scopes: ["openid", "email", "profile"],
    responseType: "id_token",
    useProxy: true,
    redirectUri,
  } as any);

  useEffect(() => {
    if (request?.redirectUri) {
      console.log("[RedirectUri]", request.redirectUri);
    }
  }, [request]);

  return { request, response, promptAsync };
}
