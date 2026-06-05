import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator,
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

    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    return `Hace ${Math.floor(diffHours / 24)} días`;
  };

  const handleAccept = async () => {
    if (task?.status === 'ABIERTO') {
      showConfirmation(
        'Aceptar tarea',
        '¿Querés aceptar esta incidencia y comenzar a trabajar en ella?',
        async () => {
          try {
            setProcessing(true);
            await incidentService.acceptIncident(task.id);
            showSuccess('Éxito', 'Incidencia aceptada correctamente');
            setTimeout(() => {
              navigation.goBack();
            }, 1500);
          } catch (error: any) {
            console.error('[MaintenanceDetailScreen] Error al aceptar:', error);
            showError('Error', error.message || 'No se pudo aceptar la incidencia');
          } finally {
            setProcessing(false);
          }
        }
      );
    }
  };

  const handleFinish = async () => {
    showConfirmation(
      'Finalizar tarea',
      '¿Seguro que querés marcar esta incidencia como finalizada?',
      async () => {
        try {
          setProcessing(true);
          await incidentService.updateStatus(task.id, 'FINALIZADO');
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
            <Text style={styles.infoValue}>{task?.department?.name || 'Sin asignar'}</Text>
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
            <Text style={styles.infoValue}>{task?.user?.fullName || 'Desconocido'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.desc}>
            {task?.description || 'Sin descripción'}
          </Text>
        </View>

      </ScrollView>

      <View style={styles.bottomBar}>
        {task?.status === 'ABIERTO' ? (
          <TouchableOpacity
            style={[styles.startBtn, processing && { opacity: 0.6 }]}
            activeOpacity={0.85}
            onPress={handleAccept}
            disabled={processing}
          >
            {processing ? (
              <ActivityIndicator color={COLORS.onPrimary} />
            ) : (
              <>
                <MaterialIcons name="play-arrow" size={20} color={COLORS.onPrimary} />
                <Text style={styles.startBtnText}>Aceptar tarea</Text>
              </>
            )}
          </TouchableOpacity>
        ) : task?.status === 'EN_PROCESO' ? (
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
          <View style={{ padding: 16, alignItems: 'center' }}>
            <Text style={{ color: COLORS.textMuted, fontSize: 15 }}>Tarea finalizada</Text>
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
