import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, RefreshControl,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../../../constants/colors';
import TopAppBar from '../../components/TopAppBar';
import type { ManagerTabScreenProps } from '../../types/navigation';
import { styles } from './MyTeamScreen.styles';
import { userService } from '../../services/userService';
import { incidentService, IncidentResponse } from '../../services/incidentService';
import { UserResponse } from '../../services/authService';
import ErrorDialog from '../../components/ErrorDialog';
import { useErrorDialog } from '../../hooks/useErrorDialog';

type MyTeamScreenProps = ManagerTabScreenProps<'ManagerMyTeam'>;

export default function MyTeamScreen({ navigation }: MyTeamScreenProps) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + insets.bottom;

  const [workers, setWorkers] = useState<UserResponse[]>([]);
  const [incidents, setIncidents] = useState<IncidentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');
  const { dialogState, hideDialog, showError } = useErrorDialog();

  const loadData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      // Primero obtener el perfil del manager para saber su departamento
      const myProfile = await userService.getMe();

      const [usersData, incidentsData] = await Promise.all([
        myProfile.departmentId ? userService.getByDepartment(myProfile.departmentId) : Promise.resolve([]),
        incidentService.getAll(),
      ]);

      const workersOnly = usersData.filter(u => u.roleName === 'WORKER');
      setWorkers(workersOnly);
      setIncidents(incidentsData);
    } catch (error: any) {
      console.error('[MyTeamScreen] Error al cargar datos:', error);
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

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getWorkerStats = (workerId: number) => {
    const assigned = incidents.filter(inc => inc.workerId === workerId);
    const active = assigned.filter(inc => inc.status !== 'FINISHED').length;
    const done = assigned.filter(inc => inc.status === 'FINISHED').length;
    return { active, done };
  };

  const totalActive = workers.reduce((sum, w) => sum + getWorkerStats(w.id).active, 0);
  const totalDone = workers.reduce((sum, w) => sum + getWorkerStats(w.id).done, 0);
  const activeCount = workers.filter(w => getWorkerStats(w.id).active > 0).length;

  const filtered = workers.filter((m) =>
    m.fullName.toLowerCase().includes(query.toLowerCase())
  );

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
          <RefreshControl refreshing={refreshing} onRefresh={() => loadData(true)} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Mi equipo</Text>
          <Text style={styles.sub}>{workers.length} operarios</Text>
        </View>

        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={18} color={COLORS.onSurfaceVariant} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre"
            placeholderTextColor={COLORS.outline}
            value={query}
            onChangeText={setQuery}
          />
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNum}>{activeCount}</Text>
            <Text style={styles.summaryLabel}>Activos</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNum}>{totalActive}</Text>
            <Text style={styles.summaryLabel}>Tareas abiertas</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNum}>{totalDone}</Text>
            <Text style={styles.summaryLabel}>Resueltas</Text>
          </View>
        </View>

        {filtered.length === 0 ? (
          <View style={{ padding: 24, alignItems: 'center' }}>
            <Text style={{ color: COLORS.textMuted, fontSize: 15 }}>
              No se encontraron operarios
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {filtered.map((worker) => {
              const stats = getWorkerStats(worker.id);
              const isActive = stats.active > 0;
              return (
                <TouchableOpacity key={worker.id} style={styles.card} activeOpacity={0.7}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{getInitials(worker.fullName)}</Text>
                  </View>
                  <View style={styles.info}>
                    <View style={styles.infoTop}>
                      <Text style={styles.name}>{worker.fullName}</Text>
                      <View style={[styles.badge, !isActive && styles.badgeMuted]}>
                        <View style={[styles.badgeDot, !isActive && styles.badgeDotMuted]} />
                        <Text style={[styles.badgeText, !isActive && styles.badgeTextMuted]}>
                          {isActive ? 'Activo' : 'Disponible'}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.role}>{worker.emailUade}</Text>
                    <View style={styles.statsRow}>
                      <Text style={styles.stat}>
                        <Text style={styles.statNum}>{stats.active}</Text> en curso
                      </Text>
                      <Text style={styles.sep}>·</Text>
                      <Text style={styles.stat}>
                        <Text style={styles.statNum}>{stats.done}</Text> completadas
                      </Text>
                    </View>
                  </View>
                  <MaterialIcons name="chevron-right" size={20} color={COLORS.outline} />
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
