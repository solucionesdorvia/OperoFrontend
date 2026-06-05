import React, { useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import {
  IBMPlexSans_300Light,
  IBMPlexSans_400Regular,
  IBMPlexSans_500Medium,
  IBMPlexSans_600SemiBold,
  IBMPlexSans_600SemiBold_Italic,
  IBMPlexSans_700Bold,
} from '@expo-google-fonts/ibm-plex-sans';
import {
  IBMPlexMono_400Regular,
  IBMPlexMono_500Medium,
  IBMPlexMono_600SemiBold,
  IBMPlexMono_700Bold,
} from '@expo-google-fonts/ibm-plex-mono';
import AppNavigator from './src/navigation/AppNavigator';
import { COLORS } from './constants/colors';
import { AuthProvider } from './src/context/AuthContext';

SplashScreen.preventAutoHideAsync().catch(() => {});

const MIN_SPLASH_DURATION = 2500; // 2.5 segundos

export default function App() {
  const [fontsLoaded] = useFonts({
    IBMPlexSans_300Light,
    IBMPlexSans_400Regular,
    IBMPlexSans_500Medium,
    IBMPlexSans_600SemiBold,
    IBMPlexSans_600SemiBold_Italic,
    IBMPlexSans_700Bold,
    IBMPlexMono_400Regular,
    IBMPlexMono_500Medium,
    IBMPlexMono_600SemiBold,
    IBMPlexMono_700Bold,
  });

  const startTimeRef = useRef(Date.now());
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const hideSplash = async () => {
      if (!fontsLoaded) return;

      const elapsedTime = Date.now() - startTimeRef.current;
      const remainingTime = MIN_SPLASH_DURATION - elapsedTime;

      if (remainingTime > 0) {
        // Esperar el tiempo restante
        console.log(`[App] Splash: esperando ${remainingTime}ms adicionales`);
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      } else {
        console.log(`[App] Splash: fuentes tardaron ${elapsedTime}ms (>= mínimo)`);
      }

      try {
        await SplashScreen.hideAsync();
      } catch (error) {
        console.error('[App] Error al ocultar splash:', error);
      }

      // Ocultar splash HTML personalizado (web)
      if (typeof document !== 'undefined') {
        const splashElement = document.getElementById('splash-screen');
        if (splashElement) {
          splashElement.classList.add('hidden');
          setTimeout(() => splashElement.remove(), 300);
        }
      }

      setIsAppReady(true);
    };

    hideSplash().catch(console.error);
  }, [fontsLoaded]);

  // NO renderizar hasta que splash esté listo
  if (!isAppReady) return null;

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" backgroundColor={COLORS.bg} />
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
