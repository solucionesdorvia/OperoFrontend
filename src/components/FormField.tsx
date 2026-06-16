// Campo de formulario reutilizable: etiqueta + contenido (input, selector, etc.).
// Centraliza el patrón "label arriba, control abajo" repetido en varias pantallas
// (crear reporte, editar perfil...).

import React, { ReactNode } from 'react';
import { View, Text } from 'react-native';
import { styles } from './FormField.styles';

type FormFieldProps = {
  label: string;
  children: ReactNode;
};

export default function FormField({ label, children }: FormFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}
