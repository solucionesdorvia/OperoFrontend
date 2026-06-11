export default {
  expo: {
    name: "frontend",
    slug: "frontend",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    backgroundColor: "#FFFFFF",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#FFFFFF"
    },
    ios: {
      supportsTablet: true,
      backgroundColor: "#FFFFFF"
    },
    android: {
      backgroundColor: "#FFFFFF",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      "expo-font",
      "expo-splash-screen",
      "expo-camera",
      "expo-barcode-scanner",
      [
        "expo-image-picker",
        {
          "photosPermission": "La aplicación necesita acceso a tus fotos para adjuntar imágenes a las incidencias.",
          "cameraPermission": "La aplicación necesita acceso a tu cámara para tomar fotos de las incidencias."
        }
      ]
    ],
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL
    }
  }
};
