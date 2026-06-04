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
import type { StudentTabScreenProps } from '../../types/navigation';
import { styles } from './MyIncidentsScreen.styles';
import { useAuth } from '../../context/AuthContext';
import { incidentService, IncidentResponse } from '../../services/incidentService';
import ErrorDialog from '../../components/ErrorDialog';
import { useErrorDialog } from '../../hooks/useErrorDialog';

const filters = ['Todas', 'En curso', 'Resueltas', 'Pendientes'];
const dateRanges = ['Cualquier fecha', 'Hoy', 'Semana', 'Mes'];

const STATUS_MAP: Record<string, 'ABIERTO' | 'EN PROCESO' | 'FINALIZADO' | 'PENDIENTE'> = {
  'ABIERTO': 'ABIERTO',
  'EN_PROCESO': 'EN PROCESO',
  'FINALIZADO': 'FINALIZADO',
  'PENDIENTE': 'PENDIENTE',
};

type MyIncidentsScreenProps = StudentTabScreenProps<'StudentIncidents'>;

export default function MyIncidentsScreen({ navigation }: MyIncidentsScreenProps) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + insets.bottom;

  const { user } = useAuth();
  const { dialogState, hideDialog, showError } = useErrorDialog();

  const [allIncidents, setAllIncidents] = useState<IncidentResponse[]>([]);
  const [filteredIncidents, setFilteredIncidents] = useState<IncidentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [active, setActive] = useState(0);
  const [dateIdx, setDateIdx] = useState(0);

  const loadIncidents = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const data = await incidentService.getAll();
      const userIncidents = data
        .filter(inc => inc.user.id === user?.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setAllIncidents(userIncidents);
      applyFilters(userIncidents, active, dateIdx);
    } catch (error: any) {
      console.error('[MyIncidentsScreen] Error al cargar incidencias:', error);
      showError('Error', error.message || 'No se pudieron cargar las incidencias');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const applyFilters = (incidents: IncidentResponse[], statusFilter: number, dateFilter: number) => {
    let filtered = [...incidents];

    // Filtro por estado
    if (statusFilter === 1) { // En curso
      filtered = filtered.filter(inc => inc.status === 'EN_PROCESO' || inc.status === 'ABIERTO');
    } else if (statusFilter === 2) { // Resueltas
      filtered = filtered.filter(inc => inc.status === 'FINALIZADO');
    } else if (statusFilter === 3) { // Pendientes
      filtered = filtered.filter(inc => inc.status === 'PENDIENTE');
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
    applyFilters(allIncidents, active, dateIdx);
  }, [active, dateIdx]);

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
        rightActions={[
          { icon: 'search' },
          { icon: 'notifications', onPress: () => navigation.navigate('StudentNotifications') },
        ]}
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

        <Text style={styles.summary}>{allIncidents.length} reportes en total</Text>

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

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
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
          <View style={[styles.list, { paddingBottom: tabBarHeight + 60 }]}>
            {filteredIncidents.map((inc) => {
              const statusSubtext = inc.assignedWorker
                ? `Técnico: ${inc.assignedWorker.fullName}`
                : inc.status === 'FINALIZADO'
                ? 'Cerrada'
                : null;

              return (
                <TouchableOpacity
                  key={inc.id}
                  style={styles.card}
                  onPress={() => navigation.navigate('IncidentDetail', { incident: inc as any })}
                  activeOpacity={0.7}
                >
                  <View style={styles.cardTop}>
                    <View style={styles.cardInfo}>
                      <Text style={styles.cardTitle} numberOfLines={2}>{inc.title}</Text>
                      <Text style={styles.cardLocation}>{inc.department.name}</Text>
                    </View>
                    <StatusBadge status={STATUS_MAP[inc.status] || 'ABIERTO'} />
                  </View>
                  <View style={styles.cardMeta}>
                    {inc.priority === 'ALTA' && (
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
        )}
      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, { bottom: tabBarHeight + 16 }]}
        onPress={() => navigation.navigate('CreateIncident')}
        activeOpacity={0.85}
      >
        <MaterialIcons name="add" size={22} color={COLORS.onPrimary} />
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
