export default {
  expo: {
    name: "HUBB",
    slug: "hubb",
    scheme: "hubb",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    splash: { image: "./assets/splash.png", resizeMode: "contain", backgroundColor: "#ffffff" },
    userInterfaceStyle: "automatic",
    assetBundlePatterns: ["**/*"],
    ios: { supportsTablet: false },
    android: {
      adaptiveIcon: { foregroundImage: "./assets/adaptive-icon.png", backgroundColor: "#ffffff" },
      softwareKeyboardLayoutMode: "pan"
    },
    web: { bundler: "metro", output: "static" },
    plugins: ["expo-router"],
    experiments: { typedRoutes: true },
    entryPoint: "./node_modules/expo-router/entry"
  }
};
