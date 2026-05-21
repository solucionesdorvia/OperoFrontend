import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';
import TopAppBar from '../../components/TopAppBar';
import type { RootStackScreenProps } from '../../types/navigation';
import { styles } from './MaintenanceDetailScreen.styles';

type MaintenanceDetailScreenProps = RootStackScreenProps<'MaintenanceDetail'>;

export default function MaintenanceDetailScreen({ navigation, route }: MaintenanceDetailScreenProps) {
  const task = route?.params?.task;

  return (
    <View style={styles.container}>
      <TopAppBar onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.priorityTag}>
              <View style={styles.priorityDot} />
              <Text style={styles.priorityText}>Prioridad alta</Text>
            </View>
            <Text style={styles.id}>INC-8821</Text>
          </View>
          <Text style={styles.title}>{task?.title ?? 'Fallo Sistema Climatización'}</Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={15} color={COLORS.onSurfaceVariant} />
            <Text style={styles.infoLabel}>Ubicación</Text>
            <Text style={styles.infoValue}>{task?.location ?? 'Edificio Central, Planta 4'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <MaterialIcons name="schedule" size={15} color={COLORS.onSurfaceVariant} />
            <Text style={styles.infoLabel}>Reportado</Text>
            <Text style={styles.infoValue}>Hace 2h</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <MaterialIcons name="engineering" size={15} color={COLORS.onSurfaceVariant} />
            <Text style={styles.infoLabel}>Tipo</Text>
            <Text style={styles.infoValue}>Correctivo</Text>
          </View>
        </View>

        <View style={styles.mapPlaceholder}>
          <MaterialIcons name="map" size={28} color={COLORS.outline} />
          <Text style={styles.mapLabel}>Ver en mapa</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.desc}>
            El sistema de refrigeración del ala norte presenta vibración inusual y pérdida de presión. Se requiere revisión de válvulas y posible purga del circuito primario.
          </Text>
        </View>

        <View style={styles.warningBanner}>
          <MaterialIcons name="warning" size={18} color={COLORS.primary} />
          <Text style={styles.warningText}>EPP obligatorio: casco y guantes dieléctricos.</Text>
        </View>

      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.startBtn} activeOpacity={0.85}>
          <MaterialIcons name="play-arrow" size={20} color={COLORS.onPrimary} />
          <Text style={styles.startBtnText}>Iniciar trabajo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.finishBtn} activeOpacity={0.85} onPress={() => navigation.goBack()}>
          <MaterialIcons name="task-alt" size={20} color={COLORS.onSurface} />
          <Text style={styles.finishBtnText}>Finalizar trabajo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
