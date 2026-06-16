// Hook de estado de conexión (cross-platform: web + nativo / Expo Go).
//
// Expone si el dispositivo tiene conexión y reacciona a las transiciones
// offline -> online, que es lo que dispara la sincronización de reportes
// pendientes (ver OfflineSyncManager).
//
// Usa @react-native-community/netinfo, que funciona en iOS, Android y web.
// `isConnected` puede venir null al inicio, así que lo normalizamos a booleano.

import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

export function useNetwork() {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    NetInfo.fetch().then((state) => {
      if (mounted) setIsOnline(Boolean(state.isConnected));
    });

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(Boolean(state.isConnected));
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  return { isOnline };
}
