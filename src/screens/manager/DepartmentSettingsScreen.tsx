import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, Switch,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import TopAppBar from '../../components/TopAppBar';
import type { RootStackScreenProps } from '../../types/navigation';
import { styles } from './DepartmentSettingsScreen.styles';
import { departmentService } from '../../services/departmentService';
import { userService } from '../../services/userService';
import ErrorDialog from '../../components/ErrorDialog';
import { useErrorDialog } from '../../hooks/useErrorDialog';

type DepartmentSettingsScreenProps = RootStackScreenProps<'DepartmentSettings'>;

export default function DepartmentSettingsScreen({ navigation }: DepartmentSettingsScreenProps) {
  const [departments, setDepartments] = useState<any[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoAssign, setAutoAssign] = useState(false);
  const [notifCritical, setNotifCritical] = useState(false);
  const { dialogState, hideDialog, showError } = useErrorDialog();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Obtener perfil del manager
      const myProfile = await userService.getMe();

      const [deptsData, usersData] = await Promise.all([
        departmentService.getAll(),
        myProfile.departmentId ? userService.getByDepartment(myProfile.departmentId) : Promise.resolve([]),
      ]);

      setDepartments(deptsData);
      const workersOnly = usersData.filter(u => u.roleName === 'WORKER');
      setWorkers(workersOnly);
    } catch (error: any) {
      console.error('[DepartmentSettingsScreen] Error al cargar datos:', error);
      showError('Error', error.message || 'No se pudieron cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TopAppBar title="Configurar departamento" onBack={() => navigation.goBack()} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TopAppBar title="Configurar departamento" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <MaterialIcons name="domain" size={24} color={COLORS.primary} />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={styles.heroTitle}>Departamentos</Text>
            <Text style={styles.heroSub}>{departments.length} departamentos · {workers.length} operarios</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Departamentos registrados</Text>

          {departments.map((dept, idx) => (
            <View key={dept.id} style={{ paddingVertical: 12, borderBottomWidth: idx < departments.length - 1 ? 1 : 0, borderBottomColor: COLORS.surfaceVariant }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.text }}>{dept.name}</Text>
              <Text style={{ fontSize: 14, color: COLORS.textMuted, marginTop: 4 }}>ID: {dept.id}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferencias</Text>

          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleLabel}>Asignación automática</Text>
              <Text style={styles.toggleHint}>Repartir incidencias nuevas según carga de trabajo.</Text>
            </View>
            <Switch
              value={autoAssign}
              onValueChange={setAutoAssign}
              trackColor={{ false: COLORS.surfaceContainerHigh, true: COLORS.primary }}
              thumbColor={COLORS.onPrimary}
            />
          </View>

          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleLabel}>Alertas críticas</Text>
              <Text style={styles.toggleHint}>Notificar de inmediato cuando ingresa una incidencia de prioridad alta.</Text>
            </View>
            <Switch
              value={notifCritical}
              onValueChange={setNotifCritical}
              trackColor={{ false: COLORS.surfaceContainerHigh, true: COLORS.primary }}
              thumbColor={COLORS.onPrimary}
            />
          </View>
        </View>

      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.saveBtn}
          activeOpacity={0.85}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.saveText}>Guardar configuración</Text>
        </TouchableOpacity>
      </View>

      <ErrorDialog
        visible={dialogState.visible}
        type={dialogState.type}
        title={dialogState.title}
        message={dialogState.message}
        buttons={dialogState.buttons}
        onDismiss={hideDialog}
      />
    </KeyboardAvoidingView>
  );
}
