// Hook de estado de conexión (cross-platform: web + nativo / Expo Go).
//
// Expone si el dispositivo tiene conexión y reacciona a las transiciones
// offline -> online, que es lo que dispara la sincronización de reportes
// pendientes (ver OfflineSyncManager).
//
// Usa @react-native-community/netinfo, que funciona en iOS, Android y web.
// `isConnected` puede venir null al inicio, así que lo normalizamos a booleano.
//
// MEJORA: Agregamos un estado de "verificando" para evitar falsos positivos
// en el estado inicial. NetInfo tarda ~500ms en sincronizar el estado real.

import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

export function useNetwork() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isVerifying, setIsVerifying] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    // Fetch inicial del estado de red
    NetInfo.fetch().then((state) => {
      if (mounted) {
        setIsOnline(Boolean(state.isConnected));
        // Esperamos un breve momento para confirmar que NetInfo sincronizó
        setTimeout(() => {
          if (mounted) setIsVerifying(false);
        }, 500);
      }
    });

    // Listener para cambios de estado
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(Boolean(state.isConnected));
      setIsVerifying(false);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  return { isOnline, isVerifying };
}
