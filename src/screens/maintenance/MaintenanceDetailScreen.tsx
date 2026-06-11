import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import TopAppBar from '../../components/TopAppBar';
import type { RootStackScreenProps } from '../../types/navigation';
import { styles } from './MaintenanceDetailScreen.styles';
import { incidentService } from '../../services/incidentService';
import ErrorDialog from '../../components/ErrorDialog';
import { useErrorDialog } from '../../hooks/useErrorDialog';

type MaintenanceDetailScreenProps = RootStackScreenProps<'MaintenanceDetail'>;

export default function MaintenanceDetailScreen({ navigation, route }: MaintenanceDetailScreenProps) {
  const task = route?.params?.task;
  const [processing, setProcessing] = useState(false);
  const { dialogState, hideDialog, showError, showSuccess, showConfirmation } = useErrorDialog();

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Hace menos de 1 min';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays === 1) return 'Ayer';
    return `Hace ${diffDays} días`;
  };

  const handleStartWork = async () => {
    showConfirmation(
      'Comenzar trabajo',
      '¿Querés comenzar a trabajar en esta incidencia?',
      async () => {
        try {
          setProcessing(true);
          await incidentService.updateStatus(task.id, 'IN_PROCESS');
          showSuccess('Éxito', 'Trabajo iniciado correctamente');
          setTimeout(() => {
            navigation.goBack();
          }, 1500);
        } catch (error: any) {
          console.error('[MaintenanceDetailScreen] Error al iniciar trabajo:', error);
          showError('Error', error.message || 'No se pudo iniciar el trabajo');
        } finally {
          setProcessing(false);
        }
      }
    );
  };

  const handleFinish = async () => {
    showConfirmation(
      'Finalizar tarea',
      '¿Seguro que querés marcar esta incidencia como finalizada?',
      async () => {
        try {
          setProcessing(true);
          await incidentService.updateStatus(task.id, 'FINISHED');
          showSuccess('Éxito', 'Incidencia finalizada correctamente');
          setTimeout(() => {
            navigation.goBack();
          }, 1500);
        } catch (error: any) {
          console.error('[MaintenanceDetailScreen] Error al finalizar:', error);
          showError('Error', error.message || 'No se pudo finalizar la incidencia');
        } finally {
          setProcessing(false);
        }
      }
    );
  };

  const priority = task?.priority || 'MEDIUM';
  const priorityLabels: Record<string, string> = { HIGH: 'Prioridad alta', MEDIUM: 'Prioridad media', LOW: 'Prioridad baja' };

  return (
    <View style={styles.container}>
      <TopAppBar onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.priorityTag}>
              <View style={styles.priorityDot} />
              <Text style={styles.priorityText}>{priorityLabels[priority]}</Text>
            </View>
            <Text style={styles.id}>#INC-{task?.id || '0000'}</Text>
          </View>
          <Text style={styles.title}>{task?.title || 'Sin título'}</Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={15} color={COLORS.onSurfaceVariant} />
            <Text style={styles.infoLabel}>Departamento</Text>
            <Text style={styles.infoValue}>{task?.departmentName || 'Sin asignar'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <MaterialIcons name="schedule" size={15} color={COLORS.onSurfaceVariant} />
            <Text style={styles.infoLabel}>Reportado</Text>
            <Text style={styles.infoValue}>{task?.createdAt ? formatDate(task.createdAt) : '-'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <MaterialIcons name="person-outline" size={15} color={COLORS.onSurfaceVariant} />
            <Text style={styles.infoLabel}>Reportante</Text>
            <Text style={styles.infoValue}>{task?.reporterName || 'Desconocido'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.desc}>
            {task?.description || 'Sin descripción'}
          </Text>
        </View>

        {task?.photoUrl && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Foto adjunta</Text>
            <Image
              source={{ uri: task.photoUrl }}
              style={{ width: '100%', height: 200, borderRadius: 12, marginTop: 8 }}
              resizeMode="cover"
            />
          </View>
        )}

      </ScrollView>

      <View style={styles.bottomBar}>
        {task?.status === 'ASSIGNED' ? (
          <TouchableOpacity
            style={[styles.startBtn, processing && { opacity: 0.6 }]}
            activeOpacity={0.85}
            onPress={handleStartWork}
            disabled={processing}
          >
            {processing ? (
              <ActivityIndicator color={COLORS.onPrimary} />
            ) : (
              <>
                <MaterialIcons name="play-arrow" size={20} color={COLORS.onPrimary} />
                <Text style={styles.startBtnText}>Comenzar trabajo</Text>
              </>
            )}
          </TouchableOpacity>
        ) : task?.status === 'IN_PROCESS' ? (
          <TouchableOpacity
            style={[styles.finishBtn, processing && { opacity: 0.6 }]}
            activeOpacity={0.85}
            onPress={handleFinish}
            disabled={processing}
          >
            {processing ? (
              <ActivityIndicator color={COLORS.onSurface} />
            ) : (
              <>
                <MaterialIcons name="task-alt" size={20} color={COLORS.onSurface} />
                <Text style={styles.finishBtnText}>Finalizar trabajo</Text>
              </>
            )}
          </TouchableOpacity>
        ) : task?.status === 'FINISHED' ? (
          <View style={{ padding: 16, alignItems: 'center' }}>
            <Text style={{ color: COLORS.textMuted, fontSize: 15 }}>Tarea finalizada</Text>
          </View>
        ) : (
          <View style={{ padding: 16, alignItems: 'center' }}>
            <Text style={{ color: COLORS.textMuted, fontSize: 15 }}>Tarea pendiente de asignación</Text>
          </View>
        )}
      </View>

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
