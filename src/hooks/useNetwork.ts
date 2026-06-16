// Hook de estado de conexión.
//
// Objetivo (target web / Railway): exponer si el dispositivo tiene conexión y
// notificar las transiciones offline -> online para disparar la sincronización
// de reportes pendientes.
//
// En web usamos `navigator.onLine` + los eventos `online`/`offline` del window.
// En nativo (Expo Go) no hay esa API: asumimos conectado para no bloquear el
// flujo. Si más adelante se quiere soporte nativo real, acá entra
// `@react-native-community/netinfo` detrás de un Platform.OS check.

import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

const readOnline = (): boolean => {
  if (isWeb && typeof navigator !== 'undefined' && 'onLine' in navigator) {
    return navigator.onLine;
  }
  return true;
};

export function useNetwork() {
  const [isOnline, setIsOnline] = useState<boolean>(readOnline);

  useEffect(() => {
    if (!isWeb || typeof window === 'undefined') return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Sincronizar el estado inicial por si cambió antes de montar el listener.
    setIsOnline(readOnline());

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline };
}
