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
      <MaterialIcons name={icon} size={15} color={COLORS.onSurfaceVariant} />
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { fontFamily: FONTS.regular, fontSize: 13, color: COLORS.onSurfaceVariant, flex: 1 },
  value: { fontFamily: FONTS.medium, fontSize: 13, color: COLORS.onSurface },
});
