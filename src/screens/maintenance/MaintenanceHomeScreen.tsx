import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';
import TopAppBar from '../../components/TopAppBar';
import type { MaintenanceTabScreenProps } from '../../types/navigation';
import { styles } from './MaintenanceHomeScreen.styles';

const tasks = [
  { id: '1', title: 'Fuga de agua en Laboratorio de Química 302', location: 'Edificio B, Nivel 3',  time: 'Hace 15 min', code: '#8902', priority: 'URGENTE' as const },
  { id: '2', title: 'Falla en luminaria LED pasillo central',      location: 'Biblioteca Norte',      time: 'Hace 2h',     code: '#8895', priority: 'MEDIA'   as const },
];

const quickTasks = [
  { icon: 'build'               as const, type: 'Reparación',  title: 'Puerta Aula 10'  },
  { icon: 'electrical-services' as const, type: 'Eléctrico',   title: 'Revisión UPS IT' },
];

const priorityConfig = {
  URGENTE: { color: COLORS.error,   label: 'Urgente' },
  MEDIA:   { color: COLORS.primary, label: 'Media'   },
};

type MaintenanceHomeScreenProps = MaintenanceTabScreenProps<'MaintenanceHomeTab'>;

export default function MaintenanceHomeScreen({ navigation }: MaintenanceHomeScreenProps) {
  return (
    <View style={styles.container}>
      <TopAppBar showLogo showAvatar rightIcon="notifications" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.greeting}>Hola, Carlos</Text>
          <View style={styles.statsRow}>
            <Text style={styles.stat}><Text style={styles.statNum}>4</Text> asignadas</Text>
            <Text style={styles.sep}>·</Text>
            <Text style={styles.stat}><Text style={styles.statNum}>12</Text> completadas hoy</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tareas asignadas</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MaintenanceHistory')}>
              <Text style={styles.seeAll}>Ver historial</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.list}>
            {tasks.map((task) => {
              const cfg = priorityConfig[task.priority];
              return (
                <TouchableOpacity
                  key={task.id}
                  style={styles.taskCard}
                  onPress={() => navigation.navigate('MaintenanceDetail', { task })}
                  activeOpacity={0.7}
                >
                  <View style={[styles.priorityBar, { backgroundColor: cfg.color }]} />
                  <View style={styles.taskBody}>
                    <View style={styles.taskTop}>
                      <View style={styles.priorityTag}>
                        <View style={[styles.dot, { backgroundColor: cfg.color }]} />
                        <Text style={[styles.priorityLabel, { color: cfg.color }]}>{cfg.label}</Text>
                      </View>
                      <Text style={styles.taskCode}>{task.code}</Text>
                    </View>
                    <Text style={styles.taskTitle} numberOfLines={2}>{task.title}</Text>
                    <View style={styles.taskMeta}>
                      <View style={styles.metaItem}>
                        <MaterialIcons name="location-on" size={13} color={COLORS.onSurfaceVariant} />
                        <Text style={styles.metaText}>{task.location}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <MaterialIcons name="schedule" size={13} color={COLORS.onSurfaceVariant} />
                        <Text style={styles.metaText}>{task.time}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pendientes menores</Text>
          <View style={styles.quickRow}>
            {quickTasks.map((item) => (
              <TouchableOpacity key={item.title} style={styles.quickCard} activeOpacity={0.7}>
                <MaterialIcons name={item.icon} size={18} color={COLORS.onSurfaceVariant} />
                <View style={{ gap: 2 }}>
                  <Text style={styles.quickType}>{item.type}</Text>
                  <Text style={styles.quickTitle}>{item.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.featuredCard}
          onPress={() => navigation.navigate('MaintenanceDetail', {})}
          activeOpacity={0.7}
        >
          <View style={styles.featuredHeader}>
            <View>
              <Text style={styles.featuredTag}>Mantenimiento preventivo</Text>
              <Text style={styles.featuredTitle}>Revisión Mensual Chiller 04</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={COLORS.outline} />
          </View>
          <Text style={styles.featuredDesc}>
            Verificar niveles de refrigerante y limpieza de filtros externos. Azotea Bloque C.
          </Text>
          <TouchableOpacity style={styles.startBtn}>
            <MaterialIcons name="play-arrow" size={16} color={COLORS.onPrimary} />
            <Text style={styles.startBtnText}>Iniciar</Text>
          </TouchableOpacity>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}
