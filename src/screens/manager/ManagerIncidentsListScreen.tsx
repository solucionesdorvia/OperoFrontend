import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';
import TopAppBar from '../../components/TopAppBar';
import StatusBadge from '../../components/StatusBadge';
import type { ManagerTabScreenProps } from '../../types/navigation';
import { styles } from './ManagerIncidentsListScreen.styles';

const filters = ['Todas', 'Abiertas', 'En proceso', 'Finalizadas'] as const;

type Incident = {
  id: string;
  code: string;
  title: string;
  location: string;
  status: 'ABIERTO' | 'EN PROCESO' | 'FINALIZADO' | 'PENDIENTE';
  priority: 'ALTA' | 'MEDIA' | 'BAJA';
  assignee?: string;
  time: string;
};

const incidents: Incident[] = [
  { id: '1', code: '#INC-8821', title: 'Rotura de tubería principal',  location: 'Edificio Central · Lab 204', status: 'EN PROCESO', priority: 'ALTA',  assignee: 'R. Mendez',     time: 'Hace 45 min' },
  { id: '2', code: '#INC-8818', title: 'Falla eléctrica Lab. Física',   location: 'Edificio C · Planta 2',       status: 'ABIERTO',    priority: 'ALTA',  assignee: undefined,       time: 'Hace 1h'    },
  { id: '3', code: '#INC-8815', title: 'Fuga en sanitarios Biblioteca', location: 'Biblioteca Central',           status: 'ABIERTO',    priority: 'MEDIA', assignee: undefined,       time: 'Hace 2h'    },
  { id: '4', code: '#INC-8810', title: 'Reposición de luminaria',      location: 'Edificio A · Planta Baja',     status: 'FINALIZADO', priority: 'BAJA',  assignee: 'C. Mendoza',    time: 'Ayer'       },
  { id: '5', code: '#INC-8807', title: 'Sistema de climatización',     location: 'Auditorio Principal',          status: 'PENDIENTE',  priority: 'MEDIA', assignee: 'E. Rivas',      time: 'Ayer'       },
];

const priorityColor = { ALTA: COLORS.error, MEDIA: COLORS.primary, BAJA: COLORS.outline };

type ManagerIncidentsListScreenProps = ManagerTabScreenProps<'ManagerIncidents'>;

export default function ManagerIncidentsListScreen({ navigation }: ManagerIncidentsListScreenProps) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + insets.bottom;
  const [active, setActive] = useState(0);

  return (
    <View style={styles.container}>
      <TopAppBar showLogo rightIcon="search" showAvatar />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: tabBarHeight + 40 }]} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.title}>Incidencias</Text>
          <Text style={styles.sub}>{incidents.length} reportes del departamento</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
          <View style={styles.filters}>
            {filters.map((f, i) => (
              <TouchableOpacity
                key={f}
                style={[styles.filterBtn, active === i && styles.filterBtnActive]}
                onPress={() => setActive(i)}
              >
                <Text style={[styles.filterText, active === i && styles.filterTextActive]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

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
                  <Text style={styles.code}>{inc.code}</Text>
                  <StatusBadge status={inc.status} />
                </View>
                <Text style={styles.cardTitle} numberOfLines={2}>{inc.title}</Text>
                <View style={styles.meta}>
                  <View style={styles.metaItem}>
                    <MaterialIcons name="location-on" size={12} color={COLORS.onSurfaceVariant} />
                    <Text style={styles.metaText} numberOfLines={1}>{inc.location}</Text>
                  </View>
                </View>
                <View style={styles.footer}>
                  <View style={styles.metaItem}>
                    <MaterialIcons
                      name={inc.assignee ? 'person' : 'person-off'}
                      size={13}
                      color={inc.assignee ? COLORS.primary : COLORS.onSurfaceVariant}
                    />
                    <Text style={[styles.assignee, !inc.assignee && { color: COLORS.onSurfaceVariant, fontStyle: 'italic' }]}>
                      {inc.assignee ?? 'Sin asignar'}
                    </Text>
                  </View>
                  <Text style={styles.time}>{inc.time}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}
