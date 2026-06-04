import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Pressable, Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';
import TopAppBar from '../../components/TopAppBar';
import StatusBadge from '../../components/StatusBadge';
import type { RootStackScreenProps } from '../../types/navigation';
import { styles } from './IncidentDetailScreen.styles';

const timeline = [
  { step: 'Reportado',  time: '12 Oct, 08:30 · j.garcia',  done: true,  current: false },
  { step: 'Asignado',   time: '12 Oct, 09:15 · Hidráulica', done: true,  current: false },
  { step: 'En proceso', time: 'Hace 45 min · R. Mendez',    done: false, current: true  },
  { step: 'Finalizado', time: 'Pendiente',                   done: false, current: false },
];

type IncidentDetailScreenProps = RootStackScreenProps<'IncidentDetail'>;

export default function IncidentDetailScreen({ navigation, route }: IncidentDetailScreenProps) {
  const incident = route?.params?.incident;
  const [menuOpen, setMenuOpen] = useState(false);

  const handleDelete = () => {
    setMenuOpen(false);
    Alert.alert(
      'Eliminar incidencia',
      '¿Seguro que querés eliminar este reporte? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => navigation.goBack() },
      ],
    );
  };

  const handleEdit = () => {
    setMenuOpen(false);
    navigation.navigate('CreateIncident', { incident, mode: 'edit' });
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
            <Text style={styles.id}>#INC-8821</Text>
            <StatusBadge status="EN PROCESO" />
          </View>
          <Text style={styles.title}>{incident?.title ?? 'Rotura de tubería principal'}</Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={15} color={COLORS.onSurfaceVariant} />
            <Text style={styles.infoLabel}>Ubicación</Text>
            <Text style={styles.infoValue}>{incident?.location ?? 'Facultad de Ingeniería'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <MaterialIcons name="access-time" size={15} color={COLORS.onSurfaceVariant} />
            <Text style={styles.infoLabel}>Reportado</Text>
            <Text style={styles.infoValue}>12 Oct, 08:30</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <MaterialIcons name="person-outline" size={15} color={COLORS.onSurfaceVariant} />
            <Text style={styles.infoLabel}>Asignado a</Text>
            <Text style={styles.infoValue}>R. Mendez</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.desc}>
            Fuga de agua detectada en el pasillo central del segundo piso. Riesgo eléctrico por cercanía a paneles de control.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Evidencia</Text>
          <View style={styles.photoPlaceholder}>
            <MaterialIcons name="image" size={22} color={COLORS.outline} />
            <Text style={styles.photoLabel}>Captura_01.jpg</Text>
          </View>
        </View>

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
          <TouchableOpacity style={styles.btnPrimary}>
            <MaterialIcons name="refresh" size={16} color={COLORS.onPrimary} />
            <Text style={styles.btnPrimaryText}>Actualizar</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}
