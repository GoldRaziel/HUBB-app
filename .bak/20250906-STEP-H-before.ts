import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import React, { useEffect } from "react";
import appJson from "../../app.json";

WebBrowser.maybeCompleteAuthSession();

// Redirect HTTPS fisso del proxy Expo (registrato in Google OAuth)
const OWNER = appJson.expo?.owner || "anonymous";
const SLUG  = appJson.expo?.slug  || "hubb-app";
const REDIRECT_URI = `https://auth.expo.io/@${OWNER}/${SLUG}`;

type UseGoogleAuthOpts = {
  webClientId?: string;  // SOLO Web Client ID
};

export function useGoogleAuth(opts?: UseGoogleAuthOpts) {
  const webClientId  = opts?.webClientId  ?? (process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID as string);

  // Config minimale: solo clientId web + proxy Expo + redirect https
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
