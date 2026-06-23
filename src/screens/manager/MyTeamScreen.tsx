import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, RefreshControl,
  Modal, KeyboardAvoidingView, Platform, StyleSheet,
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
import { userService } from '../../services/userService';
import { incidentService, IncidentResponse } from '../../services/incidentService';
import { departmentService, DepartmentResponse } from '../../services/departmentService';
import { UserResponse } from '../../services/authService';
import ErrorDialog from '../../components/ErrorDialog';
import { useErrorDialog } from '../../hooks/useErrorDialog';

type MyTeamScreenProps = ManagerTabScreenProps<'ManagerMyTeam'>;

export default function MyTeamScreen({ navigation: _navigation }: MyTeamScreenProps) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + insets.bottom;

  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [workers, setWorkers] = useState<UserResponse[]>([]);
  const [incidents, setIncidents] = useState<IncidentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { dialogState, hideDialog, showError, showSuccess } = useErrorDialog();

  // Modal: crear operador
  const [workerModalDeptId, setWorkerModalDeptId] = useState<number | undefined>();
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [creatingWorker, setCreatingWorker] = useState(false);

  // Modal: crear departamento
  const [deptModalOpen, setDeptModalOpen] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [creatingDept, setCreatingDept] = useState(false);

  const loadData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const [deptsData, allUsers, incidentsData] = await Promise.all([
        departmentService.getAll(),
        userService.getAll(),
        incidentService.getAll(),
      ]);

      setDepartments(deptsData);
      setWorkers(allUsers.filter((u) => u.roleName === 'WORKER'));
      setIncidents(incidentsData);
    } catch (error: any) {
      console.error('[MyTeamScreen] Error al cargar datos:', error);
      showError('Error', error.message || 'No se pudieron cargar los datos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const getWorkerStats = (workerId: number) => {
    const assigned = incidents.filter((inc) => inc.workerId === workerId);
    return {
      active: assigned.filter((inc) => inc.status !== 'FINISHED').length,
      done: assigned.filter((inc) => inc.status === 'FINISHED').length,
    };
  };

  const workersByDept = (deptId: number) => workers.filter((w) => w.departmentId === deptId);

  const resetWorkerForm = () => {
    setNewFullName('');
    setNewEmail('');
    setNewPassword('');
    setWorkerModalDeptId(undefined);
  };

  const handleCreateWorker = async () => {
    if (!workerModalDeptId) return;
    if (!newFullName.trim()) {
      showError('Falta el nombre', 'Ingresá el nombre completo del operador');
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
    const dept = departments.find((d) => d.id === workerModalDeptId);
    try {
      setCreatingWorker(true);
      await userService.createWorker({
        fullName: newFullName.trim(),
        emailUade: newEmail.trim(),
        password: newPassword,
        departmentId: workerModalDeptId,
      });
      resetWorkerForm();
      showSuccess('Operador creado', `Se agregó al equipo de ${dept?.name ?? 'sin nombre'}`);
      await loadData(true);
    } catch (error: any) {
      console.error('[MyTeamScreen] Error al crear operador:', error);
      showError('Error al crear', error.message || 'No se pudo crear el operador');
    } finally {
      setCreatingWorker(false);
    }
  };

  const handleCreateDept = async () => {
    if (!newDeptName.trim()) {
      showError('Falta el nombre', 'Ingresá el nombre del departamento');
      return;
    }
    try {
      setCreatingDept(true);
      await departmentService.create({ name: newDeptName.trim() });
      setDeptModalOpen(false);
      setNewDeptName('');
      showSuccess('Departamento creado', `Se agregó ${newDeptName.trim()}`);
      await loadData(true);
    } catch (error: any) {
      console.error('[MyTeamScreen] Error al crear departamento:', error);
      showError('Error al crear', error.message || 'No se pudo crear el departamento');
    } finally {
      setCreatingDept(false);
    }
  };

  if (loading) return <LoadingView showLogo showAvatar onAvatarPress={() => navigation.navigate('ManagerProfile')} />;

  return (
    <View style={styles.container}>
      <TopAppBar showLogo showAvatar onAvatarPress={() => navigation.navigate('ManagerProfile')} />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: tabBarHeight + 80 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => loadData(true)} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Departamentos</Text>
          <Text style={styles.sub}>
            {departments.length} departamentos · {workers.length} operadores
          </Text>
        </View>

        {departments.length === 0 ? (
          <EmptyState message="No hay departamentos. Creá el primero con el botón de abajo." />
        ) : (
          <View style={styles.deptList}>
            {departments.map((dept) => {
              const deptWorkers = workersByDept(dept.id);
              return (
                <View key={dept.id} style={styles.deptCard}>
                  <View style={styles.deptHeader}>
                    <View style={styles.deptHeaderLeft}>
                      <MaterialIcons name="domain" size={18} color={COLORS.primary} />
                      <Text style={styles.deptName}>{dept.name}</Text>
                    </View>
                    <View style={styles.countBadge}>
                      <Text style={styles.countBadgeText}>{deptWorkers.length}</Text>
                    </View>
                  </View>

                  {deptWorkers.length === 0 ? (
                    <Text style={styles.deptEmpty}>Sin operadores todavía</Text>
                  ) : (
                    <View style={styles.workerList}>
                      {deptWorkers.map((worker) => {
                        const stats = getWorkerStats(worker.id);
                        return (
                          <View key={worker.id} style={styles.workerRow}>
                            <View style={styles.avatar}>
                              <Text style={styles.avatarText}>{getInitials(worker.fullName)}</Text>
                            </View>
                            <View style={styles.workerInfo}>
                              <Text style={styles.workerName} numberOfLines={1}>{worker.fullName}</Text>
                              <Text style={styles.workerEmail} numberOfLines={1}>{worker.emailUade}</Text>
                            </View>
                            <View style={styles.workerStats}>
                              <Text style={styles.workerStat}>
                                <Text style={styles.workerStatNum}>{stats.active}</Text> en curso
                              </Text>
                              <Text style={styles.workerStat}>
                                <Text style={styles.workerStatNum}>{stats.done}</Text> ok
                              </Text>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  )}

                  <TouchableOpacity
                    style={styles.addWorkerBtn}
                    onPress={() => setWorkerModalDeptId(dept.id)}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons name="person-add" size={16} color={COLORS.primary} />
                    <Text style={styles.addWorkerText}>Nuevo operador en {dept.name}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* FAB: crear departamento */}
      <TouchableOpacity
        style={[styles.fab, { bottom: tabBarHeight + 16 }]}
        activeOpacity={0.85}
        onPress={() => setDeptModalOpen(true)}
      >
        <MaterialIcons name="add" size={20} color={COLORS.onPrimary} />
        <Text style={styles.fabText}>Nuevo depto</Text>
      </TouchableOpacity>

      {/* Modal: crear operador (en depto específico) */}
      <Modal
        visible={!!workerModalDeptId}
        transparent
        animationType="slide"
        onRequestClose={() => !creatingWorker && resetWorkerForm()}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalBackdrop}
        >
          <TouchableOpacity
            style={styles.modalBackdropTouchable}
            activeOpacity={1}
            onPress={() => !creatingWorker && resetWorkerForm()}
          />
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nuevo operador</Text>
              <TouchableOpacity onPress={() => !creatingWorker && resetWorkerForm()}>
                <MaterialIcons name="close" size={22} color={COLORS.onSurface} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSub}>
              Va al departamento{' '}
              <Text style={styles.modalSubBold}>
                {departments.find((d) => d.id === workerModalDeptId)?.name ?? '—'}
              </Text>
              . Podrá iniciar sesión con su email y contraseña.
            </Text>

            <View style={styles.field}>
              <Text style={styles.label}>Nombre completo</Text>
              <TextInput
                style={styles.input}
                placeholder="Juan Pérez"
                placeholderTextColor={COLORS.outline}
                value={newFullName}
                onChangeText={setNewFullName}
                editable={!creatingWorker}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Email institucional</Text>
              <TextInput
                style={styles.input}
                placeholder="nombre@uade.edu.ar"
                placeholderTextColor={COLORS.outline}
                keyboardType="email-address"
                autoCapitalize="none"
                value={newEmail}
                onChangeText={setNewEmail}
                editable={!creatingWorker}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Contraseña inicial</Text>
              <TextInput
                style={styles.input}
                placeholder="Mínimo 8 caracteres"
                placeholderTextColor={COLORS.outline}
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
                editable={!creatingWorker}
              />
            </View>

            <TouchableOpacity
              style={[styles.submitBtn, creatingWorker && { opacity: 0.6 }]}
              onPress={handleCreateWorker}
              disabled={creatingWorker}
              activeOpacity={0.85}
            >
              {creatingWorker ? (
                <ActivityIndicator color={COLORS.onPrimary} />
              ) : (
                <Text style={styles.submitText}>Crear operador</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal: crear departamento */}
      <Modal
        visible={deptModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => !creatingDept && setDeptModalOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalBackdrop}
        >
          <TouchableOpacity
            style={styles.modalBackdropTouchable}
            activeOpacity={1}
            onPress={() => !creatingDept && setDeptModalOpen(false)}
          />
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nuevo departamento</Text>
              <TouchableOpacity onPress={() => !creatingDept && setDeptModalOpen(false)}>
                <MaterialIcons name="close" size={22} color={COLORS.onSurface} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSub}>
              Va a aparecer en la lista de departamentos. Después podés agregar operadores desde
              su tarjeta.
            </Text>

            <View style={styles.field}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. Mantenimiento, Redes..."
                placeholderTextColor={COLORS.outline}
                value={newDeptName}
                onChangeText={setNewDeptName}
                editable={!creatingDept}
              />
            </View>

            <TouchableOpacity
              style={[styles.submitBtn, creatingDept && { opacity: 0.6 }]}
              onPress={handleCreateDept}
              disabled={creatingDept}
              activeOpacity={0.85}
            >
              {creatingDept ? (
                <ActivityIndicator color={COLORS.onPrimary} />
              ) : (
                <Text style={styles.submitText}>Crear departamento</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 20, gap: 20 },

  header: { gap: 4 },
  title: {
    fontSize: 22,
    fontFamily: FONTS.family.display,
    color: COLORS.onSurface,
    letterSpacing: -0.3,
  },
  sub: {
    fontSize: 12,
    fontFamily: FONTS.family.mono,
    color: COLORS.onSurfaceVariant,
    letterSpacing: 0.2,
  },

  deptList: { gap: 14 },
  deptCard: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
    overflow: 'hidden',
  },
  deptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outlineVariant,
  },
  deptHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  deptName: {
    fontSize: 14,
    fontFamily: FONTS.family.bodySemiBold,
    color: COLORS.onSurface,
    letterSpacing: -0.2,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: COLORS.primaryContainer,
  },
  countBadgeText: {
    fontSize: 11,
    fontFamily: FONTS.family.monoBold,
    color: COLORS.primary,
    letterSpacing: 0.3,
  },

  deptEmpty: {
    fontSize: 12,
    fontFamily: FONTS.family.mono,
    color: COLORS.onSurfaceVariant,
    fontStyle: 'italic',
    paddingHorizontal: 14,
    paddingVertical: 16,
    textAlign: 'center',
  },
  workerList: { paddingVertical: 6 },
  workerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: COLORS.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 10,
    fontFamily: FONTS.family.monoBold,
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  workerInfo: { flex: 1, gap: 2 },
  workerName: {
    fontSize: 13,
    fontFamily: FONTS.family.bodyMedium,
    color: COLORS.onSurface,
  },
  workerEmail: {
    fontSize: 11,
    fontFamily: FONTS.family.mono,
    color: COLORS.onSurfaceVariant,
  },
  workerStats: { alignItems: 'flex-end', gap: 2 },
  workerStat: {
    fontSize: 10,
    fontFamily: FONTS.family.mono,
    color: COLORS.onSurfaceVariant,
    letterSpacing: 0.2,
  },
  workerStatNum: {
    fontFamily: FONTS.family.monoBold,
    color: COLORS.onSurface,
  },

  addWorkerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.outlineVariant,
    backgroundColor: COLORS.surfaceContainer,
  },
  addWorkerText: {
    fontSize: 11,
    fontFamily: FONTS.family.monoSemiBold,
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: FONTS.tracking.caps,
  },

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
  modalBackdropTouchable: { ...StyleSheet.absoluteFillObject },
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
  modalSubBold: {
    fontFamily: FONTS.family.bodySemiBold,
    color: COLORS.onSurface,
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
