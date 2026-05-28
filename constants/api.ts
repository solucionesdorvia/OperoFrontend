import { Platform } from 'react-native';
import Constants from 'expo-constants';

const getBaseURL = () => {
  // Primero intentar obtener la URL de las variables de entorno
  const apiUrl = Constants.expoConfig?.extra?.apiUrl ||
                 process.env.EXPO_PUBLIC_API_URL;

  if (apiUrl) {
    console.log('[API] Usando URL de entorno:', apiUrl);
    return apiUrl;
  }

  // Fallback a desarrollo local
  console.log('[API] Usando URL de desarrollo local');
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
};
