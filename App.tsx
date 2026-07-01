import React, { useEffect, useRef, useState } from 'react';
import { View, Image, Text, StyleSheet, Animated } from 'react-native';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigator from './src/navigation/AppNavigator';
import { COLORS } from './constants/colors';
import { AuthProvider } from './src/context/AuthContext';
import OfflineSyncManager from './src/components/OfflineSyncManager';

SplashScreen.preventAutoHideAsync().catch(() => {});

// Versión de datos de AsyncStorage - incrementar cuando hay breaking changes
const STORAGE_VERSION = '2';
const STORAGE_VERSION_KEY = '@opero_storage_version';

/**
 * Migración de AsyncStorage entre versiones.
 * Limpia datos corruptos de builds anteriores SIN borrar el token de auth.
 */
async function migrateStorageIfNeeded() {
  try {
    const currentVersion = await AsyncStorage.getItem(STORAGE_VERSION_KEY);

    if (currentVersion !== STORAGE_VERSION) {
      console.log(`[App] Migrando storage de v${currentVersion || '1'} a v${STORAGE_VERSION}`);

      // Guardar token de auth antes de limpiar
      const authToken = await AsyncStorage.getItem('@opero_auth_token');

      // Limpiar TODAS las keys de Opero (colas offline, cache, etc.)
      const allKeys = await AsyncStorage.getAllKeys();
      const operoKeys = allKeys.filter(key =>
        key.startsWith('@opero_') && key !== '@opero_auth_token'
      );

      if (operoKeys.length > 0) {
        console.log(`[App] Limpiando ${operoKeys.length} keys de storage antiguo`);
        await AsyncStorage.multiRemove(operoKeys);
      }

      // Restaurar token de auth si existía
      if (authToken) {
        await AsyncStorage.setItem('@opero_auth_token', authToken);
      }

      // Marcar migración completada
      await AsyncStorage.setItem(STORAGE_VERSION_KEY, STORAGE_VERSION);
      console.log('[App] Migración de storage completada');
    }
  } catch (error) {
    console.error('[App] Error en migración de storage:', error);
  }
}

const MIN_SPLASH_DURATION = 2500; // 2.5 segundos

const splashLogo = require('./assets/operologo.png');

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
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const initApp = async () => {
      if (!fontsLoaded) return;

      // Migrar storage ANTES de cargar la app
      await migrateStorageIfNeeded();

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

      // Fade out del splash React
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsAppReady(true);
      });
    };

    initApp().catch(console.error);
  }, [fontsLoaded]);

  // Mostrar splash mientras carga
  if (!isAppReady) {
    return (
      <Animated.View style={[styles.splashContainer, { opacity: fadeAnim }]}>
        <Image source={splashLogo} style={styles.splashLogo} resizeMode="contain" />
        <Text style={styles.splashText}>Opero</Text>
      </Animated.View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor={COLORS.bg} />
      <AppNavigator />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashLogo: {
    width: 96,
    height: 96,
    tintColor: COLORS.text,
    marginBottom: 12,
  },
  splashText: {
    fontSize: 28,
    fontFamily: 'IBMPlexMono_700Bold',
    color: COLORS.primary,
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
});
