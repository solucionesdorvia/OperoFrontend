import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Image, ActivityIndicator, Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';
import type { RootStackScreenProps } from '../../types/navigation';
import { styles } from './LoginScreen.styles';
import { useAuth } from '../../context/AuthContext';
import { isValidEmail } from '../../utils/validationUtils';

const logo = require('../../../assets/operologo.png');

type LoginScreenProps = RootStackScreenProps<'Login'>;

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Estado para modal de error
  const [errorModal, setErrorModal] = useState<{ visible: boolean; title: string; message: string }>({
    visible: false,
    title: '',
    message: '',
  });

  const { login, user, isAuthenticated } = useAuth();

  // Helper para mostrar alertas
  const showAlert = (title: string, message: string) => {
    setErrorModal({ visible: true, title, message });
  };

  /**
   * Redirigir automáticamente si el usuario ya está autenticado
   */
  useEffect(() => {
    if (isAuthenticated && user) {
      navigateByRole(user.roleName);
    }
  }, [isAuthenticated, user, navigation]);

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
        console.warn('[LoginScreen] Rol desconocido:', roleName);
        showAlert('Error', 'Rol de usuario no reconocido');
    }
  };

  /**
   * Manejar el login
   */
  const handleLogin = async () => {
    // Validaciones básicas
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
      showAlert('Error', 'Por favor ingresa tu contraseña');
      return;
    }

    try {
      setIsLoading(true);
      await login(email.trim(), password);
    } catch (error: any) {
      console.error('[LoginScreen] Error en login:', error);

      let errorMessage = error.message || 'No se pudo iniciar sesión. Verifica tus credenciales.';
      let errorTitle = 'Error de autenticación';

      if (error.message?.includes('Email no encontrado')) {
        errorTitle = 'Email no encontrado';
        errorMessage = 'No existe una cuenta con este email. Verifica que esté escrito correctamente o regístrate.';
      } else if (error.message?.includes('Contraseña incorrecta')) {
        errorTitle = 'Contraseña incorrecta';
        errorMessage = 'La contraseña ingresada es incorrecta. Verifica e intenta nuevamente.';
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
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        <View style={styles.brand}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.wordmark}>OPERO</Text>
          <Text style={styles.tagline}>Sistema de gestión de incidencias</Text>
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
              value={email}
              onChangeText={setEmail}
              editable={!isLoading}
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

          <TouchableOpacity
            style={[styles.submitBtn, isLoading && { opacity: 0.6 }]}
            onPress={handleLogin}
            activeOpacity={0.85}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.onPrimary} />
            ) : (
              <Text style={styles.submitText}>Ingresar</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>¿No tienes cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.footerLink}>Registrarse</Text>
          </TouchableOpacity>
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
