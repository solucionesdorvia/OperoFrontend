// Botón primario reutilizable (CTA). Soporta ícono a la derecha, estado
// deshabilitado/cargando y variante a ancho completo.

import React from 'react';
import { Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { styles } from './PrimaryButton.styles';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  icon?: keyof typeof MaterialIcons.glyphMap;
  disabled?: boolean;
  loading?: boolean;
};

export default function PrimaryButton({
  label,
  onPress,
  icon,
  disabled,
  loading,
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <TouchableOpacity
      style={[styles.btn, isDisabled && styles.btnDisabled]}
      activeOpacity={0.85}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator size="small" color={COLORS.onPrimary} />
      ) : (
        <>
          <Text style={styles.text}>{label}</Text>
          {icon ? <MaterialIcons name={icon} size={18} color={COLORS.onPrimary} /> : null}
        </>
      )}
    </TouchableOpacity>
  );
}
