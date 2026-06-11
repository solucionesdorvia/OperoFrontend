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
import type { MaintenanceTabScreenProps } from '../../types/navigation';
import { styles } from './MaintenanceHistoryScreen.styles';
import { useAuth } from '../../context/AuthContext';
import { incidentService, IncidentResponse } from '../../services/incidentService';
import ErrorDialog from '../../components/ErrorDialog';
import { useErrorDialog } from '../../hooks/useErrorDialog';
import { formatDate } from '../../utils/dateUtils';

const periods = ['Hoy', 'Semana', 'Mes', 'Todo'];

type MaintenanceHistoryScreenProps = MaintenanceTabScreenProps<'MaintenanceHistory'>;

export default function MaintenanceHistoryScreen({ navigation }: MaintenanceHistoryScreenProps) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + insets.bottom;
  const { user } = useAuth();

  const [allHistory, setAllHistory] = useState<IncidentResponse[]>([]);
  const [filtered, setFiltered] = useState<IncidentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [period, setPeriod] = useState(1);
  const { dialogState, hideDialog, showError } = useErrorDialog();

  const loadHistory = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const incidents = await incidentService.getAll();
      const myCompleted = incidents
        .filter(inc => inc.workerId === user?.id && inc.status === 'FINISHED')
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

      setAllHistory(myCompleted);
      applyFilter(myCompleted, period);
    } catch (error: any) {
      console.error('[MaintenanceHistoryScreen] Error al cargar historial:', error);
      showError('Error', error.message || 'No se pudo cargar el historial');
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
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadHistory();
    }, [])
  );

  useEffect(() => {
    applyFilter(allHistory, period);
  }, [period]);


  if (loading) return <LoadingView showLogo rightIcon="search" showAvatar />;

  return (
    <View style={styles.container}>
      <TopAppBar showLogo rightIcon="search" showAvatar />
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
          <View style={styles.list}>
            {filtered.map((item) => (
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
