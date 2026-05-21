/**
 * Servicio de Autenticación
 *
 * Maneja todas las operaciones relacionadas con autenticación:
 * - Login
 * - Register
 * - Logout
 * - Obtener datos del usuario autenticado
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient, { TOKEN_KEY, getErrorMessage } from './api';
import { API_CONFIG } from '../config/api.config';

/**
 * Tipos de datos
 */

// Request types
export interface LoginRequest {
  emailUade: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  emailUade: string;
  password: string;
  roleId: number; // 1=USER, 2=MANAGER, 3=WORKER
  departmentId?: number; // Opcional para USER, requerido para MANAGER y WORKER
}

// Response types
export interface UserResponse {
  id: number;
  fullName: string;
  emailUade: string;
  role: {
    id: number;
    name: string; // "USER", "MANAGER", "WORKER"
  };
  department?: {
    id: number;
    name: string;
  };
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
  message: string;
}

/**
 * AuthService
 */
export const authService = {
  /**
   * Login - Iniciar sesión
   *
   * @param credentials - Email y contraseña
   * @returns Promise con el token y datos del usuario
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.LOGIN,
        credentials
      );

      // Guardar el token en AsyncStorage
      await AsyncStorage.setItem(TOKEN_KEY, response.data.token);

      console.log('[AuthService] Login exitoso:', response.data.user.emailUade);

      return response.data;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('[AuthService] Login error:', message);
      throw new Error(message);
    }
  },

  /**
   * Register - Registrar nuevo usuario
   *
   * @param userData - Datos del nuevo usuario
   * @returns Promise con el token y datos del usuario creado
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.REGISTER,
        userData
      );

      // Guardar el token en AsyncStorage
      await AsyncStorage.setItem(TOKEN_KEY, response.data.token);

      console.log('[AuthService] Registro exitoso:', response.data.user.emailUade);

      return response.data;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('[AuthService] Register error:', message);
      throw new Error(message);
    }
  },

  /**
   * Logout - Cerrar sesión
   *
   * Elimina el token del almacenamiento local y notifica al backend
   */
  async logout(): Promise<void> {
    try {
      // Intentar notificar al backend (opcional, puede fallar si el token expiró)
      try {
        await apiClient.post(API_CONFIG.ENDPOINTS.LOGOUT);
      } catch (error) {
        console.warn('[AuthService] Backend logout failed (ignorado):', error);
      }

      // Eliminar el token del storage
      await AsyncStorage.removeItem(TOKEN_KEY);

      console.log('[AuthService] Logout exitoso');
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('[AuthService] Logout error:', message);
      throw new Error(message);
    }
  },

  /**
   * Me - Obtener datos del usuario autenticado
   *
   * @returns Promise con los datos del usuario
   */
  async me(): Promise<UserResponse> {
    try {
      const response = await apiClient.get<UserResponse>(API_CONFIG.ENDPOINTS.ME);

      console.log('[AuthService] Usuario autenticado:', response.data.emailUade);

      return response.data;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('[AuthService] Me error:', message);
      throw new Error(message);
    }
  },

  /**
   * GetToken - Obtener el token guardado en AsyncStorage
   *
   * @returns Promise con el token o null si no existe
   */
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('[AuthService] Error al obtener token:', error);
      return null;
    }
  },

  /**
   * IsAuthenticated - Verificar si hay un token guardado
   *
   * @returns Promise con true si hay token, false si no
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return token !== null;
  },
};
