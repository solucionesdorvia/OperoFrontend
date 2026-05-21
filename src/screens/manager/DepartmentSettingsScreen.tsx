import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Switch,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';
import TopAppBar from '../../components/TopAppBar';
import type { RootStackScreenProps } from '../../types/navigation';
import { styles } from './DepartmentSettingsScreen.styles';

type DepartmentSettingsScreenProps = RootStackScreenProps<'DepartmentSettings'>;

export default function DepartmentSettingsScreen({ navigation }: DepartmentSettingsScreenProps) {
  const [name, setName]         = useState('Mantenimiento General');
  const [code, setCode]         = useState('MNT-001');
  const [email, setEmail]       = useState('mantenimiento@opero.edu');
  const [description, setDescription] = useState(
    'Departamento responsable de infraestructura, instalaciones y sistemas eléctricos de la universidad.',
  );
  const [autoAssign, setAutoAssign]   = useState(true);
  const [notifCritical, setNotifCritical] = useState(true);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TopAppBar title="Configurar departamento" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <MaterialIcons name="domain" size={24} color={COLORS.primary} />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={styles.heroTitle}>{name}</Text>
            <Text style={styles.heroSub}>Código {code} · 6 miembros</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información general</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Nombre del departamento</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholderTextColor={COLORS.outline}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Código interno</Text>
            <TextInput
              style={styles.input}
              value={code}
              onChangeText={setCode}
              placeholderTextColor={COLORS.outline}
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email de contacto</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={COLORS.outline}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
              placeholderTextColor={COLORS.outline}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferencias</Text>

          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleLabel}>Asignación automática</Text>
              <Text style={styles.toggleHint}>Repartir incidencias nuevas según carga de trabajo.</Text>
            </View>
            <Switch
              value={autoAssign}
              onValueChange={setAutoAssign}
              trackColor={{ false: COLORS.surfaceContainerHigh, true: COLORS.primary }}
              thumbColor={COLORS.onPrimary}
            />
          </View>

          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleLabel}>Alertas críticas</Text>
              <Text style={styles.toggleHint}>Notificar de inmediato cuando ingresa una incidencia de prioridad alta.</Text>
            </View>
            <Switch
              value={notifCritical}
              onValueChange={setNotifCritical}
              trackColor={{ false: COLORS.surfaceContainerHigh, true: COLORS.primary }}
              thumbColor={COLORS.onPrimary}
            />
          </View>
        </View>

      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.saveBtn}
          activeOpacity={0.85}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.saveText}>Guardar configuración</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
