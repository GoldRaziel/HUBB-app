import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import { Platform } from "react-native";

WebBrowser.maybeCompleteAuthSession();

type Params = {
  expoClientId: string;   // Client ID per Expo/Dev Client
  webClientId: string;    // Client ID per Web
  androidClientId?: string;
  iosClientId?: string;
};

export function useGoogleAuth(params: Params) {
  const isWeb = Platform.OS === "web";
  const missingAndroidId = Platform.OS === "android" && !params.androidClientId;

  // 🔒 Se su ANDROID manca l'androidClientId, NON creiamo la richiesta Google:
  //    evitiamo l'errore e restituiamo request=null (il bottone rimane disabilitato).
  if (missingAndroidId) {
    return {
      request: null as any,
      response: null as any,
      // no-op per evitare crash se chiamato
      promptAsync: async () => ({ type: "dismiss" } as any),
    };
  }

  const redirectUri = isWeb
    ? makeRedirectUri({ useProxy: false })
    : makeRedirectUri({ useProxy: true });

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: params.expoClientId,
    webClientId: params.webClientId,
    ...(params.androidClientId ? { androidClientId: params.androidClientId } : {}),
    ...(params.iosClientId ? { iosClientId: params.iosClientId } : {}),
    scopes: ["openid", "email", "profile"],
    responseType: "id_token",
    redirectUri,
    useProxy: !isWeb,
  });

  return { request, response, promptAsync };
}
