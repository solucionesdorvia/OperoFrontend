export default {
  expo: {
    name: "Opero",
    slug: "opero",
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
      backgroundColor: "#FFFFFF",
      bundleIdentifier: "ar.uade.opero"
    },
    android: {
      backgroundColor: "#FFFFFF",
      package: "ar.uade.opero",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      permissions: [
        "INTERNET",
        "ACCESS_NETWORK_STATE",
        "ACCESS_WIFI_STATE"
      ],
      // Permitir HTTPS a Railway (Android 9+ requiere Network Security Config)
      usesCleartextTraffic: false, // Solo HTTPS permitido
      // Config adicional para permitir conexiones HTTPS a dominios custom
      config: {
        googleMobileAdsAppId: false // Deshabilitar AdMob warnings si no usamos ads
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      "expo-font",
      [
        "expo-splash-screen",
        {
          // En SDK 50+ el splash nativo se configura desde aca, no desde el
          // campo `splash:` top-level (deprecado). Sin esta config el plugin
          // usaba el splash generico de Expo.
          image: "./assets/operologo.png",
          imageWidth: 160,
          backgroundColor: "#FFFFFF",
          resizeMode: "contain"
        }
      ],
      "expo-camera",
      [
        "expo-image-picker",
        {
          "photosPermission": "La aplicación necesita acceso a tus fotos para adjuntar imágenes a las incidencias.",
          "cameraPermission": "La aplicación necesita acceso a tu cámara para tomar fotos de las incidencias."
        }
      ]
    ],
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL,
      eas: {
        projectId: "451a2b86-7c43-4ffc-848b-115b864b531a"
      }
    }
  }
};
