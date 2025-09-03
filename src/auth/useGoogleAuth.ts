import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import { Platform } from "react-native";

WebBrowser.maybeCompleteAuthSession();

type Params = {
  expoClientId: string;
  webClientId: string;
  androidClientId?: string;
  iosClientId?: string;
};

export function useGoogleAuth(params: Params) {
  const isWeb = Platform.OS === "web";
  const redirectUri = isWeb
    ? makeRedirectUri({ scheme: "hubb", useProxy: false })
    : "https://auth.expo.dev/@goldraziel/hubb-app";

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: params.expoClientId, // aiuta alcune versioni del provider
    expoClientId: params.expoClientId,
    webClientId: params.webClientId,
    androidClientId: params.androidClientId ?? (Platform.OS === "android" ? params.expoClientId : undefined),
    iosClientId: params.iosClientId,
    scopes: ["openid", "email", "profile"],
    responseType: "id_token",
    usePKCE: false,
    redirectUri,
    useProxy: !isWeb, // proxy su native (Expo Go), no proxy su web
  });

  return { request, response, promptAsync };
}
