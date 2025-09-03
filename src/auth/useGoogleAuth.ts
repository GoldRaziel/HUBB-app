import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import { Platform } from "react-native";

WebBrowser.maybeCompleteAuthSession();

type Params = {
  expoClientId: string;   // Expo Go (native)
  webClientId: string;    // Web
  androidClientId?: string;
  iosClientId?: string;
};

export function useGoogleAuth(params: Params) {
  const isWeb = Platform.OS === "web";
  const redirectUri = isWeb
    ? makeRedirectUri({ scheme: "hubb", useProxy: false })
    : "https://auth.expo.dev/@goldraziel/hubb-app";

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: params.expoClientId,
    webClientId: params.webClientId,
    androidClientId: params.androidClientId,
    iosClientId: params.iosClientId,
    scopes: ["openid", "email", "profile"],
    responseType: "id_token",
    usePKCE: false,           // evita chiusure popup senza token su web
    redirectUri,
    useProxy: !isWeb,         // proxy solo su native (Expo Go)
  });

  return { request, response, promptAsync };
}
