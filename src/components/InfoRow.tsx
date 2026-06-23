import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/fonts';

interface InfoRowProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string;
}

export default function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <View style={styles.row}>
      <MaterialIcons name={icon} size={18} color={COLORS.onSurfaceVariant} />
      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.onSurface,
    lineHeight: 20,
  },
});
