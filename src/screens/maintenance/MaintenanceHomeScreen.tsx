import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../../../constants/colors';
import TopAppBar from '../../components/TopAppBar';
import EmptyState from '../../components/EmptyState';
import LoadingView from '../../components/LoadingView';
import type { MaintenanceTabScreenProps } from '../../types/navigation';
import { styles } from './MaintenanceHomeScreen.styles';
import { useAuth } from '../../context/AuthContext';
import { incidentService, IncidentResponse } from '../../services/incidentService';
import { incidentCacheService } from '../../services/incidentCacheService';
import { workQueueService } from '../../services/workQueueService';
import ErrorDialog from '../../components/ErrorDialog';
import { useErrorDialog } from '../../hooks/useErrorDialog';
import { getRelativeTime } from '../../utils/dateUtils';
import { useNetwork } from '../../hooks/useNetwork';

const priorityConfig = {
  HIGH: { color: COLORS.error,   label: 'Urgente' },
  MEDIUM: { color: COLORS.primary, label: 'Media'   },
  LOW: { color: COLORS.outline, label: 'Baja' },
};

type MaintenanceHomeScreenProps = MaintenanceTabScreenProps<'MaintenanceHomeTab'>;

export default function MaintenanceHomeScreen({ navigation }: MaintenanceHomeScreenProps) {
  const { user } = useAuth();
  const { isOnline } = useNetwork();
  const [myTasks, setMyTasks] = useState<IncidentResponse[]>([]);
  const [stats, setStats] = useState({ asignadas: 0, completadasHoy: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const { dialogState, hideDialog, showError, showSuccess } = useErrorDialog();

  const loadData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      let incidents: IncidentResponse[] = [];

      if (isOnline) {
        try {
          incidents = await incidentService.getAll();
          await incidentCacheService.save(incidents);
        } catch (error: any) {
          console.log('[MaintenanceHome] Error, usando caché');
          const cached = await incidentCacheService.load();
          incidents = cached || [];
        }
      } else {
        console.log('[MaintenanceHome] Offline, cargando caché');
        const cached = await incidentCacheService.load();
        incidents = cached || [];
      }

      const assigned = incidents.filter(inc => inc.workerId === user?.id);

      const sorted = assigned
        .filter(inc => inc.status !== 'FINISHED')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 2);

      setMyTasks(sorted);

      const today = new Date();
      const completedToday = assigned.filter(inc => {
        if (inc.status !== 'FINISHED') return false;
        const updated = new Date(inc.updatedAt);
        return updated.toDateString() === today.toDateString();
      });

      setStats({
        asignadas: assigned.filter(inc => inc.status !== 'FINISHED').length,
        completadasHoy: completedToday.length,
      });
    } catch (error: any) {
      console.error('[MaintenanceHomeScreen] Error al cargar datos:', error);
      // No mostrar error - el caché ya maneja offline
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    updatePendingCount();

    const unsubscribe = workQueueService.subscribe(() => {
      updatePendingCount();
    });
    return unsubscribe;
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
      updatePendingCount();
    }, [])
  );

  const updatePendingCount = async () => {
    const count = (await workQueueService.getAll()).length;
    setPendingCount(count);
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      const result = await workQueueService.flush();
      if (result.failed === 0) {
        showSuccess('Sincronizado', `${result.uploaded} operación(es) subida(s) correctamente.`);
      } else {
        showError('Sincronización parcial', `Subidos: ${result.uploaded}, Fallidos: ${result.failed}`);
      }
      await loadData(true);
    } catch (error: any) {
      showError('Error', error.message || 'No se pudo sincronizar');
    } finally {
      setSyncing(false);
    }
  };

  const firstName = user?.fullName?.split(' ')[0] || 'Operario';

  if (loading) return <LoadingView showLogo showAvatar onAvatarPress={() => navigation.navigate('MaintenanceProfile')} />;

  return (
    <View style={styles.container}>
      <TopAppBar showLogo showAvatar onAvatarPress={() => navigation.navigate('MaintenanceProfile')} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => loadData(true)} />
        }
      >

        <View style={styles.header}>
          <Text style={styles.greeting}>Hola, {firstName}</Text>
          <View style={styles.statsRow}>
            <Text style={styles.stat}><Text style={styles.statNum}>{stats.asignadas}</Text> asignadas</Text>
            <Text style={styles.sep}>·</Text>
            <Text style={styles.stat}><Text style={styles.statNum}>{stats.completadasHoy}</Text> completadas hoy</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tareas asignadas</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              {isOnline && pendingCount > 0 && (
                <TouchableOpacity
                  onPress={handleSync}
                  disabled={syncing}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    backgroundColor: COLORS.primary,
                    borderRadius: 6,
                  }}
                  activeOpacity={0.7}
                >
                  {syncing ? (
                    <ActivityIndicator size="small" color={COLORS.onPrimary} />
                  ) : (
                    <>
                      <MaterialIcons name="cloud-upload" size={14} color={COLORS.onPrimary} />
                      <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.onPrimary }}>
                        Subir {pendingCount}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => navigation.navigate('MaintenanceHistory')}>
                <Text style={styles.seeAll}>Ver historial</Text>
              </TouchableOpacity>
            </View>
          </View>

          {myTasks.length === 0 ? (
            <EmptyState icon="check-circle" message="No tenés tareas pendientes" />
          ) : (
            <View style={styles.list}>
              {myTasks.map((task) => {
                const priority = (task.priority || 'MEDIUM') as 'HIGH' | 'MEDIUM' | 'LOW';
                const cfg = priorityConfig[priority];
                // Barra verde si está EN_PROCESS (comenzada), sino color de prioridad
                const barColor = task.status === 'IN_PROCESS' ? COLORS.success : cfg.color;
                return (
                  <TouchableOpacity
                    key={task.id}
                    style={styles.taskCard}
                    onPress={() => navigation.navigate('MaintenanceDetail', { task: task as any })}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.priorityBar, { backgroundColor: barColor }]} />
                    <View style={styles.taskBody}>
                      <View style={styles.taskTop}>
                        <View style={styles.priorityTag}>
                          <View style={[styles.dot, { backgroundColor: cfg.color }]} />
                          <Text style={[styles.priorityLabel, { color: cfg.color }]}>{cfg.label}</Text>
                        </View>
                        <Text style={styles.taskCode}>#INC-{task.id}</Text>
                      </View>
                      <Text style={styles.taskTitle} numberOfLines={2}>{task.title}</Text>
                      <View style={styles.taskMeta}>
                        <View style={styles.metaItem}>
                          <MaterialIcons name="location-on" size={13} color={COLORS.onSurfaceVariant} />
                          <Text style={styles.metaText}>{task.departmentName}</Text>
                        </View>
                        <View style={styles.metaItem}>
                          <MaterialIcons name="schedule" size={13} color={COLORS.onSurfaceVariant} />
                          <Text style={styles.metaText}>{getRelativeTime(task.createdAt)}</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

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
