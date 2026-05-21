import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/fonts';
import StatusBadge from './StatusBadge';
import { styles } from './IncidentCard.styles';

type IncidentCardProps = {
  title: string;
  location: string;
  status: 'ABIERTO' | 'EN PROCESO' | 'FINALIZADO' | 'PENDIENTE';
  time: string;
  onPress?: () => void;
  dimmed?: boolean;
};

const accentColor: Record<string, string> = {
  ABIERTO:      COLORS.statusOpen,
  'EN PROCESO': COLORS.statusInProgress,
  FINALIZADO:   COLORS.statusResolved,
  PENDIENTE:    COLORS.statusClosed,
};

export default function IncidentCard({ title, location, status, time, onPress, dimmed }: IncidentCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.card, dimmed && styles.dimmed]}
      activeOpacity={0.7}
    >
      <View style={[styles.accent, { backgroundColor: accentColor[status] ?? COLORS.outline }]} />
      <View style={styles.body}>
        <View style={styles.top}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <MaterialIcons name="chevron-right" size={16} color={COLORS.outline} />
        </View>
        <View style={styles.bottom}>
          <Text style={styles.location} numberOfLines={1}>{location}</Text>
          <View style={styles.right}>
            <StatusBadge status={status} />
            <Text style={styles.sep}>·</Text>
            <Text style={styles.time}>{time}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
