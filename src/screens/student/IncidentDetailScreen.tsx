import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Pressable, ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';
import TopAppBar from '../../components/TopAppBar';
import StatusBadge from '../../components/StatusBadge';
import IncidentPhoto from '../../components/IncidentPhoto';
import type { RootStackScreenProps } from '../../types/navigation';
import { styles } from './IncidentDetailScreen.styles';
import ErrorDialog from '../../components/ErrorDialog';
import { useErrorDialog } from '../../hooks/useErrorDialog';
import { incidentService } from '../../services/incidentService';

const STATUS_MAP: Record<string, 'ABIERTO' | 'EN PROCESO' | 'FINALIZADO' | 'PENDIENTE'> = {
  'PENDING': 'PENDIENTE',
  'PENDING_ASSIGNMENT': 'PENDIENTE',
  'ASSIGNED': 'ABIERTO',
  'IN_PROCESS': 'EN PROCESO',
  'FINISHED': 'FINALIZADO',
};

type IncidentDetailScreenProps = RootStackScreenProps<'IncidentDetail'>;

export default function IncidentDetailScreen({ navigation, route }: IncidentDetailScreenProps) {
  const initialIncident = route?.params?.incident;
  const [incident, setIncident] = useState(initialIncident);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { dialogState, hideDialog, showConfirmation, showError } = useErrorDialog();

  const handleDelete = () => {
    setMenuOpen(false);
    showConfirmation(
      'Eliminar incidencia',
      '¿Seguro que querés eliminar este reporte? Esta acción no se puede deshacer.',
      async () => {
        try {
          setDeleting(true);
          await incidentService.delete(incident.id);
          navigation.goBack();
        } catch (error: any) {
          console.error('[IncidentDetailScreen] Error al eliminar:', error);
          showError('Error', error.message || 'No se pudo eliminar la incidencia');
        } finally {
          setDeleting(false);
        }
      }
    );
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${date.getDate()} ${months[date.getMonth()]}, ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const buildTimeline = () => {
    const steps = [
      {
        step: 'Reportado',
        time: incident?.createdAt ? `${formatDate(incident.createdAt)} · ${incident.reporterName}` : '',
        done: true,
        current: false,
      },
      {
        step: 'Asignado',
        time: incident?.workerName
          ? `${incident.departmentName} · ${incident.workerName}`
          : 'Pendiente',
        done: !!incident?.workerName,
        current: incident?.status === 'ASSIGNED' && !!incident?.workerName,
      },
      {
        step: 'En proceso',
        time: incident?.status === 'IN_PROCESS' ? 'En curso' : 'Pendiente',
        done: incident?.status === 'IN_PROCESS' || incident?.status === 'FINISHED',
        current: incident?.status === 'IN_PROCESS',
      },
      {
        step: 'Finalizado',
        time: incident?.status === 'FINISHED' ? formatDate(incident.updatedAt) : 'Pendiente',
        done: incident?.status === 'FINISHED',
        current: false,
      },
    ];
    return steps;
  };

  const timeline = buildTimeline();

  const handleEdit = () => {
    setMenuOpen(false);
    navigation.navigate('CreateIncident', { incident, mode: 'edit' });
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const updatedIncident = await incidentService.getById(incident.id);
      setIncident(updatedIncident);
    } catch (error: any) {
      console.error('[IncidentDetailScreen] Error al actualizar:', error);
      showError('Error', error.message || 'No se pudo actualizar la incidencia');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      <TopAppBar
        onBack={() => navigation.goBack()}
        rightIcon="more_vert"
        onRightPress={() => setMenuOpen(true)}
      />

      <Modal transparent visible={menuOpen} animationType="fade" onRequestClose={() => setMenuOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setMenuOpen(false)}>
          <View style={styles.menu}>
            <TouchableOpacity style={styles.menuItem} onPress={handleEdit} activeOpacity={0.7}>
              <MaterialIcons name="edit" size={18} color={COLORS.onSurface} />
              <Text style={styles.menuText}>Editar incidencia</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => setMenuOpen(false)}>
              <MaterialIcons name="share" size={18} color={COLORS.onSurface} />
              <Text style={styles.menuText}>Compartir</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem} onPress={handleDelete} activeOpacity={0.7}>
              <MaterialIcons name="delete-outline" size={18} color={COLORS.error} />
              <Text style={[styles.menuText, { color: COLORS.error }]}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.id}>#INC-{incident?.id || '0000'}</Text>
            <StatusBadge status={STATUS_MAP[incident?.status || 'ABIERTO'] || 'ABIERTO'} />
          </View>
          <Text style={styles.title}>{incident?.title || 'Sin título'}</Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={15} color={COLORS.onSurfaceVariant} />
            <Text style={styles.infoLabel}>Departamento</Text>
            <Text style={styles.infoValue}>{incident?.departmentName || 'Sin asignar'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <MaterialIcons name="access-time" size={15} color={COLORS.onSurfaceVariant} />
            <Text style={styles.infoLabel}>Reportado</Text>
            <Text style={styles.infoValue}>{incident?.createdAt ? formatDate(incident.createdAt) : '-'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <MaterialIcons name="person-outline" size={15} color={COLORS.onSurfaceVariant} />
            <Text style={styles.infoLabel}>Asignado a</Text>
            <Text style={styles.infoValue}>{incident?.workerName || 'Sin asignar'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.desc}>
            {incident?.description || 'Sin descripción'}
          </Text>
        </View>

        <IncidentPhoto photoUrl={incident?.photoUrl} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seguimiento</Text>
          <View style={styles.timeline}>
            {timeline.map((item, i) => (
              <View key={item.step} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={[
                    styles.timelineDot,
                    item.done && styles.dotDone,
                    item.current && styles.dotCurrent,
                  ]}>
                    {item.done ? <MaterialIcons name="check" size={10} color={COLORS.onPrimary} /> : null}
                  </View>
                  {i < timeline.length - 1 ? <View style={styles.timelineLine} /> : null}
                </View>
                <View style={[styles.timelineText, i < timeline.length - 1 && { paddingBottom: 20 }]}>
                  <Text style={[styles.timelineStep, item.current && { color: COLORS.primary }]}>{item.step}</Text>
                  <Text style={[styles.timelineTime, !item.done && !item.current && { opacity: 0.4 }]}>{item.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.btnSecondary}>
            <MaterialIcons name="chat-bubble-outline" size={16} color={COLORS.onSurface} />
            <Text style={styles.btnSecondaryText}>Mensaje</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnPrimary, refreshing && { opacity: 0.6 }]}
            onPress={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <ActivityIndicator size="small" color={COLORS.onPrimary} />
            ) : (
              <>
                <MaterialIcons name="refresh" size={16} color={COLORS.onPrimary} />
                <Text style={styles.btnPrimaryText}>Actualizar</Text>
              </>
            )}
          </TouchableOpacity>
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
