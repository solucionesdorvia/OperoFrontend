// Gestor global de sincronización offline.
//
// 1. Muestra un indicador flotante cuando no hay conexión (con la cantidad de
//    reportes en cola).
// 2. Al recuperar la conexión (o al abrir la app ya online) con reportes
//    pendientes, pregunta "¿Subir incidencia(s)?" y, si se acepta, vacía la
//    cola contra el backend (sube imágenes + crea incidentes).
//
// Se monta una sola vez por encima del navigator (ver App.tsx).

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { useNetwork } from '../hooks/useNetwork';
import { useAuth } from '../context/AuthContext';
import { offlineQueueService } from '../services/offlineQueueService';
import { workQueueService } from '../services/workQueueService';
import { departmentQueueService } from '../services/departmentQueueService';
import { assignmentQueueService } from '../services/assignmentQueueService';
import { styles } from './OfflineSyncManager.styles';

// Cuánto tiempo dejamos visible el cartel de "sin conexión" antes de auto-ocultarlo
// para no tapar el botón de Guardar/FAB de las pantallas de abajo.
const BANNER_AUTOHIDE_MS = 4000;

export default function OfflineSyncManager() {
  const { isOnline, isVerifying } = useNetwork();
  const { isAuthenticated } = useAuth();
  const wasOnline = useRef(isOnline);
  const wasAuthenticated = useRef(isAuthenticated);

  const [pending, setPending] = useState(0);
  const [workPending, setWorkPending] = useState(0);
  const [deptPending, setDeptPending] = useState(0);
  const [assignPending, setAssignPending] = useState(0);
  const [promptVisible, setPromptVisible] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<{ uploaded: number; failed: number; lastError?: string } | null>(null);
  const [bannerVisible, setBannerVisible] = useState(false);

  const refreshPending = useCallback(async () => {
    const incidentCount = await offlineQueueService.count();
    const workCount = (await workQueueService.getAll()).length;
    const deptCount = (await departmentQueueService.getAll()).length;
    const assignCount = (await assignmentQueueService.getAll()).length;
    console.log('[OfflineSyncManager] Cola offline: ', incidentCount, 'incidentes,', workCount, 'trabajos,', deptCount, 'departamentos,', assignCount, 'asignaciones');
    setPending(incidentCount);
    setWorkPending(workCount);
    setDeptPending(deptCount);
    setAssignPending(assignCount);
    return incidentCount + workCount + deptCount + assignCount;
  }, []);

  const maybePrompt = useCallback(async () => {
    // No mostrar prompt si aún estamos verificando la conexión
    if (isVerifying) {
      console.log('[OfflineSyncManager] Aún verificando conexión, esperando...');
      return;
    }
    // No mostrar prompt si el usuario no está logueado
    if (!isAuthenticated) {
      console.log('[OfflineSyncManager] Usuario no autenticado, no mostrar prompt');
      return;
    }
    if (!isOnline) {
      console.log('[OfflineSyncManager] No online, no prompt');
      return;
    }
    const count = await refreshPending();
    console.log('[OfflineSyncManager] Online, count:', count);
    if (count > 0) {
      console.log('[OfflineSyncManager] Mostrando prompt para subir', count, 'items');
      setPromptVisible(true);
    }
  }, [isOnline, isVerifying, isAuthenticated, refreshPending]);

  // Mantenemos el contador al día con los cambios de las 4 colas.
  useEffect(() => {
    refreshPending();
    const unsubscribe1 = offlineQueueService.subscribe(refreshPending);
    const unsubscribe2 = workQueueService.subscribe(refreshPending);
    const unsubscribe3 = departmentQueueService.subscribe(refreshPending);
    const unsubscribe4 = assignmentQueueService.subscribe(refreshPending);
    return () => {
      unsubscribe1();
      unsubscribe2();
      unsubscribe3();
      unsubscribe4();
    };
  }, [refreshPending]);

  // Al montar: si ya estamos online y quedaron pendientes de antes.
  useEffect(() => {
    maybePrompt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // En cada cambio de conexión, detectamos el reconectar.
  useEffect(() => {
    const reconnected = !wasOnline.current && isOnline;
    wasOnline.current = isOnline;
    if (reconnected) maybePrompt();
  }, [isOnline, maybePrompt]);

  // Si hay pendientes nuevos y estamos online (ej: creaste offline y luego conectaste antes del modal)
  const prevPending = useRef(pending);
  useEffect(() => {
    const wentFromZeroToSome = prevPending.current === 0 && pending > 0;
    prevPending.current = pending;
    if (wentFromZeroToSome && isOnline && !isVerifying && isAuthenticated) {
      console.log('[OfflineSyncManager] Detectado pending > 0, mostrando prompt');
      maybePrompt();
    }
  }, [pending, isOnline, isVerifying, isAuthenticated, maybePrompt]);

  // Detectar cuando el usuario se autentica (login después de logout)
  useEffect(() => {
    const justAuthenticated = !wasAuthenticated.current && isAuthenticated;
    wasAuthenticated.current = isAuthenticated;
    if (justAuthenticated && isOnline && !isVerifying) {
      console.log('[OfflineSyncManager] Usuario recién autenticado, verificando pendientes');
      // Esperar un momento para que los servicios se inicialicen
      setTimeout(() => {
        refreshPending().then((count) => {
          if (count > 0) {
            maybePrompt();
          }
        });
      }, 500);
    }
  }, [isAuthenticated, isOnline, isVerifying, maybePrompt, refreshPending]);

  // Banner: mostrar al pasar a offline, auto-ocultar a los 4s para no tapar
  // el botón de guardar. Se puede dismissear manualmente con la X.
  // NO mostrar el banner si aún estamos verificando la conexión.
  useEffect(() => {
    if (isVerifying) {
      // Mientras verificamos, no mostramos nada
      return;
    }
    console.log('[OfflineSyncManager] Estado conexión:', isOnline ? 'ONLINE' : 'OFFLINE');
    if (!isOnline) {
      console.log('[OfflineSyncManager] Mostrando banner offline');
      setBannerVisible(true);
      const timer = setTimeout(() => {
        console.log('[OfflineSyncManager] Auto-ocultando banner offline');
        setBannerVisible(false);
      }, BANNER_AUTOHIDE_MS);
      return () => clearTimeout(timer);
    } else {
      setBannerVisible(false);
    }
  }, [isOnline, isVerifying]);

  const handleUpload = async () => {
    setSyncing(true);
    try {
      // Sincronizar las 4 colas: incidentes + trabajos + departamentos + asignaciones
      const incidentRes = await offlineQueueService.flush();
      const workRes = await workQueueService.flush();
      const deptRes = await departmentQueueService.flush();
      const assignRes = await assignmentQueueService.flush();

      // Combinar resultados
      const totalUploaded = incidentRes.uploaded + workRes.uploaded + deptRes.uploaded + assignRes.uploaded;
      const totalFailed = incidentRes.failed + workRes.failed + deptRes.failed + assignRes.failed;

      setResult({ uploaded: totalUploaded, failed: totalFailed });
    } finally {
      setSyncing(false);
      setPromptVisible(false);
      refreshPending();
    }
  };

  const handleLater = () => setPromptVisible(false);

  return (
    <>
      {!isOnline && bannerVisible && isAuthenticated ? (
        <View style={styles.banner}>
          <MaterialIcons name="cloud-off" size={16} color={COLORS.onPrimary} />
          <Text style={styles.bannerText}>
            Sin conexión
            {(pending + workPending + deptPending + assignPending) > 0
              ? ` · ${pending + workPending + deptPending + assignPending} operación(es) en cola`
              : ' · las operaciones se guardan acá'}
          </Text>
          <TouchableOpacity onPress={() => setBannerVisible(false)} hitSlop={12} style={{ marginLeft: 6 }}>
            <MaterialIcons name="close" size={16} color={COLORS.onPrimary} />
          </TouchableOpacity>
        </View>
      ) : null}

      <Modal transparent visible={promptVisible} animationType="fade" onRequestClose={handleLater}>
        <View style={styles.backdrop}>
          <View style={styles.card}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="cloud-upload" size={26} color={COLORS.primary} />
            </View>
            <Text style={styles.title}>¿Sincronizar operaciones?</Text>
            <Text style={styles.subtitle}>
              {(() => {
                const total = pending + workPending + deptPending + assignPending;
                const parts = [];
                if (pending > 0) parts.push(`${pending} reporte(s)`);
                if (workPending > 0) parts.push(`${workPending} trabajo(s)`);
                if (deptPending > 0) parts.push(`${deptPending} depto(s)`);
                if (assignPending > 0) parts.push(`${assignPending} asignación(es)`);
                return parts.length > 0
                  ? `Tenés ${parts.join(' + ')} pendiente(s). ¿Querés subirlos ahora?`
                  : `Tenés ${total} operación(es) pendiente(s). ¿Querés subirlas ahora?`;
              })()}
            </Text>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.btnSecondary} onPress={handleLater} disabled={syncing} activeOpacity={0.7}>
                <Text style={styles.btnSecondaryText}>Más tarde</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnPrimary} onPress={handleUpload} disabled={syncing} activeOpacity={0.85}>
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

      {/* Aviso breve del resultado de la subida */}
      <Modal
        transparent
        visible={result !== null}
        animationType="fade"
        onRequestClose={() => setResult(null)}
      >
        <View style={styles.backdrop}>
          <View style={styles.card}>
            <View style={styles.iconCircle}>
              <MaterialIcons
                name={result && result.failed === 0 ? 'check-circle' : 'error-outline'}
                size={26}
                color={result && result.failed === 0 ? COLORS.success : COLORS.warning}
              />
            </View>
            <Text style={styles.title}>
              {result && result.failed === 0 ? 'Listo' : 'Subida parcial'}
            </Text>
            <Text style={styles.subtitle}>
              {result
                ? `Subidos: ${result.uploaded}${result.failed > 0 ? ` · Pendientes: ${result.failed}` : ''}` +
                  (result.failed > 0 && result.lastError ? `\n\nMotivo: ${result.lastError}` : '')
                : ''}
            </Text>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.btnPrimary}
                onPress={() => setResult(null)}
                activeOpacity={0.85}
              >
                <Text style={styles.btnPrimaryText}>Entendido</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
