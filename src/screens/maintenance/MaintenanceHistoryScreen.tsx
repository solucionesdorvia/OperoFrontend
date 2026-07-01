import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../../../constants/colors';
import TopAppBar from '../../components/TopAppBar';
import EmptyState from '../../components/EmptyState';
import LoadingView from '../../components/LoadingView';
import Pagination from '../../components/Pagination';
import type { MaintenanceTabScreenProps } from '../../types/navigation';
import { styles } from './MaintenanceHistoryScreen.styles';
import { useAuth } from '../../context/AuthContext';
import { incidentService, IncidentResponse } from '../../services/incidentService';
import { incidentCacheService } from '../../services/incidentCacheService';
import ErrorDialog from '../../components/ErrorDialog';
import { useErrorDialog } from '../../hooks/useErrorDialog';
import { formatDate } from '../../utils/dateUtils';
import { useNetwork } from '../../hooks/useNetwork';

const ITEMS_PER_PAGE = 5;
const periods = ['Hoy', 'Semana', 'Mes', 'Todo'];

type MaintenanceHistoryScreenProps = MaintenanceTabScreenProps<'MaintenanceHistory'>;

export default function MaintenanceHistoryScreen({ navigation }: MaintenanceHistoryScreenProps) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + insets.bottom;
  const { user } = useAuth();
  const { isOnline } = useNetwork();

  const [allHistory, setAllHistory] = useState<IncidentResponse[]>([]);
  const [filtered, setFiltered] = useState<IncidentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [period, setPeriod] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const { dialogState, hideDialog, showError } = useErrorDialog();

  const loadHistory = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      let incidents: IncidentResponse[] = [];

      if (isOnline) {
        try {
          incidents = await incidentService.getAll();
          await incidentCacheService.save(incidents);
        } catch (error: any) {
          console.log('[MaintenanceHistory] Error, usando caché');
          const cached = await incidentCacheService.load();
          incidents = cached || [];
        }
      } else {
        console.log('[MaintenanceHistory] Offline, cargando caché');
        const cached = await incidentCacheService.load();
        incidents = cached || [];
      }

      const myCompleted = incidents
        .filter(inc => inc.workerId === user?.id && inc.status === 'FINISHED')
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

      setAllHistory(myCompleted);
      applyFilter(myCompleted, period);
    } catch (error: any) {
      console.error('[MaintenanceHistoryScreen] Error al cargar historial:', error);
      // No mostrar error - el caché ya maneja offline
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const applyFilter = (history: IncidentResponse[], filterIdx: number) => {
    const now = new Date();
    let result = [...history];

    if (filterIdx === 0) { // Hoy
      result = result.filter(inc => {
        const updated = new Date(inc.updatedAt);
        return updated.toDateString() === now.toDateString();
      });
    } else if (filterIdx === 1) { // Semana
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      result = result.filter(inc => new Date(inc.updatedAt) >= weekAgo);
    } else if (filterIdx === 2) { // Mes
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      result = result.filter(inc => new Date(inc.updatedAt) >= monthAgo);
    }
    // filterIdx === 3: Todo (sin filtrar)

    setFiltered(result);
    setCurrentPage(1); // Reset a página 1 cuando cambia el filtro
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadHistory();
    }, [])
  );

  // Reaplicar filtro cuando cambian datos o periodo
  useEffect(() => {
    if (allHistory.length > 0) {
      applyFilter(allHistory, period);
    }
  }, [allHistory, period]);


  if (loading) return <LoadingView showLogo showAvatar onAvatarPress={() => navigation.navigate('MaintenanceProfile')} />;

  return (
    <View style={styles.container}>
      <TopAppBar showLogo showAvatar onAvatarPress={() => navigation.navigate('MaintenanceProfile')} />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: tabBarHeight + 40 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => loadHistory(true)} />
        }
      >

        <View style={styles.header}>
          <Text style={styles.title}>Historial</Text>
          <Text style={styles.sub}>Tareas finalizadas</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
          <View style={styles.filters}>
            {periods.map((p, i) => (
              <TouchableOpacity
                key={p}
                style={[styles.filterBtn, period === i && styles.filterBtnActive]}
                onPress={() => setPeriod(i)}
              >
                <Text style={[styles.filterText, period === i && styles.filterTextActive]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{filtered.length}</Text>
            <Text style={styles.statLabel}>Finalizadas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNum}>{allHistory.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNum}>{periods[period]}</Text>
            <Text style={styles.statLabel}>Período</Text>
          </View>
        </View>

        {filtered.length === 0 ? (
          <EmptyState message="No hay tareas finalizadas en este período" />
        ) : (
          <>
            <View style={styles.list}>
              {filtered
                .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
                .map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.card}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('MaintenanceDetail', { task: item as any })}
                  >
                    <View style={styles.iconWrap}>
                      <MaterialIcons name="check-circle" size={18} color={COLORS.primary} />
                    </View>
                <View style={styles.cardBody}>
                  <View style={styles.cardTop}>
                    <Text style={styles.code}>#INC-{item.id}</Text>
                    <Text style={styles.date}>{formatDate(item.updatedAt)}</Text>
                  </View>
                  <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                  <View style={styles.meta}>
                    <View style={styles.metaItem}>
                      <MaterialIcons name="location-on" size={12} color={COLORS.onSurfaceVariant} />
                      <Text style={styles.metaText} numberOfLines={1}>{item.departmentName}</Text>
                    </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filtered.length / ITEMS_PER_PAGE)}
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
