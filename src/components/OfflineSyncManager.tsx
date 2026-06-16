// Gestor global de sincronización offline.
//
// Responsabilidades:
//   1. Mostrar un indicador flotante cuando no hay conexión.
//   2. Al recuperar la conexión (o al abrir la app ya online) con reportes
//      pendientes, preguntar "¿Subir incidencia(s)?" y, si se acepta, vaciar la
//      cola contra el backend.
//
// Se monta una sola vez, por encima del navigator (ver App.tsx).

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { useNetwork } from '../hooks/useNetwork';
import { offlineIncidentService } from '../services/offlineIncidentService';
import { styles } from './OfflineSyncManager.styles';

export default function OfflineSyncManager() {
  const { isOnline } = useNetwork();
  const wasOnline = useRef(isOnline);

  const [pending, setPending] = useState(0);
  const [promptVisible, setPromptVisible] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const refreshPending = useCallback(async () => {
    const count = await offlineIncidentService.countPending();
    setPending(count);
    return count;
  }, []);

  // Decide si corresponde ofrecer la subida (hay conexión y hay pendientes).
  const maybePrompt = useCallback(async () => {
    if (!isOnline) return;
    const count = await refreshPending();
    if (count > 0) setPromptVisible(true);
  }, [isOnline, refreshPending]);

  // Al montar: si ya estamos online y quedaron pendientes de una sesión previa.
  useEffect(() => {
    maybePrompt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // En cada cambio de conexión: refrescamos contador y detectamos el reconectar.
  useEffect(() => {
    refreshPending();
    const reconnected = !wasOnline.current && isOnline;
    wasOnline.current = isOnline;
    if (reconnected) maybePrompt();
  }, [isOnline, refreshPending, maybePrompt]);

  const handleUpload = async () => {
    setSyncing(true);
    try {
      await offlineIncidentService.flushPending();
    } finally {
      setSyncing(false);
      setPromptVisible(false);
      refreshPending();
    }
  };

  const handleLater = () => setPromptVisible(false);

  return (
    <>
      {!isOnline ? (
        <View style={styles.banner} pointerEvents="none">
          <MaterialIcons name="cloud-off" size={16} color={COLORS.onPrimary} />
          <Text style={styles.bannerText}>
            Sin conexión{pending > 0 ? ` · ${pending} reporte(s) en cola` : ' · los reportes se guardan en el dispositivo'}
          </Text>
        </View>
      ) : null}

      <Modal
        transparent
        visible={promptVisible}
        animationType="fade"
        onRequestClose={handleLater}
      >
        <View style={styles.backdrop}>
          <View style={styles.card}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="cloud-upload" size={26} color={COLORS.primary} />
            </View>
            <Text style={styles.title}>¿Subir incidencia?</Text>
            <Text style={styles.subtitle}>
              {pending === 1
                ? 'Tenés 1 reporte guardado sin conexión. ¿Querés subirlo ahora?'
                : `Tenés ${pending} reportes guardados sin conexión. ¿Querés subirlos ahora?`}
            </Text>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.btnSecondary}
                onPress={handleLater}
                disabled={syncing}
                activeOpacity={0.7}
              >
                <Text style={styles.btnSecondaryText}>Más tarde</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnPrimary}
                onPress={handleUpload}
                disabled={syncing}
                activeOpacity={0.85}
              >
                {syncing ? (
                  <ActivityIndicator size="small" color={COLORS.onPrimary} />
                ) : (
                  <>
                    <MaterialIcons name="cloud-upload" size={16} color={COLORS.onPrimary} />
                    <Text style={styles.btnPrimaryText}>Subir ahora</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
