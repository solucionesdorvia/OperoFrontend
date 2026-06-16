import React, { useCallback, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../../../constants/colors';
import TopAppBar from '../../components/TopAppBar';
import StatusBadge from '../../components/StatusBadge';
import { offlineIncidentService, LocalIncident } from '../../services/offlineIncidentService';
import type { Incident, StudentTabScreenProps } from '../../types/navigation';
import { styles } from './MyIncidentsScreen.styles';

const filters = ['Todas', 'En curso', 'Resueltas', 'Pendientes'];
const dateRanges = ['Cualquier fecha', 'Hoy', 'Semana', 'Mes'];

type Card = Incident & { id: string; sub?: string | null };

const mockIncidents: Card[] = [
  { id: '1', title: 'Fallo sistema de climatización',    location: 'Edificio Central · Ala Norte', status: 'EN PROCESO', time: 'Hace 2h',  sub: 'Técnico asignado', priority: null },
  { id: '2', title: 'Filtración de agua - Lab. B2',      location: 'Sótano · Planta Química',      status: 'ABIERTO',    time: null,        sub: null,                priority: 'ALTA' },
  { id: '3', title: 'Sustitución luminaria LED',         location: 'Biblioteca · Sala 3',           status: 'FINALIZADO', time: null,        sub: 'Cerrada ayer',      priority: null },
  { id: '4', title: 'Puerta de acceso bloqueada',        location: 'Cafetería Universitaria',       status: 'PENDIENTE',  time: null,        sub: null,                priority: null },
];

// Mapea un reporte local (creado en el dispositivo) al formato de tarjeta.
const localToCard = (inc: LocalIncident): Card => ({
  id: inc.localId,
  localId: inc.localId,
  title: inc.title,
  description: inc.description,
  location: inc.location ?? null,
  department: inc.department ?? null,
  images: inc.images,
  status: inc.status,
  createdAt: inc.createdAt,
  syncStatus: inc.syncStatus,
  time: null,
  sub: inc.syncStatus === 'uploaded' ? null : 'Sin subir',
  priority: null,
});

type MyIncidentsScreenProps = StudentTabScreenProps<'StudentIncidents'>;

export default function MyIncidentsScreen({ navigation }: MyIncidentsScreenProps) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + insets.bottom;
  const [active, setActive] = useState(0);
  const [dateIdx, setDateIdx] = useState(0);
  const [localCards, setLocalCards] = useState<Card[]>([]);

  // Recargamos los reportes locales cada vez que la pantalla toma foco
  // (al volver de crear una incidencia, por ejemplo).
  useFocusEffect(
    useCallback(() => {
      let active = true;
      offlineIncidentService.getAll().then((items) => {
        if (active) setLocalCards(items.map(localToCard));
      });
      return () => {
        active = false;
      };
    }, []),
  );

  const incidents: Card[] = [...localCards, ...mockIncidents];

  return (
    <View style={styles.container}>
      <TopAppBar
        showLogo
        rightActions={[
          { icon: 'search' },
          { icon: 'notifications', onPress: () => navigation.navigate('StudentNotifications') },
        ]}
        showAvatar
        onAvatarPress={() => navigation.navigate('StudentProfile')}
      />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <Text style={styles.summary}>{incidents.length} reportes en total</Text>

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

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
          <View style={styles.filters}>
            {dateRanges.map((d, i) => (
              <TouchableOpacity
                key={d}
                style={[styles.dateBtn, dateIdx === i && styles.dateBtnActive]}
                onPress={() => setDateIdx(i)}
              >
                <MaterialIcons
                  name="event"
                  size={13}
                  color={dateIdx === i ? COLORS.onSurface : COLORS.onSurfaceVariant}
                />
                <Text style={[styles.filterText, dateIdx === i && styles.filterTextActive]}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={[styles.list, { paddingBottom: tabBarHeight + 60 }]}>
          {incidents.map((inc) => (
            <TouchableOpacity
              key={inc.id}
              style={styles.card}
              onPress={() => navigation.navigate('IncidentDetail', { incident: inc })}
              activeOpacity={0.7}
            >
              <View style={styles.cardTop}>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle} numberOfLines={2}>{inc.title}</Text>
                  <Text style={styles.cardLocation}>{inc.location}</Text>
                </View>
                <StatusBadge status={(inc.status ?? 'PENDIENTE') as any} />
              </View>
              {(inc.time || inc.sub || inc.priority) ? (
                <View style={styles.cardMeta}>
                  {inc.priority ? (
                    <View style={styles.priorityTag}>
                      <Text style={styles.priorityText}>Prioridad alta</Text>
                    </View>
                  ) : null}
                  {inc.time ? <Text style={styles.metaText}>{inc.time}</Text> : null}
                  {inc.sub ? <Text style={styles.metaSub}>{inc.sub}</Text> : null}
                </View>
              ) : null}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, { bottom: tabBarHeight + 16 }]}
        onPress={() => navigation.navigate('CreateIncident')}
        activeOpacity={0.85}
      >
        <MaterialIcons name="add" size={22} color={COLORS.onPrimary} />
      </TouchableOpacity>
    </View>
  );
}
