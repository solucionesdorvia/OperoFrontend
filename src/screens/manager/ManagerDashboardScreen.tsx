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
import type { ManagerTabScreenProps } from '../../types/navigation';
import { styles } from './ManagerDashboardScreen.styles';
import { incidentService, IncidentResponse } from '../../services/incidentService';
import { incidentCacheService } from '../../services/incidentCacheService';
import ErrorDialog from '../../components/ErrorDialog';
import { useErrorDialog } from '../../hooks/useErrorDialog';
import { getRelativeTime } from '../../utils/dateUtils';
import { useNetwork } from '../../hooks/useNetwork';

const priorityColor = { HIGH: COLORS.error, MEDIUM: COLORS.primary, LOW: COLORS.outline };

type ManagerDashboardScreenProps = ManagerTabScreenProps<'ManagerHome'>;

export default function ManagerDashboardScreen({ navigation }: ManagerDashboardScreenProps) {
  const [incidents, setIncidents] = useState<IncidentResponse[]>([]);
  const [stats, setStats] = useState({ nuevas: 0, enProceso: 0, resueltas: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { dialogState, hideDialog, showError } = useErrorDialog();
  const { isOnline } = useNetwork();

  const loadData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      let data: IncidentResponse[] = [];

      if (isOnline) {
        try {
          data = await incidentService.getAll();
          // Guardar en caché para uso offline
          await incidentCacheService.save(data);
        } catch (error: any) {
          console.log('[ManagerDashboard] Error al cargar del servidor, usando caché');
          const cached = await incidentCacheService.load();
          data = cached || [];
        }
      } else {
        // Sin conexión: cargar del caché
        console.log('[ManagerDashboard] Sin conexión, cargando desde caché');
        const cached = await incidentCacheService.load();
        data = cached || [];
      }

      // Pendientes de asignar: sin worker asignado
      const unassigned = data
        .filter(inc => !inc.workerId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3);

      setIncidents(unassigned);

      setStats({
        nuevas: data.filter(inc => inc.status === 'PENDING' || inc.status === 'PENDING_ASSIGNMENT' || inc.status === 'ASSIGNED').length,
        enProceso: data.filter(inc => inc.status === 'IN_PROCESS').length,
        resueltas: data.filter(inc => inc.status === 'FINISHED').length,
      });
    } catch (error: any) {
      console.error('[ManagerDashboardScreen] Error al cargar datos:', error);
      // No mostrar error si es problema de conexión - el caché ya maneja offline
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );


  if (loading) return <LoadingView showLogo showAvatar onAvatarPress={() => navigation.navigate('ManagerProfile')} />;

  return (
    <View style={styles.container}>
      <TopAppBar showLogo showAvatar onAvatarPress={() => navigation.navigate('ManagerProfile')} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => loadData(true)} />
        }
      >

        <View style={styles.header}>
          <Text style={styles.greeting}>Panel de control</Text>
          <Text style={styles.sub}>Vista general de incidencias</Text>
        </View>

        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{stats.nuevas}</Text>
            <Text style={styles.statLabel}>Nuevas</Text>
          </View>
          <View style={styles.statSep} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{stats.enProceso}</Text>
            <Text style={styles.statLabel}>En proceso</Text>
          </View>
          <View style={styles.statSep} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{stats.resueltas}</Text>
            <Text style={styles.statLabel}>Resueltas</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pendientes de asignar</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ManagerIncidents')}>
              <Text style={styles.seeAll}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          {incidents.length === 0 ? (
            <EmptyState icon="check-circle" message="No hay incidencias pendientes de asignar" />
          ) : (
            <View style={styles.list}>
              {incidents.map((inc) => {
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
                        <Text style={styles.cardTitle} numberOfLines={1}>{inc.title}</Text>
                        <Text style={styles.cardTime}>{getRelativeTime(inc.createdAt)}</Text>
                      </View>
                      <View style={styles.cardMeta}>
                        <View style={styles.metaItem}>
                          <MaterialIcons name="person-outline" size={12} color={COLORS.onSurfaceVariant} />
                          <Text style={styles.metaText}>{inc.reporterName}</Text>
                        </View>
                        <View style={styles.metaItem}>
                          <MaterialIcons name="build" size={12} color={COLORS.onSurfaceVariant} />
                          <Text style={styles.metaText}>{inc.departmentName}</Text>
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
