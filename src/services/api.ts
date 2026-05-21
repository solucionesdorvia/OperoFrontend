/**
 * Cliente HTTP Base
 *
 * Configura axios con:
 * - URL base del backend
 * - Timeout
 * - Interceptores para agregar token JWT automáticamente
 * - Manejo de errores centralizado
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../config/api.config';

// Clave para guardar el token en AsyncStorage
export const TOKEN_KEY = '@opero_auth_token';

/**
 * Instancia de axios configurada
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de Request
 *
 * Agrega automáticamente el token JWT a todas las peticiones
 */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Obtener el token del almacenamiento local
      const token = await AsyncStorage.getItem(TOKEN_KEY);

      // Si existe el token, agregarlo al header Authorization
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    } catch (error) {
      console.error('[API Request Interceptor] Error:', error);
      return config;
    }
  },
  (error) => {
    console.error('[API Request Interceptor] Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Interceptor de Response
 *
 * Maneja errores de forma centralizada
 */
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`);
    return response;
  },
  async (error: AxiosError) => {
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      console.error('[API Response Error]', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      });

      // Si es 401 (No autorizado), el token expiró o es inválido
      if (error.response.status === 401) {
        // Limpiar el token del storage
        await AsyncStorage.removeItem(TOKEN_KEY);
        // Aquí podrías emitir un evento para que la app redirija al login
        console.log('[API] Token inválido o expirado. Sesión cerrada.');
      }
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      console.error('[API Network Error] No se pudo conectar con el servidor', error.message);
    } else {
      // Algo pasó al configurar la petición
      console.error('[API Error]', error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;

/**
 * Helper para extraer mensajes de error
 */
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;

    if (axiosError.response?.data) {
      // Si el backend envía un mensaje de error
      if (typeof axiosError.response.data === 'string') {
        return axiosError.response.data;
      }
      if (axiosError.response.data.message) {
        return axiosError.response.data.message;
      }
      if (axiosError.response.data.error) {
        return axiosError.response.data.error;
      }
    }

    if (axiosError.message === 'Network Error') {
      return 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
    }

    if (axiosError.code === 'ECONNABORTED') {
      return 'La petición tardó demasiado tiempo. Intenta nuevamente.';
    }

    return axiosError.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Ocurrió un error inesperado';
};
