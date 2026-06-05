import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../../../constants/colors';
import TopAppBar from '../../components/TopAppBar';
import type { ManagerTabScreenProps } from '../../types/navigation';
import { styles } from './ManagerDashboardScreen.styles';
import { incidentService, IncidentResponse } from '../../services/incidentService';
import ErrorDialog from '../../components/ErrorDialog';
import { useErrorDialog } from '../../hooks/useErrorDialog';

const priorityColor = { ALTA: COLORS.error, MEDIA: COLORS.primary, BAJA: COLORS.outline };

type ManagerDashboardScreenProps = ManagerTabScreenProps<'ManagerHome'>;

export default function ManagerDashboardScreen({ navigation }: ManagerDashboardScreenProps) {
  const [incidents, setIncidents] = useState<IncidentResponse[]>([]);
  const [stats, setStats] = useState({ nuevas: 0, enProceso: 0, resueltas: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { dialogState, hideDialog, showError } = useErrorDialog();

  const loadData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const data = await incidentService.getAll();

      // Pendientes de asignar: sin worker asignado
      const unassigned = data
        .filter(inc => !inc.workerId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3);

      setIncidents(unassigned);

      setStats({
        nuevas: data.filter(inc => inc.status === 'ABIERTO').length,
        enProceso: data.filter(inc => inc.status === 'EN_PROCESO').length,
        resueltas: data.filter(inc => inc.status === 'FINALIZADO').length,
      });
    } catch (error: any) {
      console.error('[ManagerDashboardScreen] Error al cargar datos:', error);
      showError('Error', error.message || 'No se pudieron cargar los datos');
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

  const getRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    return `Hace ${Math.floor(diffHours / 24)} días`;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <TopAppBar showLogo showAvatar rightIcon="notifications" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopAppBar showLogo showAvatar rightIcon="notifications" />
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
            <View style={{ padding: 24, alignItems: 'center' }}>
              <MaterialIcons name="check-circle" size={32} color={COLORS.outline} />
              <Text style={{ color: COLORS.textMuted, fontSize: 15, marginTop: 8 }}>
                No hay incidencias pendientes de asignar
              </Text>
            </View>
          ) : (
            <View style={styles.list}>
              {incidents.map((inc) => {
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
