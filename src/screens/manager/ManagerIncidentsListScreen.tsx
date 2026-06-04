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
import type { ManagerTabScreenProps } from '../../types/navigation';
import { styles } from './ManagerIncidentsListScreen.styles';
import { incidentService, IncidentResponse } from '../../services/incidentService';
import ErrorDialog from '../../components/ErrorDialog';
import { useErrorDialog } from '../../hooks/useErrorDialog';

const filters = ['Todas', 'Abiertas', 'En proceso', 'Finalizadas'] as const;

const STATUS_MAP: Record<string, 'ABIERTO' | 'EN PROCESO' | 'FINALIZADO' | 'PENDIENTE'> = {
  'ABIERTO': 'ABIERTO',
  'EN_PROCESO': 'EN PROCESO',
  'FINALIZADO': 'FINALIZADO',
  'PENDIENTE': 'PENDIENTE',
};

const priorityColor = { ALTA: COLORS.error, MEDIA: COLORS.primary, BAJA: COLORS.outline };

type ManagerIncidentsListScreenProps = ManagerTabScreenProps<'ManagerIncidents'>;

export default function ManagerIncidentsListScreen({ navigation }: ManagerIncidentsListScreenProps) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + insets.bottom;

  const [allIncidents, setAllIncidents] = useState<IncidentResponse[]>([]);
  const [filteredIncidents, setFilteredIncidents] = useState<IncidentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [active, setActive] = useState(0);
  const { dialogState, hideDialog, showError } = useErrorDialog();

  const loadIncidents = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const data = await incidentService.getAll();
      const sorted = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setAllIncidents(sorted);
      applyFilter(sorted, active);
    } catch (error: any) {
      console.error('[ManagerIncidentsListScreen] Error al cargar incidencias:', error);
      showError('Error', error.message || 'No se pudieron cargar las incidencias');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const applyFilter = (incidents: IncidentResponse[], filterIdx: number) => {
    let filtered = [...incidents];

    if (filterIdx === 1) { // Abiertas
      filtered = filtered.filter(inc => inc.status === 'ABIERTO');
    } else if (filterIdx === 2) { // En proceso
      filtered = filtered.filter(inc => inc.status === 'EN_PROCESO');
    } else if (filterIdx === 3) { // Finalizadas
      filtered = filtered.filter(inc => inc.status === 'FINALIZADO');
    }

    setFilteredIncidents(filtered);
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

  const getRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays === 1) return 'Ayer';
    return `Hace ${diffDays} días`;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <TopAppBar showLogo rightIcon="search" showAvatar />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopAppBar showLogo rightIcon="search" showAvatar />
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
          <View style={{ padding: 24, alignItems: 'center' }}>
            <Text style={{ color: COLORS.textMuted, fontSize: 15 }}>
              No hay incidencias con este filtro
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {filteredIncidents.map((inc) => {
              const priority = (inc.priority || 'MEDIA') as 'ALTA' | 'MEDIA' | 'BAJA';
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
                        <Text style={styles.metaText} numberOfLines={1}>{inc.department.name}</Text>
                      </View>
                    </View>
                    <View style={styles.footer}>
                      <View style={styles.metaItem}>
                        <MaterialIcons
                          name={inc.assignedWorker ? 'person' : 'person-off'}
                          size={13}
                          color={inc.assignedWorker ? COLORS.primary : COLORS.onSurfaceVariant}
                        />
                        <Text style={[styles.assignee, !inc.assignedWorker && { color: COLORS.onSurfaceVariant, fontStyle: 'italic' }]}>
                          {inc.assignedWorker?.fullName ?? 'Sin asignar'}
                        </Text>
                      </View>
                      <Text style={styles.time}>{getRelativeTime(inc.createdAt)}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
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
