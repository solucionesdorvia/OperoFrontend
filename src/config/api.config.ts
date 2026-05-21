/**
 * Configuración de API
 *
 * Define las URLs base para conectar con el backend según el entorno.
 *
 * IMPORTANTE: Para desarrollo local, necesitas configurar la URL correcta:
 *
 * 1. Emulador Android:
 *    - 10.0.2.2 es un alias especial que mapea a localhost del host
 *    - Usar: http://10.0.2.2:8080
 *
 * 2. Emulador iOS:
 *    - Usar directamente: http://localhost:8080
 *
 * 3. Dispositivo físico (mismo WiFi):
 *    - Usar la IP local de tu computadora en la red
 *    - Ejemplo: http://192.168.1.100:8080
 *    - Para encontrar tu IP:
 *      macOS: ifconfig | grep "inet " | grep -v 127.0.0.1
 *      Windows: ipconfig
 *      Linux: ip addr show
 *
 * 4. Expo Web:
 *    - Usar: http://localhost:8080
 */

// Función para detectar si estamos en un emulador Android
import { Platform } from 'react-native';

// Configuración por defecto
const getBaseURL = (): string => {
  // En producción, usar la URL real de tu servidor
  if (__DEV__) {
    // Desarrollo local
    if (Platform.OS === 'android') {
      // Emulador Android
      return 'http://10.0.2.2:8080';
    } else if (Platform.OS === 'ios') {
      // Emulador iOS o dispositivo iOS en red local
      // CAMBIAR ESTA IP SI USAS DISPOSITIVO FÍSICO
      return 'http://localhost:8080';
    } else {
      // Web (Expo Web)
      return 'http://localhost:8080';
    }
  } else {
    // Producción - CAMBIAR A TU URL DE PRODUCCIÓN
    return 'https://tu-backend.railway.app';
  }
};

export const API_CONFIG = {
  BASE_URL: getBaseURL(),
  TIMEOUT: 10000, // 10 segundos

  // Endpoints
  ENDPOINTS: {
    // Auth
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',

    // Users
    USERS: '/api/users',
    USER_ME: '/api/users/me',

    // Incidents
    INCIDENTS: '/api/incidents',

    // Departments
    DEPARTMENTS: '/api/departments',

    // Ping
    PING: '/api/ping',
  },
} as const;

// Para depuración
console.log('[API Config] Base URL:', API_CONFIG.BASE_URL);
console.log('[API Config] Platform:', Platform.OS);
