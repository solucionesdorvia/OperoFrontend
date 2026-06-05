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
import IncidentCard from '../../components/IncidentCard';
import type { StudentTabScreenProps } from '../../types/navigation';
import { styles } from './HomeScreen.styles';
import { useAuth } from '../../context/AuthContext';
import { incidentService, IncidentResponse } from '../../services/incidentService';
import ErrorDialog from '../../components/ErrorDialog';
import { useErrorDialog } from '../../hooks/useErrorDialog';

type HomeScreenProps = StudentTabScreenProps<'StudentHome'>;

const STATUS_MAP: Record<string, 'ABIERTO' | 'EN PROCESO' | 'FINALIZADO' | 'PENDIENTE'> = {
  'ABIERTO': 'ABIERTO',
  'EN_PROCESO': 'EN PROCESO',
  'FINALIZADO': 'FINALIZADO',
  'PENDIENTE': 'PENDIENTE',
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + insets.bottom;

  const { user } = useAuth();
  const { dialogState, hideDialog, showError } = useErrorDialog();

  const [incidents, setIncidents] = useState<IncidentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadIncidents = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const data = await incidentService.getAll();
      // Filtrar solo las del usuario actual y tomar las 4 más recientes
      const userIncidents = data
        .filter(inc => inc.reporterId === user?.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 4);

      setIncidents(userIncidents);
    } catch (error: any) {
      console.error('[HomeScreen] Error al cargar incidencias:', error);
      showError('Error', error.message || 'No se pudieron cargar las incidencias');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadIncidents();
    }, [])
  );

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

  const firstName = user?.fullName?.split(' ')[0] || 'Usuario';
  const activeCount = incidents.filter(i => i.status !== 'FINALIZADO').length;
  const resolvedCount = incidents.filter(i => i.status === 'FINALIZADO').length;

  return (
    <View style={styles.container}>
      <TopAppBar
        showLogo
        rightActions={[
          { icon: 'notifications', onPress: () => navigation.navigate('StudentNotifications') },
        ]}
        showAvatar
        onAvatarPress={() => navigation.navigate('StudentProfile')}
      />
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: tabBarHeight + 60 }]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => loadIncidents(true)} />
          }
        >
          <View style={styles.header}>
            <Text style={styles.greeting}>Hola, {firstName}</Text>
            <View style={styles.statsRow}>
              <Text style={styles.stat}><Text style={styles.statNum}>{activeCount}</Text> activas</Text>
              <Text style={styles.sep}>·</Text>
              <Text style={styles.stat}><Text style={styles.statNum}>{resolvedCount}</Text> resueltas</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recientes</Text>
              <TouchableOpacity onPress={() => navigation.navigate('StudentIncidents')}>
                <Text style={styles.seeAll}>Ver todas</Text>
              </TouchableOpacity>
            </View>
            {incidents.length === 0 ? (
              <View style={{ padding: 24, alignItems: 'center' }}>
                <Text style={{ color: COLORS.textMuted, fontSize: 15 }}>
                  No tienes incidencias reportadas
                </Text>
              </View>
            ) : (
              <View style={styles.list}>
                {incidents.map((inc) => (
                  <IncidentCard
                    key={inc.id}
                    title={inc.title}
                    location={inc.departmentName}
                    status={STATUS_MAP[inc.status] || 'ABIERTO'}
                    time={getRelativeTime(inc.createdAt)}
                    dimmed={inc.status === 'FINALIZADO'}
                    onPress={() => navigation.navigate('IncidentDetail', { incident: inc as any })}
                  />
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      )}

      <ErrorDialog
        visible={dialogState.visible}
        type={dialogState.type}
        title={dialogState.title}
        message={dialogState.message}
        buttons={dialogState.buttons}
        onDismiss={hideDialog}
      />

      <TouchableOpacity
        style={[styles.fab, { bottom: tabBarHeight + 16 }]}
        onPress={() => navigation.navigate('CreateIncident')}
        activeOpacity={0.85}
      >
        <MaterialIcons name="add" size={20} color={COLORS.onPrimary} />
        <Text style={styles.fabText}>Nuevo reporte</Text>
      </TouchableOpacity>
    </View>
  );
}
