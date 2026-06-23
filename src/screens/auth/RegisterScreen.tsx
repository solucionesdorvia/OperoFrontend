import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Image, ActivityIndicator, Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';
import TopAppBar from '../../components/TopAppBar';
import type { RootStackScreenProps } from '../../types/navigation';
import { styles } from './RegisterScreen.styles';
import { useAuth } from '../../context/AuthContext';
import { departmentService, DepartmentResponse } from '../../services';
import { isValidEmail } from '../../utils/validationUtils';

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
  const [invitationCode, setInvitationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDepartmentsLoading, setIsDepartmentsLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Estado para modal de error
  const [errorModal, setErrorModal] = useState<{ visible: boolean; title: string; message: string }>({
    visible: false,
    title: '',
    message: '',
  });

  const { register, isAuthenticated, user } = useAuth();

  // Helper para mostrar alertas
  const showAlert = (title: string, message: string) => {
    setErrorModal({ visible: true, title, message });
  };

  /**
   * Cargar departamentos al montar el componente
   */
  useEffect(() => {
    loadDepartments();
  }, []);

  /**
   * Redirigir si ya está autenticado Y el registro fue exitoso
   */
  useEffect(() => {
    if (isAuthenticated && user && registerSuccess) {
      navigateByRole(user.roleName);
    }
  }, [isAuthenticated, user, registerSuccess]);

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
      showAlert('Advertencia', 'No se pudieron cargar los departamentos');
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
      showAlert('Error', 'Por favor ingresa tu nombre completo');
      return;
    }

    if (!email.trim()) {
      showAlert('Error', 'Por favor ingresa tu email');
      return;
    }

    // Validar formato de email
    if (!isValidEmail(email.trim())) {
      showAlert('Email inválido', 'Por favor ingresa un email válido (ejemplo: nombre@universidad.edu)');
      return;
    }

    if (!password.trim()) {
      showAlert('Error', 'Por favor ingresa una contraseña');
      return;
    }

    if (password.length < 8) {
      showAlert('Contraseña muy corta', 'La contraseña debe tener al menos 8 caracteres');
      return;
    }

    // Para MANAGER, validar código de invitación
    if (selectedRole === 2) {
      if (!invitationCode.trim()) {
        showAlert('Error', 'Por favor ingresa el código de invitación');
        return;
      }
      if (invitationCode.trim() !== 'ADMINUADE') {
        showAlert('Código inválido', 'El código de invitación es incorrecto');
        return;
      }
    }

    // Para MANAGER y WORKER, el departamento es requerido
    if ((selectedRole === 2 || selectedRole === 3) && !selectedDepartment) {
      showAlert('Error', 'Por favor selecciona un departamento');
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

      // Si llegó aquí, el registro fue exitoso
      setRegisterSuccess(true);
    } catch (error: any) {
      console.error('[RegisterScreen] Error en registro:', error);

      let errorMessage = error.message || 'No se pudo crear la cuenta. Intenta nuevamente.';
      let errorTitle = 'Error de registro';

      if (error.message?.includes('El email ya está registrado')) {
        errorTitle = 'Email ya registrado';
        errorMessage = 'Ya existe una cuenta con este email. Intenta iniciar sesión o usa otro email.';
      } else if (error.message?.includes('Rol no encontrado')) {
        errorTitle = 'Error en el sistema';
        errorMessage = 'Hubo un problema con el rol seleccionado. Intenta nuevamente o contacta soporte.';
      } else if (error.message?.includes('Departamento no encontrado')) {
        errorTitle = 'Departamento no válido';
        errorMessage = 'El departamento seleccionado no existe. Intenta seleccionar otro.';
      }

      showAlert(errorTitle, errorMessage);
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

          {/* Mostrar código de invitación solo para MANAGER */}
          {selectedRole === 2 && (
            <View style={styles.field}>
              <Text style={styles.label}>Código de invitación</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresa el código de invitación"
                placeholderTextColor={COLORS.outline}
                autoCapitalize="characters"
                value={invitationCode}
                onChangeText={setInvitationCode}
                editable={!isLoading}
              />
              <Text style={styles.hint}>Código requerido para registrarse como Manager</Text>
            </View>
          )}

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

      {/* Modal de error */}
      <Modal
        visible={errorModal.visible}
        transparent
        animationType="fade"
        onRequestClose={() => setErrorModal({ visible: false, title: '', message: '' })}
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.container}>
            <View style={modalStyles.iconContainer}>
              <MaterialIcons name="error-outline" size={48} color={COLORS.error} />
            </View>
            <Text style={modalStyles.title}>{errorModal.title}</Text>
            <Text style={modalStyles.message}>{errorModal.message}</Text>
            <TouchableOpacity
              style={modalStyles.button}
              onPress={() => setErrorModal({ visible: false, title: '', message: '' })}
              activeOpacity={0.8}
            >
              <Text style={modalStyles.buttonText}>ENTENDIDO</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: FONTS.size.lg,
    fontFamily: FONTS.family.displaySemiBold,
    color: COLORS.onSurface,
    textAlign: 'center',
  },
  message: {
    fontSize: FONTS.size.sm,
    fontFamily: FONTS.family.body,
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: FONTS.size.xs,
    fontFamily: FONTS.family.monoSemiBold,
    color: COLORS.onPrimary,
    letterSpacing: FONTS.tracking.caps,
  },
});
