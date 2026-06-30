import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../../../constants/colors';
import TopAppBar from '../../components/TopAppBar';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import LoadingView from '../../components/LoadingView';
import Pagination from '../../components/Pagination';
import type { ManagerTabScreenProps } from '../../types/navigation';
import { styles } from './ManagerIncidentsListScreen.styles';
import { incidentService, IncidentResponse } from '../../services/incidentService';
import { incidentCacheService } from '../../services/incidentCacheService';
import ErrorDialog from '../../components/ErrorDialog';
import { useErrorDialog } from '../../hooks/useErrorDialog';
import { getRelativeTime } from '../../utils/dateUtils';
import { useNetwork } from '../../hooks/useNetwork';

const ITEMS_PER_PAGE = 5;
const filters = ['Todas', 'Abiertas', 'En proceso', 'Finalizadas'] as const;

const STATUS_MAP: Record<string, 'ABIERTO' | 'EN PROCESO' | 'FINALIZADO' | 'PENDIENTE'> = {
  'PENDING': 'PENDIENTE',
  'PENDING_ASSIGNMENT': 'PENDIENTE',
  'ASSIGNED': 'ABIERTO',
  'IN_PROCESS': 'EN PROCESO',
  'FINISHED': 'FINALIZADO',
};

const priorityColor = { HIGH: COLORS.error, MEDIUM: COLORS.primary, LOW: COLORS.outline };

type ManagerIncidentsListScreenProps = ManagerTabScreenProps<'ManagerIncidents'>;

export default function ManagerIncidentsListScreen({ navigation }: ManagerIncidentsListScreenProps) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + insets.bottom;

  const [allIncidents, setAllIncidents] = useState<IncidentResponse[]>([]);
  const [filteredIncidents, setFilteredIncidents] = useState<IncidentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [active, setActive] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { dialogState, hideDialog, showError } = useErrorDialog();
  const { isOnline } = useNetwork();

  const loadIncidents = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      let data: IncidentResponse[] = [];

      if (isOnline) {
        try {
          data = await incidentService.getAll();
          await incidentCacheService.save(data);
        } catch (error: any) {
          console.log('[ManagerIncidentsList] Error al cargar del servidor, usando caché');
          const cached = await incidentCacheService.load();
          data = cached || [];
        }
      } else {
        console.log('[ManagerIncidentsList] Sin conexión, cargando desde caché');
        const cached = await incidentCacheService.load();
        data = cached || [];
      }

      const sorted = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setAllIncidents(sorted);
      applyFilter(sorted, active);
    } catch (error: any) {
      console.error('[ManagerIncidentsListScreen] Error al cargar incidencias:', error);
      // No mostrar error - el caché ya maneja offline
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const applyFilter = (incidents: IncidentResponse[], filterIdx: number) => {
    let filtered = [...incidents];

    if (filterIdx === 1) { // Abiertas
      filtered = filtered.filter(inc => inc.status === 'ASSIGNED');
    } else if (filterIdx === 2) { // En proceso
      filtered = filtered.filter(inc => inc.status === 'IN_PROCESS');
    } else if (filterIdx === 3) { // Finalizadas
      filtered = filtered.filter(inc => inc.status === 'FINISHED');
    }

    setFilteredIncidents(filtered);
    setCurrentPage(1); // Reset a página 1 cuando cambia el filtro
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadIncidents();
    }, [])
  );

  useEffect(() => {
    applyFilter(allIncidents, active);
  }, [active]);


  if (loading) return <LoadingView showLogo showAvatar onAvatarPress={() => navigation.navigate('ManagerProfile' as any)} />;

  return (
    <View style={styles.container}>
      <TopAppBar showLogo showAvatar onAvatarPress={() => navigation.navigate('ManagerProfile' as any)} />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: tabBarHeight + 40 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => loadIncidents(true)} />
        }
      >

        <View style={styles.header}>
          <Text style={styles.title}>Incidencias</Text>
          <Text style={styles.sub}>{allIncidents.length} reportes en total</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
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

        {filteredIncidents.length === 0 ? (
          <EmptyState message="No hay incidencias con este filtro" />
        ) : (
          <>
            <View style={styles.list}>
              {filteredIncidents
                .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
                .map((inc) => {
                  const priority = (inc.priority || 'MEDIUM') as 'HIGH' | 'MEDIUM' | 'LOW';
                  return (
                    <TouchableOpacity
                      key={inc.id}
                      style={styles.card}
                      onPress={() => navigation.navigate('ManagerIncidentDetail', { incident: inc as any })}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.priorityBar, { backgroundColor: priorityColor[priority] }]} />
                      <View style={styles.cardBody}>
                        <View style={styles.cardTop}>
                          <Text style={styles.code}>#INC-{inc.id}</Text>
                          <StatusBadge status={STATUS_MAP[inc.status] || 'ABIERTO'} />
                        </View>
                        <Text style={styles.cardTitle} numberOfLines={2}>{inc.title}</Text>
                        <View style={styles.meta}>
                          <View style={styles.metaItem}>
                            <MaterialIcons name="location-on" size={12} color={COLORS.onSurfaceVariant} />
                            <Text style={styles.metaText} numberOfLines={1}>{inc.departmentName}</Text>
                          </View>
                        </View>
                        <View style={styles.footer}>
                          <View style={styles.metaItem}>
                            <MaterialIcons
                              name={inc.workerName ? 'person' : 'person-off'}
                              size={13}
                              color={inc.workerName ? COLORS.primary : COLORS.onSurfaceVariant}
                            />
                            <Text style={[styles.assignee, !inc.workerName && { color: COLORS.onSurfaceVariant, fontStyle: 'italic' }]}>
                              {inc.workerName ?? 'Sin asignar'}
                            </Text>
                          </View>
                          <Text style={styles.time}>{getRelativeTime(inc.createdAt)}</Text>
                        </View>
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
