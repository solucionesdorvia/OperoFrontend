/**
 * Servicio de Usuarios
 *
 * Maneja operaciones relacionadas con usuarios:
 * - Obtener perfil propio
 * - Actualizar perfil propio
 * - Listar usuarios (solo MANAGER)
 */

import apiClient, { getErrorMessage } from './api';
import { API_CONFIG } from '../config/api.config';
import { UserResponse } from './authService';

/**
 * Tipos de datos
 */

export interface UpdateUserRequest {
  fullName?: string;
  password?: string;
}

/**
 * UserService
 */
export const userService = {
  /**
   * GetMe - Obtener datos del usuario autenticado
   *
   * @returns Promise con los datos del usuario
   */
  async getMe(): Promise<UserResponse> {
    try {
      const response = await apiClient.get<UserResponse>(API_CONFIG.ENDPOINTS.USER_ME);

      console.log('[UserService] Usuario actual:', response.data.emailUade);

      return response.data;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('[UserService] GetMe error:', message);
      throw new Error(message);
    }
  },

  /**
   * UpdateMe - Actualizar datos del usuario autenticado
   *
   * @param updates - Datos a actualizar
   * @returns Promise con los datos actualizados del usuario
   */
  async updateMe(updates: UpdateUserRequest): Promise<UserResponse> {
    try {
      const response = await apiClient.put<UserResponse>(
        API_CONFIG.ENDPOINTS.USER_ME,
        updates
      );

      console.log('[UserService] Usuario actualizado');

      return response.data;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('[UserService] UpdateMe error:', message);
      throw new Error(message);
    }
  },

  /**
   * GetAll - Listar todos los usuarios (solo MANAGER)
   *
   * @returns Promise con array de usuarios
   */
  async getAll(): Promise<UserResponse[]> {
    try {
      const response = await apiClient.get<UserResponse[]>(API_CONFIG.ENDPOINTS.USERS);

      console.log(`[UserService] ${response.data.length} usuarios obtenidos`);

      return response.data;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('[UserService] GetAll error:', message);
      throw new Error(message);
    }
  },

  /**
   * GetById - Obtener un usuario por ID (solo MANAGER)
   *
   * @param id - ID del usuario
   * @returns Promise con los datos del usuario
   */
  async getById(id: number): Promise<UserResponse> {
    try {
      const response = await apiClient.get<UserResponse>(
        `${API_CONFIG.ENDPOINTS.USERS}/${id}`
      );

      console.log(`[UserService] Usuario ${id} obtenido`);

      return response.data;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('[UserService] GetById error:', message);
      throw new Error(message);
    }
  },
};
