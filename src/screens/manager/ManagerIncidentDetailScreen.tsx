import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Modal, Pressable,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import TopAppBar from '../../components/TopAppBar';
import StatusBadge from '../../components/StatusBadge';
import type { RootStackScreenProps } from '../../types/navigation';
import { styles } from './ManagerIncidentDetailScreen.styles';
import { incidentService } from '../../services/incidentService';
import { departmentService, DepartmentResponse } from '../../services/departmentService';
import { userService } from '../../services/userService';
import { UserResponse } from '../../services/authService';
import ErrorDialog from '../../components/ErrorDialog';
import { useErrorDialog } from '../../hooks/useErrorDialog';

const STATUS_MAP: Record<string, 'ABIERTO' | 'EN PROCESO' | 'FINALIZADO' | 'PENDIENTE'> = {
  'ABIERTO': 'ABIERTO',
  'EN_PROCESO': 'EN PROCESO',
  'FINALIZADO': 'FINALIZADO',
  'PENDIENTE': 'PENDIENTE',
};

type ManagerIncidentDetailScreenProps = RootStackScreenProps<'ManagerIncidentDetail'>;

export default function ManagerIncidentDetailScreen({ navigation, route }: ManagerIncidentDetailScreenProps) {
  const incident = route?.params?.incident;

  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [workers, setWorkers] = useState<UserResponse[]>([]);
  const [selectedDeptId, setSelectedDeptId] = useState<number | null>(incident?.departmentId || null);
  const [selectedWorkerId, setSelectedWorkerId] = useState<number | null>(incident?.workerId || null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const { dialogState, hideDialog, showError, showSuccess } = useErrorDialog();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [deptsData, usersData] = await Promise.all([
        departmentService.getAll(),
        userService.getAll(),
      ]);

      setDepartments(deptsData);
      // Filtrar solo workers (WORKER role)
      const workersOnly = usersData.filter(u => u.roleName === 'WORKER');
      setWorkers(workersOnly);
    } catch (error: any) {
      console.error('[ManagerIncidentDetailScreen] Error al cargar datos:', error);
      showError('Error', error.message || 'No se pudieron cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Actualizar departamento si cambió
      if (selectedDeptId && selectedDeptId !== incident?.departmentId) {
        await incidentService.updateDepartment(incident.id, selectedDeptId);
      }

      // Asignar worker si cambió
      if (selectedWorkerId && selectedWorkerId !== incident?.workerId) {
        await incidentService.assignWorker(incident.id, selectedWorkerId);
      }

      showSuccess('Éxito', 'Cambios guardados correctamente');
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (error: any) {
      console.error('[ManagerIncidentDetailScreen] Error al guardar:', error);
      showError('Error', error.message || 'No se pudieron guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  const selectedDept = departments.find(d => d.id === selectedDeptId);
  const selectedWorker = workers.find(w => w.id === selectedWorkerId);

  if (loading) {
    return (
      <View style={styles.container}>
        <TopAppBar title="Gestionar incidencia" onBack={() => navigation.goBack()} showAvatar />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopAppBar title="Gestionar incidencia" onBack={() => navigation.goBack()} showAvatar />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.id}>#INC-{incident?.id || '0000'}</Text>
            <StatusBadge status={STATUS_MAP[incident?.status || 'ABIERTO'] || 'ABIERTO'} />
          </View>
          <Text style={styles.title}>{incident?.title || 'Sin título'}</Text>
          <Text style={styles.location}>
            <MaterialIcons name="person-outline" size={13} color={COLORS.onSurfaceVariant} />
            {' '}Reportado por: {incident?.user?.fullName || 'Desconocido'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.desc}>
            {incident?.description || 'Sin descripción'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Departamento</Text>
          <TouchableOpacity style={styles.select} onPress={() => setShowDeptModal(true)}>
            <Text style={styles.selectText}>{selectedDept?.name || 'Seleccionar'}</Text>
            <MaterialIcons name="expand-more" size={20} color={COLORS.onSurfaceVariant} />
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { paddingBottom: 120 }]}>
          <Text style={styles.sectionTitle}>Asignar operario</Text>
          <TouchableOpacity style={styles.select} onPress={() => setShowWorkerModal(true)}>
            <Text style={styles.selectText}>{selectedWorker?.fullName || 'Sin asignar'}</Text>
            <MaterialIcons name="keyboard-arrow-down" size={20} color={COLORS.onSurfaceVariant} />
          </TouchableOpacity>
        </View>

      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.saveBtn, saving && { opacity: 0.6 }]}
          onPress={handleSave}
          activeOpacity={0.85}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={COLORS.onPrimary} />
          ) : (
            <Text style={styles.saveBtnText}>Guardar cambios</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Department Modal */}
      <Modal transparent visible={showDeptModal} animationType="fade" onRequestClose={() => setShowDeptModal(false)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }} onPress={() => setShowDeptModal(false)}>
          <View style={{ backgroundColor: COLORS.surface, borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16, maxHeight: '50%' }}>
            <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 16, color: COLORS.text }}>Seleccionar departamento</Text>
            <ScrollView>
              {departments.map(dept => (
                <TouchableOpacity
                  key={dept.id}
                  style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.surfaceVariant }}
                  onPress={() => {
                    setSelectedDeptId(dept.id);
                    setShowDeptModal(false);
                  }}
                >
                  <Text style={{ color: dept.id === selectedDeptId ? COLORS.primary : COLORS.text, fontWeight: dept.id === selectedDeptId ? '600' : '400' }}>
                    {dept.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      {/* Worker Modal */}
      <Modal transparent visible={showWorkerModal} animationType="fade" onRequestClose={() => setShowWorkerModal(false)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }} onPress={() => setShowWorkerModal(false)}>
          <View style={{ backgroundColor: COLORS.surface, borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16, maxHeight: '50%' }}>
            <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 16, color: COLORS.text }}>Asignar operario</Text>
            <ScrollView>
              <TouchableOpacity
                style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.surfaceVariant }}
                onPress={() => {
                  setSelectedWorkerId(null);
                  setShowWorkerModal(false);
                }}
              >
                <Text style={{ color: selectedWorkerId === null ? COLORS.primary : COLORS.text, fontStyle: 'italic', fontWeight: selectedWorkerId === null ? '600' : '400' }}>
                  Sin asignar
                </Text>
              </TouchableOpacity>
              {workers.map(worker => (
                <TouchableOpacity
                  key={worker.id}
                  style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.surfaceVariant }}
                  onPress={() => {
                    setSelectedWorkerId(worker.id);
                    setShowWorkerModal(false);
                  }}
                >
                  <Text style={{ color: worker.id === selectedWorkerId ? COLORS.primary : COLORS.text, fontWeight: worker.id === selectedWorkerId ? '600' : '400' }}>
                    {worker.fullName}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
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
