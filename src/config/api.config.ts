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

// IP local de tu computadora
const LOCAL_IP = '10.100.40.56';

// Configuración por defecto
const getBaseURL = (): string => {
  // En cualquier entorno (web, Expo Go con extra), priorizar la env var pública
  // En Railway/producción: EXPO_PUBLIC_API_URL=https://operonuevo-production.up.railway.app
  const envUrl =
    (typeof process !== 'undefined' && process.env && process.env.EXPO_PUBLIC_API_URL) ||
    undefined;
  if (envUrl) return envUrl;

  if (__DEV__) {
    // Desarrollo: usar IP local
    // NOTA: Requiere firewall de macOS desactivado para dispositivos físicos
    if (Platform.OS === 'android') {
      // Emulador Android usa alias especial
      return 'http://10.0.2.2:8080';
    } else {
      // iOS simulador/dispositivo y web
      return `http://${LOCAL_IP}:8080`;
    }
  } else {
    // Producción (fallback si no se setea EXPO_PUBLIC_API_URL)
    return 'https://operonuevo-production.up.railway.app';
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
