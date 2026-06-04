import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Image, Alert, ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';
import TopAppBar from '../../components/TopAppBar';
import type { RootStackScreenProps } from '../../types/navigation';
import { styles } from './RegisterScreen.styles';
import { useAuth } from '../../context/AuthContext';
import { departmentService, DepartmentResponse } from '../../services';

const logo = require('../../../assets/operologo.png');

type RegisterScreenProps = RootStackScreenProps<'Register'>;

type Role = { id: number; name: string; label: string };

const roles: Role[] = [
  { id: 1, name: 'USER', label: 'Alumno' },
  { id: 2, name: 'MANAGER', label: 'Manager' },
  { id: 3, name: 'WORKER', label: 'Operador' },
];

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<number>(1); // Default: USER
  const [selectedDepartment, setSelectedDepartment] = useState<number | undefined>();
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDepartmentsLoading, setIsDepartmentsLoading] = useState(false);

  const { register, isAuthenticated, user } = useAuth();

  /**
   * Cargar departamentos al montar el componente
   */
  useEffect(() => {
    loadDepartments();
  }, []);

  /**
   * Redirigir si ya está autenticado
   */
  useEffect(() => {
    if (isAuthenticated && user) {
      navigateByRole(user.roleName);
    }
  }, [isAuthenticated, user, navigation]);

  /**
   * Cargar lista de departamentos
   */
  const loadDepartments = async () => {
    try {
      setIsDepartmentsLoading(true);
      const deps = await departmentService.getAll();
      setDepartments(deps);

      // Seleccionar el primer departamento por defecto si hay
      if (deps.length > 0) {
        setSelectedDepartment(deps[0].id);
      }
    } catch (error: any) {
      console.error('[RegisterScreen] Error al cargar departamentos:', error);
      Alert.alert('Advertencia', 'No se pudieron cargar los departamentos');
    } finally {
      setIsDepartmentsLoading(false);
    }
  };

  /**
   * Navegar según el rol del usuario
   */
  const navigateByRole = (roleName: string) => {
    switch (roleName) {
      case 'USER':
        navigation.replace('StudentTabs');
        break;
      case 'MANAGER':
        navigation.replace('ManagerTabs');
        break;
      case 'WORKER':
        navigation.replace('MaintenanceTabs');
        break;
      default:
        console.warn('[RegisterScreen] Rol desconocido:', roleName);
    }
  };

  /**
   * Manejar el registro
   */
  const handleRegister = async () => {
    // Validaciones
    if (!fullName.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu nombre completo');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu email');
      return;
    }

    if (!password.trim()) {
      Alert.alert('Error', 'Por favor ingresa una contraseña');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres');
      return;
    }

    // Para MANAGER y WORKER, el departamento es requerido
    if ((selectedRole === 2 || selectedRole === 3) && !selectedDepartment) {
      Alert.alert('Error', 'Por favor selecciona un departamento');
      return;
    }

    try {
      setIsLoading(true);

      await register(
        fullName.trim(),
        email.trim(),
        password,
        selectedRole,
        selectedDepartment
      );

      // El useEffect se encargará de la navegación
    } catch (error: any) {
      console.error('[RegisterScreen] Error en registro:', error);
      Alert.alert(
        'Error de registro',
        error.message || 'No se pudo crear la cuenta. Intenta nuevamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TopAppBar onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        <View style={styles.header}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.sub}>Accede al sistema de gestión de incidencias</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Nombre completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Juan Pérez"
              placeholderTextColor={COLORS.outline}
              value={fullName}
              onChangeText={setFullName}
              editable={!isLoading}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email institucional</Text>
            <TextInput
              style={styles.input}
              placeholder="nombre@universidad.edu"
              placeholderTextColor={COLORS.outline}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              editable={!isLoading}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, { flex: 1, borderWidth: 0 }]}
                placeholder="Mínimo 8 caracteres"
                placeholderTextColor={COLORS.outline}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                editable={!isLoading}
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

          <View style={styles.field}>
            <Text style={styles.label}>Rol</Text>
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              {roles.map((role) => (
                <TouchableOpacity
                  key={role.id}
                  onPress={() => setSelectedRole(role.id)}
                  disabled={isLoading}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 8,
                    backgroundColor: selectedRole === role.id ? COLORS.primary : COLORS.surfaceVariant,
                    borderWidth: 1,
                    borderColor: selectedRole === role.id ? COLORS.primary : COLORS.outline,
                  }}
                >
                  <Text style={{
                    color: selectedRole === role.id ? COLORS.onPrimary : COLORS.onSurfaceVariant,
                    fontWeight: '500',
                  }}>
                    {role.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Mostrar selector de departamento solo para MANAGER y WORKER */}
          {(selectedRole === 2 || selectedRole === 3) && (
            <View style={styles.field}>
              <Text style={styles.label}>Departamento</Text>
              {isDepartmentsLoading ? (
                <ActivityIndicator color={COLORS.primary} />
              ) : (
                <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                  {departments.map((dept) => (
                    <TouchableOpacity
                      key={dept.id}
                      onPress={() => setSelectedDepartment(dept.id)}
                      disabled={isLoading}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 8,
                        backgroundColor: selectedDepartment === dept.id ? COLORS.primary : COLORS.surfaceVariant,
                        borderWidth: 1,
                        borderColor: selectedDepartment === dept.id ? COLORS.primary : COLORS.outline,
                      }}
                    >
                      <Text style={{
                        color: selectedDepartment === dept.id ? COLORS.onPrimary : COLORS.onSurfaceVariant,
                        fontWeight: '500',
                      }}>
                        {dept.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}

          <TouchableOpacity
            style={[styles.submitBtn, isLoading && { opacity: 0.6 }]}
            activeOpacity={0.85}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.onPrimary} />
            ) : (
              <Text style={styles.submitText}>Crear cuenta</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Ingresar</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
