import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';
import type { RootStackScreenProps } from '../../types/navigation';
import { styles } from './LoginScreen.styles';

const logo = require('../../../assets/operologo.png');

type Role = 'alumno' | 'manager' | 'operador';
type TabsRoute = 'StudentTabs' | 'ManagerTabs' | 'MaintenanceTabs';

const roles: { key: Role; label: string; dest: TabsRoute }[] = [
  { key: 'alumno',   label: 'Alumno',   dest: 'StudentTabs'     },
  { key: 'manager',  label: 'Manager',  dest: 'ManagerTabs'     },
  { key: 'operador', label: 'Operador', dest: 'MaintenanceTabs' },
];

type LoginScreenProps = RootStackScreenProps<'Login'>;

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<Role>('alumno');
  const selectedRole = roles.find((r) => r.key === role)!;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        <View style={styles.brand}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.wordmark}>OPERO</Text>
          <Text style={styles.tagline}>Sistema de gestión de incidencias</Text>
        </View>

        <View style={styles.segmented}>
          {roles.map((r) => (
            <TouchableOpacity
              key={r.key}
              style={[styles.segment, role === r.key && styles.segmentActive]}
              onPress={() => setRole(r.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.segmentText, role === r.key && styles.segmentTextActive]}>
                {r.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="nombre@universidad.edu"
              placeholderTextColor={COLORS.outline}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.field}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Contraseña</Text>
              <TouchableOpacity>
                <Text style={styles.forgot}>¿Olvidaste?</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, { flex: 1, borderWidth: 0 }]}
                placeholder="••••••••"
                placeholderTextColor={COLORS.outline}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <MaterialIcons
                  name={showPassword ? 'visibility-off' : 'visibility'}
                  size={18}
                  color={COLORS.onSurfaceVariant}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={() => navigation.replace(selectedRole.dest)}
            activeOpacity={0.85}
          >
            <Text style={styles.submitText}>Ingresar como {selectedRole.label}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>¿No tienes cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.footerLink}>Registrarse</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
