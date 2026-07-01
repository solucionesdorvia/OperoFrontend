import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../constants/api';

export const TOKEN_KEY = '@opero_auth_token';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 segundos para conexiones móviles lentas
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Configuración de reintentos
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 segundo entre reintentos

// Helper para esperar entre reintentos
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper para determinar si un error es reintentable
const isRetryableError = (error: AxiosError, config: InternalAxiosRequestConfig): boolean => {
  // NO reintentar operaciones no idempotentes (POST, PUT, PATCH, DELETE)
  // Solo reintentar GET requests de forma segura
  if (config.method && config.method.toUpperCase() !== 'GET') {
    return false;
  }

  // Reintentar en errores de red o timeouts
  return (
    error.code === 'ECONNABORTED' ||
    error.code === 'ERR_NETWORK' ||
    error.message === 'Network Error' ||
    !error.response // Sin respuesta = problema de red
  );
};

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Solo agregar Authorization si NO existe ya (para no sobrescribir headers manuales)
      if (!config.headers.Authorization) {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      // Inicializar contador de reintentos si no existe
      if (!config.headers['x-retry-count']) {
        config.headers['x-retry-count'] = '0';
      }

      return config;
    } catch (error) {
      return config;
    }
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig & { headers: any };

    // NO borrar el token automáticamente en 401
    // El logout debe ser manual (cuando el usuario hace logout o expira la sesión de manera controlada)
    // Un 401 puede ser por falta de permisos, no necesariamente por token inválido

    // Lógica de reintentos para errores de red
    if (config && isRetryableError(error, config)) {
      const retryCount = parseInt(config.headers['x-retry-count'] || '0');

      if (retryCount < MAX_RETRIES) {
        // Incrementar contador de reintentos
        config.headers['x-retry-count'] = String(retryCount + 1);

        console.log(`[api] Reintentando petición (intento ${retryCount + 1}/${MAX_RETRIES}):`, config.url);

        // Esperar antes de reintentar
        await delay(RETRY_DELAY * (retryCount + 1)); // Backoff exponencial suave

        // Reintentar la petición
        return api.request(config);
      }

      console.log(`[api] Máximo de reintentos alcanzado para:`, config.url);
    }

    return Promise.reject(error);
  }
);

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response?.data) {
      // El backend puede retornar { error: "mensaje" } o solo "mensaje"
      if (typeof error.response.data === 'string') {
        return error.response.data;
      }
      if (error.response.data.error) {
        return error.response.data.error;
      }
      if (error.response.data.message) {
        return error.response.data.message;
      }
    }
    if (error.message === 'Network Error') {
      return 'No se pudo conectar con el servidor';
    }
    if (error.code === 'ECONNABORTED') {
      return 'La petición tardó demasiado tiempo';
    }
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Ocurrió un error inesperado';
};
