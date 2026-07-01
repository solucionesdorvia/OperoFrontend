import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import TopAppBar from '../../components/TopAppBar';
import IncidentPhoto from '../../components/IncidentPhoto';
import InfoRow from '../../components/InfoRow';
import type { RootStackScreenProps } from '../../types/navigation';
import { styles } from './MaintenanceDetailScreen.styles';
import { incidentService } from '../../services/incidentService';
import ErrorDialog from '../../components/ErrorDialog';
import { useErrorDialog } from '../../hooks/useErrorDialog';
import { formatDate } from '../../utils/dateUtils';
import { useNetwork } from '../../hooks/useNetwork';
import { workQueueService } from '../../services/workQueueService';
import { useAuth } from '../../context/AuthContext';

type MaintenanceDetailScreenProps = RootStackScreenProps<'MaintenanceDetail'>;

export default function MaintenanceDetailScreen({ navigation, route }: MaintenanceDetailScreenProps) {
  const task = route?.params?.task;
  const [processing, setProcessing] = useState(false);
  const { dialogState, hideDialog, showError, showSuccess, showConfirmation } = useErrorDialog();
  const { isOnline } = useNetwork();
  const { user } = useAuth();


  const handleStartWork = async () => {
    showConfirmation(
      'Comenzar trabajo',
      '¿Querés comenzar a trabajar en esta incidencia?',
      async () => {
        try {
          setProcessing(true);

          if (isOnline) {
            // Online: actualizar directamente
            await incidentService.updateStatus(task.id, 'IN_PROCESS');
            showSuccess('Éxito', 'Trabajo iniciado correctamente');
          } else {
            // Offline: agregar a la cola
            await workQueueService.add(task.id, 'START', 'IN_PROCESS', user?.id);
            showSuccess('Sin conexión', 'Trabajo guardado. Se sincronizará cuando te conectes.');
          }

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

          if (isOnline) {
            // Online: actualizar directamente
            await incidentService.updateStatus(task.id, 'FINISHED');
            showSuccess('Éxito', 'Incidencia finalizada correctamente');
          } else {
            // Offline: agregar a la cola
            await workQueueService.add(task.id, 'FINISH', 'FINISHED', user?.id);
            showSuccess('Sin conexión', 'Finalización guardada. Se sincronizará cuando te conectes.');
          }

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
          <InfoRow icon="location-on" label="Departamento" value={task?.departmentName || 'Sin asignar'} />
          <View style={styles.divider} />
          <InfoRow icon="schedule" label="Reportado" value={task?.createdAt ? formatDate(task.createdAt) : '-'} />
          <View style={styles.divider} />
          <InfoRow icon="person-outline" label="Reportante" value={task?.reporterName || 'Desconocido'} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.desc}>
            {task?.description || 'Sin descripción'}
          </Text>
        </View>

        <IncidentPhoto photoUrl={task?.photoUrl} />

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
        ) : (
          <Text style={{ padding: 16, textAlign: 'center', color: COLORS.textMuted, fontSize: 15 }}>
            {task?.status === 'FINISHED' ? 'Tarea finalizada' : 'Tarea pendiente de asignación'}
          </Text>
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
