import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';
import TopAppBar from '../../components/TopAppBar';
import type { ManagerTabScreenProps } from '../../types/navigation';
import { styles } from './ManagerDashboardScreen.styles';

const incidents = [
  { id: '1', title: 'Falla eléctrica en Lab. de Física', location: 'Edificio C · Planta 2',     dept: 'Mantenimiento', time: 'Hace 12 min',  priority: 'ALTA'  as const },
  { id: '2', title: 'Fuga de agua en sanitarios',        location: 'Biblioteca Central',         dept: 'Plomería',      time: 'Hace 45 min', priority: 'MEDIA' as const },
  { id: '3', title: 'Reposición de luminaria',           location: 'Edificio A · Planta Baja',   dept: 'Iluminación',   time: 'Hace 2h',     priority: 'BAJA'  as const },
];

const priorityColor = { ALTA: COLORS.error, MEDIA: COLORS.primary, BAJA: COLORS.outline };

type ManagerDashboardScreenProps = ManagerTabScreenProps<'ManagerHome'>;

export default function ManagerDashboardScreen({ navigation }: ManagerDashboardScreenProps) {
  return (
    <View style={styles.container}>
      <TopAppBar showLogo showAvatar rightIcon="notifications" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.greeting}>Panel de control</Text>
          <Text style={styles.sub}>Miércoles, 23 de abril</Text>
        </View>

        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>12</Text>
            <Text style={styles.statLabel}>Nuevas</Text>
          </View>
          <View style={styles.statSep} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>8</Text>
            <Text style={styles.statLabel}>En proceso</Text>
          </View>
          <View style={styles.statSep} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>45</Text>
            <Text style={styles.statLabel}>Resueltas</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pendientes de asignar</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ManagerIncidents')}>
              <Text style={styles.seeAll}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.list}>
            {incidents.map((inc) => (
              <TouchableOpacity
                key={inc.id}
                style={styles.card}
                onPress={() => navigation.navigate('ManagerIncidentDetail', { incident: inc })}
                activeOpacity={0.7}
              >
                <View style={[styles.priorityBar, { backgroundColor: priorityColor[inc.priority] }]} />
                <View style={styles.cardBody}>
                  <View style={styles.cardTop}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{inc.title}</Text>
                    <Text style={styles.cardTime}>{inc.time}</Text>
                  </View>
                  <View style={styles.cardMeta}>
                    <View style={styles.metaItem}>
                      <MaterialIcons name="location-on" size={12} color={COLORS.onSurfaceVariant} />
                      <Text style={styles.metaText}>{inc.location}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <MaterialIcons name="build" size={12} color={COLORS.onSurfaceVariant} />
                      <Text style={styles.metaText}>{inc.dept}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}
