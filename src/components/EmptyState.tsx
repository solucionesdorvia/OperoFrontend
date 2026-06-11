import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

interface EmptyStateProps {
  icon?: keyof typeof MaterialIcons.glyphMap;
  message: string;
}

export default function EmptyState({ icon = 'info', message }: EmptyStateProps) {
  return (
    <View style={{ padding: 24, alignItems: 'center' }}>
      <MaterialIcons name={icon} size={32} color={COLORS.outline} />
      <Text style={{ color: COLORS.textMuted, fontSize: 15, marginTop: 8 }}>
        {message}
      </Text>
    </View>
  );
}
