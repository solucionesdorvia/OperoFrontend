/**
 * Servicio de Departamentos
 *
 * Maneja operaciones relacionadas con departamentos:
 * - Listar departamentos
 * - Obtener detalle de departamento
 * - Crear/actualizar/eliminar (solo MANAGER)
 */

import apiClient, { getErrorMessage } from './api';
import { API_CONFIG } from '../config/api.config';

/**
 * Tipos de datos
 */

export interface DepartmentResponse {
  id: number;
  name: string;
  description: string;
}

export interface DepartmentRequest {
  name: string;
  description: string;
}

/**
 * DepartmentService
 */
export const departmentService = {
  /**
   * GetAll - Listar todos los departamentos
   *
   * @returns Promise con array de departamentos
   */
  async getAll(): Promise<DepartmentResponse[]> {
    try {
      const response = await apiClient.get<DepartmentResponse[]>(
        API_CONFIG.ENDPOINTS.DEPARTMENTS
      );

      console.log(`[DepartmentService] ${response.data.length} departamentos obtenidos`);

      return response.data;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('[DepartmentService] GetAll error:', message);
      throw new Error(message);
    }
  },

  /**
   * GetById - Obtener un departamento por ID
   *
   * @param id - ID del departamento
   * @returns Promise con los datos del departamento
   */
  async getById(id: number): Promise<DepartmentResponse> {
    try {
      const response = await apiClient.get<DepartmentResponse>(
        `${API_CONFIG.ENDPOINTS.DEPARTMENTS}/${id}`
      );

      console.log(`[DepartmentService] Departamento ${id} obtenido`);

      return response.data;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('[DepartmentService] GetById error:', message);
      throw new Error(message);
    }
  },

  /**
   * Create - Crear un nuevo departamento (solo MANAGER)
   *
   * @param department - Datos del nuevo departamento
   * @returns Promise con el departamento creado
   */
  async create(department: DepartmentRequest): Promise<DepartmentResponse> {
    try {
      const response = await apiClient.post<DepartmentResponse>(
        API_CONFIG.ENDPOINTS.DEPARTMENTS,
        department
      );

      console.log(`[DepartmentService] Departamento creado:`, response.data.id);

      return response.data;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('[DepartmentService] Create error:', message);
      throw new Error(message);
    }
  },

  /**
   * Update - Actualizar un departamento (solo MANAGER)
   *
   * @param id - ID del departamento
   * @param updates - Datos a actualizar
   * @returns Promise con el departamento actualizado
   */
  async update(id: number, updates: DepartmentRequest): Promise<DepartmentResponse> {
    try {
      const response = await apiClient.put<DepartmentResponse>(
        `${API_CONFIG.ENDPOINTS.DEPARTMENTS}/${id}`,
        updates
      );

      console.log(`[DepartmentService] Departamento ${id} actualizado`);

      return response.data;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('[DepartmentService] Update error:', message);
      throw new Error(message);
    }
  },

  /**
   * Delete - Eliminar un departamento (solo MANAGER)
   *
   * @param id - ID del departamento a eliminar
   * @returns Promise<void>
   */
  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`${API_CONFIG.ENDPOINTS.DEPARTMENTS}/${id}`);

      console.log(`[DepartmentService] Departamento ${id} eliminado`);
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('[DepartmentService] Delete error:', message);
      throw new Error(message);
    }
  },
};
