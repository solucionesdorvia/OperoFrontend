import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, RefreshControl,
  Modal, KeyboardAvoidingView, Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';
import TopAppBar from '../../components/TopAppBar';
import EmptyState from '../../components/EmptyState';
import LoadingView from '../../components/LoadingView';
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
  const { dialogState, hideDialog, showError, showSuccess } = useErrorDialog();

  // Modal de "crear operario"
  const [myDepartmentId, setMyDepartmentId] = useState<number | undefined>();
  const [myDepartmentName, setMyDepartmentName] = useState<string>('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [creating, setCreating] = useState(false);

  const loadData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      // Primero obtener el perfil del manager para saber su departamento
      const myProfile = await userService.getMe();
      setMyDepartmentId(myProfile.departmentId ?? undefined);
      setMyDepartmentName(myProfile.departmentName ?? '');

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

  const resetNewForm = () => {
    setNewFullName('');
    setNewEmail('');
    setNewPassword('');
  };

  const handleCreateWorker = async () => {
    if (!newFullName.trim()) {
      showError('Falta el nombre', 'Ingresá el nombre completo del operario');
      return;
    }
    if (!newEmail.trim()) {
      showError('Falta el email', 'Ingresá el email institucional');
      return;
    }
    if (newPassword.length < 8) {
      showError('Contraseña corta', 'La contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (!myDepartmentId) {
      showError('Sin departamento', 'No se pudo determinar tu departamento');
      return;
    }
    try {
      setCreating(true);
      await userService.createWorker({
        fullName: newFullName.trim(),
        emailUade: newEmail.trim(),
        password: newPassword,
        departmentId: myDepartmentId,
      });
      setCreateModalOpen(false);
      resetNewForm();
      showSuccess('Operario creado', `Se agregó al equipo de ${myDepartmentName}`);
      await loadData(true);
    } catch (error: any) {
      console.error('[MyTeamScreen] Error al crear operario:', error);
      showError('Error al crear', error.message || 'No se pudo crear el operario');
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <LoadingView showLogo rightIcon="search" showAvatar />;

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
          <EmptyState message="No se encontraron operarios" />
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

      {/* FAB: crear operario */}
      <TouchableOpacity
        style={[teamExtra.fab, { bottom: tabBarHeight + 16 }]}
        activeOpacity={0.85}
        onPress={() => setCreateModalOpen(true)}
      >
        <MaterialIcons name="person-add" size={20} color={COLORS.onPrimary} />
        <Text style={teamExtra.fabText}>Nuevo operario</Text>
      </TouchableOpacity>

      {/* Modal: form de creación */}
      <Modal
        visible={createModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => !creating && setCreateModalOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={teamExtra.modalBackdrop}
        >
          <TouchableOpacity
            style={teamExtra.modalBackdropTouchable}
            activeOpacity={1}
            onPress={() => !creating && setCreateModalOpen(false)}
          />
          <View style={teamExtra.modalSheet}>
            <View style={teamExtra.modalHeader}>
              <Text style={teamExtra.modalTitle}>Nuevo operario</Text>
              <TouchableOpacity onPress={() => !creating && setCreateModalOpen(false)}>
                <MaterialIcons name="close" size={22} color={COLORS.onSurface} />
              </TouchableOpacity>
            </View>
            <Text style={teamExtra.modalSub}>
              Va al departamento {myDepartmentName || '—'}. El operario podrá iniciar sesión
              con su email y contraseña.
            </Text>

            <View style={teamExtra.field}>
              <Text style={teamExtra.label}>Nombre completo</Text>
              <TextInput
                style={teamExtra.input}
                placeholder="Juan Pérez"
                placeholderTextColor={COLORS.outline}
                value={newFullName}
                onChangeText={setNewFullName}
                editable={!creating}
              />
            </View>

            <View style={teamExtra.field}>
              <Text style={teamExtra.label}>Email institucional</Text>
              <TextInput
                style={teamExtra.input}
                placeholder="nombre@uade.edu.ar"
                placeholderTextColor={COLORS.outline}
                keyboardType="email-address"
                autoCapitalize="none"
                value={newEmail}
                onChangeText={setNewEmail}
                editable={!creating}
              />
            </View>

            <View style={teamExtra.field}>
              <Text style={teamExtra.label}>Contraseña inicial</Text>
              <TextInput
                style={teamExtra.input}
                placeholder="Mínimo 8 caracteres"
                placeholderTextColor={COLORS.outline}
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
                editable={!creating}
              />
            </View>

            <TouchableOpacity
              style={[teamExtra.submitBtn, creating && { opacity: 0.6 }]}
              onPress={handleCreateWorker}
              disabled={creating}
              activeOpacity={0.85}
            >
              {creating ? (
                <ActivityIndicator color={COLORS.onPrimary} />
              ) : (
                <Text style={teamExtra.submitText}>Crear operario</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

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

import { StyleSheet } from 'react-native';

// Estilos locales para el FAB y el modal de creación de operarios.
// Evitamos tocar MyTeamScreen.styles.ts para no chocar con tobías.
const teamExtra = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  fabText: {
    color: COLORS.onPrimary,
    fontFamily: FONTS.family.monoSemiBold,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: FONTS.tracking.caps,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalBackdropTouchable: {
    ...StyleSheet.absoluteFillObject,
  },
  modalSheet: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    gap: 14,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: FONTS.family.display,
    color: COLORS.onSurface,
    letterSpacing: -0.3,
  },
  modalSub: {
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
    lineHeight: 18,
  },
  field: { gap: 6 },
  label: {
    fontSize: 11,
    fontFamily: FONTS.family.monoSemiBold,
    color: COLORS.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: FONTS.tracking.caps,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.onSurface,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 6,
  },
  submitText: {
    color: COLORS.onPrimary,
    fontFamily: FONTS.family.monoSemiBold,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: FONTS.tracking.caps,
  },
});
