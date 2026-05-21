import React from 'react';
import { View, Text } from 'react-native';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/fonts';
import { styles } from './StatusBadge.styles';

type Status = 'ABIERTO' | 'EN PROCESO' | 'FINALIZADO' | 'CRITICO' | 'PENDIENTE' | 'URGENTE' | 'MEDIA' | 'BAJA' | 'ALTA';

type StatusBadgeProps = {
  status: Status;
};

const statusConfig: Record<Status, { dot: string; label: string }> = {
  ABIERTO:      { dot: COLORS.statusOpen,        label: 'Abierto'    },
  'EN PROCESO': { dot: COLORS.statusInProgress,  label: 'En proceso' },
  FINALIZADO:   { dot: COLORS.statusResolved,    label: 'Finalizado' },
  CRITICO:      { dot: COLORS.statusCritical,    label: 'Crítico'    },
  PENDIENTE:    { dot: COLORS.statusClosed,      label: 'Pendiente'  },
  URGENTE:      { dot: COLORS.statusCritical,    label: 'Urgente'    },
  MEDIA:        { dot: COLORS.warning,           label: 'Media'      },
  BAJA:         { dot: COLORS.textMuted,         label: 'Baja'       },
  ALTA:         { dot: COLORS.statusCritical,    label: 'Alta'       },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = statusConfig[status];
  return (
    <View style={styles.badge}>
      <View style={[styles.dot, { backgroundColor: cfg.dot }]} />
      <Text style={[styles.label, { color: cfg.dot }]}>{cfg.label}</Text>
    </View>
  );
}
