import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';
import TopAppBar from '../../components/TopAppBar';
import IncidentCard from '../../components/IncidentCard';
import type { StudentTabScreenProps } from '../../types/navigation';
import { styles } from './HomeScreen.styles';

const incidents = [
  { id: '1', title: 'Falla en proyector',  location: 'Aula B-204 · Edificio Central', status: 'ABIERTO'    as const, time: 'Hace 15 min' },
  { id: '2', title: 'Gotera en techo',     location: 'Laboratorio de Química',        status: 'EN PROCESO' as const, time: 'Hoy, 09:30'  },
  { id: '3', title: 'Silla dañada',        location: 'Biblioteca · Piso 1',           status: 'FINALIZADO' as const, time: 'Ayer',       dimmed: true },
  { id: '4', title: 'Falta de insumos',    location: 'Baños · Facultad de Artes',     status: 'EN PROCESO' as const, time: 'Hace 2 días' },
];

type HomeScreenProps = StudentTabScreenProps<'StudentHome'>;

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + insets.bottom;

  return (
    <View style={styles.container}>
      <TopAppBar
        showLogo
        rightActions={[
          { icon: 'notifications', onPress: () => navigation.navigate('StudentNotifications') },
        ]}
        showAvatar
        onAvatarPress={() => navigation.navigate('StudentProfile')}
      />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: tabBarHeight + 60 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Hola, Alejandro</Text>
          <View style={styles.statsRow}>
            <Text style={styles.stat}><Text style={styles.statNum}>3</Text> activas</Text>
            <Text style={styles.sep}>·</Text>
            <Text style={styles.stat}><Text style={styles.statNum}>12</Text> resueltas</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recientes</Text>
            <TouchableOpacity onPress={() => navigation.navigate('StudentIncidents')}>
              <Text style={styles.seeAll}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.list}>
            {incidents.map((inc) => (
              <IncidentCard
                key={inc.id}
                title={inc.title}
                location={inc.location}
                status={inc.status}
                time={inc.time}
                dimmed={inc.dimmed}
                onPress={() => navigation.navigate('IncidentDetail', { incident: inc })}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, { bottom: tabBarHeight + 16 }]}
        onPress={() => navigation.navigate('CreateIncident')}
        activeOpacity={0.85}
      >
        <MaterialIcons name="add" size={20} color={COLORS.onPrimary} />
        <Text style={styles.fabText}>Nuevo reporte</Text>
      </TouchableOpacity>
    </View>
  );
}
