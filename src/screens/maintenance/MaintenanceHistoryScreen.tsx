import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';
import TopAppBar from '../../components/TopAppBar';
import type { MaintenanceTabScreenProps } from '../../types/navigation';
import { styles } from './MaintenanceHistoryScreen.styles';

type HistoryItem = {
  id: string;
  code: string;
  title: string;
  location: string;
  date: string;
  duration: string;
};

const history: HistoryItem[] = [
  { id: '1', code: '#INC-8792', title: 'Cambio de luminaria LED Aula 102',     location: 'Edificio A · Planta 1',   date: 'Hoy, 11:20',     duration: '32 min' },
  { id: '2', code: '#INC-8780', title: 'Reparación puerta automática',         location: 'Biblioteca Central',       date: 'Hoy, 09:05',     duration: '1h 10 min' },
  { id: '3', code: '#INC-8771', title: 'Desbloqueo sanitario general',        location: 'Pabellón C',                date: 'Ayer, 16:40',    duration: '45 min' },
  { id: '4', code: '#INC-8750', title: 'Mantenimiento preventivo chiller 04', location: 'Azotea Bloque C',           date: 'Ayer, 10:30',    duration: '2h 30 min' },
  { id: '5', code: '#INC-8733', title: 'Reparación fuga tubería',             location: 'Laboratorio Química',       date: '12 Abr, 14:00',  duration: '3h' },
];

const periods = ['Hoy', 'Semana', 'Mes', 'Todo'];

type MaintenanceHistoryScreenProps = MaintenanceTabScreenProps<'MaintenanceHistory'>;

export default function MaintenanceHistoryScreen({ navigation }: MaintenanceHistoryScreenProps) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + insets.bottom;
  const [period, setPeriod] = useState(1);

  return (
    <View style={styles.container}>
      <TopAppBar showLogo rightIcon="search" showAvatar />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: tabBarHeight + 40 }]}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.header}>
          <Text style={styles.title}>Historial</Text>
          <Text style={styles.sub}>Tareas finalizadas</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
          <View style={styles.filters}>
            {periods.map((p, i) => (
              <TouchableOpacity
                key={p}
                style={[styles.filterBtn, period === i && styles.filterBtnActive]}
                onPress={() => setPeriod(i)}
              >
                <Text style={[styles.filterText, period === i && styles.filterTextActive]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{history.length}</Text>
            <Text style={styles.statLabel}>Finalizadas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNum}>9h 17m</Text>
            <Text style={styles.statLabel}>Tiempo total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNum}>1h 51m</Text>
            <Text style={styles.statLabel}>Promedio</Text>
          </View>
        </View>

        <View style={styles.list}>
          {history.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('MaintenanceDetail', { task: item })}
            >
              <View style={styles.iconWrap}>
                <MaterialIcons name="check-circle" size={18} color={COLORS.primary} />
              </View>
              <View style={styles.cardBody}>
                <View style={styles.cardTop}>
                  <Text style={styles.code}>{item.code}</Text>
                  <Text style={styles.date}>{item.date}</Text>
                </View>
                <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                <View style={styles.meta}>
                  <View style={styles.metaItem}>
                    <MaterialIcons name="location-on" size={12} color={COLORS.onSurfaceVariant} />
                    <Text style={styles.metaText} numberOfLines={1}>{item.location}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <MaterialIcons name="schedule" size={12} color={COLORS.onSurfaceVariant} />
                    <Text style={styles.metaText}>{item.duration}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}
