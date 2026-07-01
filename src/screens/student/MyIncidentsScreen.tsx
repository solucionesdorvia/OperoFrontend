import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';
import TopAppBar from '../../components/TopAppBar';
import StatusBadge from '../../components/StatusBadge';
import Pagination from '../../components/Pagination';
import type { StudentTabScreenProps } from '../../types/navigation';
import { styles } from './MyIncidentsScreen.styles';
import { useAuth } from '../../context/AuthContext';
import { incidentService, IncidentResponse } from '../../services/incidentService';
import { offlineQueueService, PendingIncident } from '../../services/offlineQueueService';
import { incidentCacheService } from '../../services/incidentCacheService';
import ErrorDialog from '../../components/ErrorDialog';
import { useErrorDialog } from '../../hooks/useErrorDialog';
import { getRelativeTime } from '../../utils/dateUtils';
import { useNetwork } from '../../hooks/useNetwork';

const ITEMS_PER_PAGE = 5;

const filters = ['Todas', 'En curso', 'Resueltas', 'Pendientes'];
const dateRanges = ['Cualquier fecha', 'Hoy', 'Semana', 'Mes'];

const STATUS_MAP: Record<string, 'ABIERTO' | 'EN PROCESO' | 'FINALIZADO' | 'PENDIENTE'> = {
  'PENDING': 'PENDIENTE',
  'PENDING_ASSIGNMENT': 'PENDIENTE',
  'ASSIGNED': 'ABIERTO',
  'IN_PROCESS': 'EN PROCESO',
  'FINISHED': 'FINALIZADO',
};

type MyIncidentsScreenProps = StudentTabScreenProps<'StudentIncidents'>;

export default function MyIncidentsScreen({ navigation }: MyIncidentsScreenProps) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + insets.bottom;

  const { user } = useAuth();
  const { dialogState, hideDialog, showError, showSuccess } = useErrorDialog();
  const { isOnline } = useNetwork();

  const [allIncidents, setAllIncidents] = useState<IncidentResponse[]>([]);
  const [filteredIncidents, setFilteredIncidents] = useState<IncidentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [active, setActive] = useState(0);
  const [dateIdx, setDateIdx] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [syncing, setSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const loadIncidents = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      // Cargar incidentes del servidor (solo si hay conexión)
      let serverIncidents: IncidentResponse[] = [];

      if (isOnline) {
        try {
          const data = await incidentService.getAll();
          serverIncidents = data.filter(inc => inc.reporterId === user?.id);
          // Guardar en caché para uso offline
          await incidentCacheService.save(serverIncidents);
        } catch (error: any) {
          console.log('[MyIncidentsScreen] Error al cargar del servidor, usando caché:', error);
          // Si falla, cargar del caché
          const cached = await incidentCacheService.load();
          serverIncidents = cached || [];
        }
      } else {
        // Sin conexión: cargar del caché
        console.log('[MyIncidentsScreen] Sin conexión, cargando desde caché');
        const cached = await incidentCacheService.load();
        serverIncidents = cached || [];
      }

      // Cargar incidentes offline
      const offlineIncidents = await offlineQueueService.getAll();

      // Convertir incidentes offline a formato IncidentResponse
      const offlineAsIncidents: IncidentResponse[] = offlineIncidents.map((pending: PendingIncident, idx: number) => ({
        id: -(idx + 1), // ID negativo para distinguir de los del servidor
        title: pending.title,
        description: pending.description,
        status: 'OFFLINE' as any, // Estado especial para offline
        priority: 'MEDIA',
        createdAt: pending.timestamp,
        updatedAt: pending.timestamp,
        reporterId: user?.id || 0,
        reporterName: user?.fullName || 'Tú',
        departmentId: pending.departmentId,
        departmentName: pending.departmentName || 'Sin departamento',
        locationId: null,
        locationName: pending.location || 'Sin ubicación',
        photoUrl: pending.photoUri || null,
        assignedToId: null,
        assignedToName: null,
      }));

      // Combinar ambos y ordenar por fecha
      const allUserIncidents = [...serverIncidents, ...offlineAsIncidents]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setAllIncidents(allUserIncidents);
      applyFilters(allUserIncidents, active, dateIdx);
    } catch (error: any) {
      console.error('[MyIncidentsScreen] Error al cargar incidencias:', error);
      // No mostrar error si es problema de conexión - el caché ya maneja offline
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleManualSync = async () => {
    if (!isOnline) {
      showError('Sin conexión', 'No hay conexión a internet. Conectate para sincronizar.');
      return;
    }

    if (pendingCount === 0) {
      showError('Sin pendientes', 'No hay incidentes pendientes para sincronizar.');
      return;
    }

    setSyncing(true);
    try {
      const result = await offlineQueueService.flush();
      if (result.failed === 0) {
        showSuccess('Sincronizado', `${result.uploaded} incidente(s) subido(s) correctamente.`);
      } else {
        showError('Sincronización parcial', `Subidos: ${result.uploaded}, Fallidos: ${result.failed}`);
      }
      await loadIncidents(true);
    } catch (error: any) {
      showError('Error', error.message || 'No se pudo sincronizar');
    } finally {
      setSyncing(false);
    }
  };

  const applyFilters = (incidents: IncidentResponse[], statusFilter: number, dateFilter: number) => {
    let filtered = [...incidents];

    // Filtro por estado
    if (statusFilter === 1) { // En curso
      filtered = filtered.filter(inc => inc.status === 'IN_PROCESS' || inc.status === 'ASSIGNED');
    } else if (statusFilter === 2) { // Resueltas
      filtered = filtered.filter(inc => inc.status === 'FINISHED');
    } else if (statusFilter === 3) { // Pendientes
      filtered = filtered.filter(inc => inc.status === 'PENDING' || inc.status === 'PENDING_ASSIGNMENT');
    }

    // Filtro por fecha
    const now = new Date();
    if (dateFilter === 1) { // Hoy
      filtered = filtered.filter(inc => {
        const created = new Date(inc.createdAt);
        return created.toDateString() === now.toDateString();
      });
    } else if (dateFilter === 2) { // Semana
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(inc => new Date(inc.createdAt) >= weekAgo);
    } else if (dateFilter === 3) { // Mes
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(inc => new Date(inc.createdAt) >= monthAgo);
    }

    setFilteredIncidents(filtered);
    setCurrentPage(1); // Reset a página 1 cuando cambian los filtros
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadIncidents();
    }, [])
  );

  // Recargar cuando cambie la cola offline (se guarde o sincronice)
  useEffect(() => {
    const updatePendingCount = async () => {
      const count = await offlineQueueService.count();
      setPendingCount(count);
    };

    updatePendingCount();

    const unsubscribe = offlineQueueService.subscribe(() => {
      console.log('[MyIncidentsScreen] Cola offline cambió, recargando...');
      updatePendingCount();
      loadIncidents();
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    applyFilters(allIncidents, active, dateIdx);
  }, [active, dateIdx]);


  if (loading) {
    return (
      <View style={styles.container}>
        <TopAppBar showLogo showAvatar onAvatarPress={() => navigation.navigate('StudentProfile')} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopAppBar
        showLogo
        showAvatar
        onAvatarPress={() => navigation.navigate('StudentProfile')}
      />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => loadIncidents(true)} />
        }
      >

        {/* Header con contador y botón sync */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={styles.summary}>{allIncidents.length} reportes totales</Text>

          {pendingCount > 0 && (
            <TouchableOpacity
              onPress={handleManualSync}
              disabled={!isOnline || syncing}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                backgroundColor: isOnline ? COLORS.primary : COLORS.surfaceVariant,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 16,
                opacity: (!isOnline || syncing) ? 0.6 : 1,
              }}
              activeOpacity={0.7}
            >
              {syncing ? (
                <ActivityIndicator size="small" color={COLORS.onPrimary} />
              ) : (
                <MaterialIcons name="cloud-upload" size={16} color={isOnline ? COLORS.onPrimary : COLORS.onSurfaceVariant} />
              )}
              <Text style={{
                fontSize: 12,
                fontFamily: FONTS.family.monoSemiBold,
                color: isOnline ? COLORS.onPrimary : COLORS.onSurfaceVariant,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}>
                {syncing ? 'Sincronizando...' : `Subir ${pendingCount}`}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.filtersScroll, { marginBottom: 16 }]}>
          <View style={styles.filters}>
            {filters.map((f, i) => (
              <TouchableOpacity
                key={f}
                style={[styles.filterBtn, active === i && styles.filterBtnActive]}
                onPress={() => setActive(i)}
              >
                <Text style={[styles.filterText, active === i && styles.filterTextActive]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.filtersScroll, { marginBottom: 16 }]}>
          <View style={styles.filters}>
            {dateRanges.map((d, i) => (
              <TouchableOpacity
                key={d}
                style={[styles.dateBtn, dateIdx === i && styles.dateBtnActive]}
                onPress={() => setDateIdx(i)}
              >
                <MaterialIcons
                  name="event"
                  size={13}
                  color={dateIdx === i ? COLORS.onSurface : COLORS.onSurfaceVariant}
                />
                <Text style={[styles.filterText, dateIdx === i && styles.filterTextActive]}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {filteredIncidents.length === 0 ? (
          <View style={{ padding: 24, alignItems: 'center' }}>
            <Text style={{ color: COLORS.textMuted, fontSize: 15 }}>
              No hay incidencias con estos filtros
            </Text>
          </View>
        ) : (
          <>
            <View style={[styles.list, { paddingBottom: tabBarHeight + 60 }]}>
              {filteredIncidents
                .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
                .map((inc) => {
                  const statusSubtext = inc.workerName
                    ? `Técnico: ${inc.workerName}`
                    : inc.status === 'FINISHED'
                    ? 'Cerrada'
                    : null;

                  return (
                    <TouchableOpacity
                      key={inc.id}
                      style={styles.card}
                      onPress={() => {
                        if (inc.id < 0) {
                          // Incidente offline - no abrir detalle
                          showError('Incidente offline', 'Este incidente aún no se ha subido al servidor. Sincronizalo primero para ver los detalles.');
                        } else {
                          navigation.navigate('IncidentDetail', { incident: inc as any });
                        }
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={styles.cardTop}>
                        <View style={styles.cardInfo}>
                          <Text style={styles.cardTitle} numberOfLines={2}>{inc.title}</Text>
                          <Text style={styles.cardLocation}>{inc.departmentName}</Text>
                        </View>
                        <StatusBadge status={STATUS_MAP[inc.status] || 'ABIERTO'} />
                      </View>
                      <View style={styles.cardMeta}>
                        {inc.priority === 'HIGH' && (
                          <View style={styles.priorityTag}>
                            <Text style={styles.priorityText}>Prioridad alta</Text>
                          </View>
                        )}
                        <Text style={styles.metaText}>{getRelativeTime(inc.createdAt)}</Text>
                        {statusSubtext && <Text style={styles.metaSub}>{statusSubtext}</Text>}
                      </View>
                    </TouchableOpacity>
                  );
                })}
            </View>
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredIncidents.length / ITEMS_PER_PAGE)}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, { bottom: 24 }]}
        onPress={() => navigation.navigate('CreateIncident')}
        activeOpacity={0.85}
      >
        <MaterialIcons name="add" size={20} color={COLORS.onPrimary} />
        <Text style={styles.fabText}>Nuevo reporte</Text>
      </TouchableOpacity>

      <ErrorDialog
        visible={dialogState.visible}
        type={dialogState.type}
        title={dialogState.title}
        message={dialogState.message}
        buttons={dialogState.buttons}
        onDismiss={hideDialog}
      />
    </View>
  );
}
