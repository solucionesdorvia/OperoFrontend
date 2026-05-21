import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import TopAppBar from '../../components/TopAppBar';
import type { RootStackScreenProps } from '../../types/navigation';
import { styles } from './NotificationsScreen.styles';

type NotificationType = 'in_progress' | 'assigned' | 'resolved' | 'derived';

type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  sub: string;
  time: string;
  unread?: boolean;
};

const notifications: NotificationItem[] = [
  { id: '1', type: 'in_progress', title: 'Tu reporte pasó a "En proceso"', sub: '#INC-8821 · Rotura de tubería en ala norte',          time: 'Hace 15 min', unread: true },
  { id: '2', type: 'assigned',    title: 'Técnico asignado a tu reporte',  sub: '#INC-8821 · R. Méndez está en camino',                time: 'Hace 32 min', unread: true },
  { id: '3', type: 'resolved',    title: 'Tu reporte fue resuelto',        sub: '#INC-8775 · Sustitución de luminaria LED finalizada',  time: 'Ayer' },
  { id: '4', type: 'derived',     title: 'Tu reporte fue derivado',        sub: '#INC-8712 · Pasó al departamento de IT',              time: '11 Abr' },
  { id: '5', type: 'resolved',    title: 'Tu reporte fue resuelto',        sub: '#INC-8698 · Puerta de acceso reparada',               time: '09 Abr' },
  { id: '6', type: 'in_progress', title: 'Tu reporte está siendo revisado', sub: '#INC-8680 · Fuga en sanitarios · inspección iniciada', time: '08 Abr' },
];

const iconMap: Record<NotificationType, { icon: keyof typeof MaterialIcons.glyphMap; bg: string; color: string }> = {
  in_progress: { icon: 'autorenew',    bg: COLORS.primaryContainer,   color: COLORS.primary   },
  assigned:    { icon: 'engineering',  bg: COLORS.secondaryContainer, color: COLORS.secondary },
  resolved:    { icon: 'check-circle', bg: COLORS.primaryContainer,   color: COLORS.primary   },
  derived:     { icon: 'swap-horiz',   bg: COLORS.secondaryContainer, color: COLORS.secondary },
};

const filters: { key: 'all' | 'unread' | 'progress' | 'resolved'; label: string }[] = [
  { key: 'all',      label: 'Todas'      },
  { key: 'unread',   label: 'No leídas'  },
  { key: 'progress', label: 'En gestión' },
  { key: 'resolved', label: 'Resueltos'  },
];

type NotificationsScreenProps = RootStackScreenProps<'StudentNotifications'>;

export default function NotificationsScreen({ navigation }: NotificationsScreenProps) {
  const [active, setActive] = useState(0);

  const unread = notifications.filter((n) => n.unread).length;
  const activeKey = filters[active].key;
  const visible = notifications.filter((n) => {
    if (activeKey === 'unread')   return n.unread;
    if (activeKey === 'resolved') return n.type === 'resolved';
    if (activeKey === 'progress') return n.type === 'in_progress' || n.type === 'assigned' || n.type === 'derived';
    return true;
  });

  return (
    <View style={styles.container}>
      <TopAppBar title="Notificaciones" onBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Notificaciones</Text>
            <Text style={styles.sub}>{unread} sin leer · {notifications.length} en total</Text>
          </View>
          <TouchableOpacity style={styles.clearBtn} activeOpacity={0.7}>
            <MaterialIcons name="done-all" size={14} color={COLORS.onSurface} />
            <Text style={styles.clearText}>Marcar todas</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
          <View style={styles.filters}>
            {filters.map((f, i) => (
              <TouchableOpacity
                key={f.key}
                style={[styles.filterBtn, active === i && styles.filterBtnActive]}
                onPress={() => setActive(i)}
              >
                <Text style={[styles.filterText, active === i && styles.filterTextActive]}>{f.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {visible.length === 0 ? (
          <View style={styles.empty}>
            <MaterialIcons name="inbox" size={28} color={COLORS.outline} />
            <Text style={styles.emptyText}>No hay avisos para mostrar.</Text>
          </View>
        ) : null}

        <View style={styles.list}>
          {visible.map((n) => {
            const cfg = iconMap[n.type];
            return (
              <TouchableOpacity
                key={n.id}
                style={[styles.card, n.unread && styles.cardUnread]}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('IncidentDetail')}
              >
                <View style={[styles.iconWrap, { backgroundColor: cfg.bg }]}>
                  <MaterialIcons name={cfg.icon} size={18} color={cfg.color} />
                </View>
                <View style={styles.cardBody}>
                  <View style={styles.cardTop}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{n.title}</Text>
                    {n.unread ? <View style={styles.dot} /> : null}
                  </View>
                  <Text style={styles.cardSub} numberOfLines={2}>{n.sub}</Text>
                  <Text style={styles.cardTime}>{n.time}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
