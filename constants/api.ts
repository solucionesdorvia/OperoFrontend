import { Platform } from 'react-native';
import Constants from 'expo-constants';

const getBaseURL = () => {
  // En builds de producción/preview (APK/IPA), process.env es undefined
  // SIEMPRE usar Constants.expoConfig.extra.apiUrl que viene de eas.json
  const apiUrl = Constants.expoConfig?.extra?.apiUrl;

  if (apiUrl) {
    console.log('[API] Usando URL de producción:', apiUrl);
    return apiUrl;
  }

  // Fallback SOLO para desarrollo con Expo Go
  console.warn('[API] ⚠️ No se encontró EXPO_PUBLIC_API_URL, usando localhost (solo para dev)');
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080';
  }

  // Para iOS/web, usar la IP del manifest de Expo
  const localhost = Constants.expoConfig?.hostUri?.split(':')[0] || 'localhost';
  return `http://${localhost}:8080`;
};

export const BASE_URL = getBaseURL();

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
  },
  INCIDENTS: '/api/incidents',
  DEPARTMENTS: '/api/departments',
  USERS: '/api/users',
  USERS_ME: '/api/users/me',
  FILES: '/api/files',
};
