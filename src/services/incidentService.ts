/**
 * Servicio de Incidentes
 *
 * Maneja todas las operaciones CRUD de incidentes:
 * - Listar incidentes
 * - Crear incidente
 * - Obtener detalle de incidente
 * - Actualizar incidente
 * - Cambiar status
 * - Cambiar prioridad
 * - Asignar worker
 * - Eliminar incidente
 */

import apiClient, { getErrorMessage } from './api';
import { API_CONFIG } from '../config/api.config';

/**
 * Tipos de datos
 */

export interface IncidentRequest {
  title: string;
  description: string;
  departmentId: number;
}

export interface UpdateIncidentRequest {
  title?: string;
  description?: string;
}

export interface IncidentResponse {
  id: number;
  title: string;
  description: string;
  status: string; // "PENDING", "IN_PROGRESS", "RESOLVED", "CLOSED"
  priority: string; // "LOW", "MEDIUM", "HIGH", "URGENT"
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    fullName: string;
    emailUade: string;
  };
  department: {
    id: number;
    name: string;
  };
  assignedWorker?: {
    id: number;
    fullName: string;
    emailUade: string;
  };
}

/**
 * IncidentService
 */
export const incidentService = {
  /**
   * GetAll - Listar todos los incidentes
   *
   * El backend filtra automáticamente según el rol:
   * - USER: Solo sus propios incidentes
   * - WORKER: Incidentes asignados a él
   * - MANAGER: Todos los incidentes de su departamento
   *
   * @returns Promise con array de incidentes
   */
  async getAll(): Promise<IncidentResponse[]> {
    try {
      const response = await apiClient.get<IncidentResponse[]>(
        API_CONFIG.ENDPOINTS.INCIDENTS
      );

      console.log(`[IncidentService] ${response.data.length} incidentes obtenidos`);

      return response.data;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('[IncidentService] GetAll error:', message);
      throw new Error(message);
    }
  },

  /**
   * GetById - Obtener un incidente por ID
   *
   * @param id - ID del incidente
   * @returns Promise con el incidente
   */
  async getById(id: number): Promise<IncidentResponse> {
    try {
      const response = await apiClient.get<IncidentResponse>(
        `${API_CONFIG.ENDPOINTS.INCIDENTS}/${id}`
      );

      console.log(`[IncidentService] Incidente ${id} obtenido`);

      return response.data;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('[IncidentService] GetById error:', message);
      throw new Error(message);
    }
  },

  /**
   * Create - Crear un nuevo incidente
   *
   * Solo USER y MANAGER pueden crear incidentes
   *
   * @param incident - Datos del nuevo incidente
   * @returns Promise con el incidente creado
   */
  async create(incident: IncidentRequest): Promise<IncidentResponse> {
    try {
      const response = await apiClient.post<IncidentResponse>(
        API_CONFIG.ENDPOINTS.INCIDENTS,
        incident
      );

      console.log(`[IncidentService] Incidente creado:`, response.data.id);

      return response.data;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('[IncidentService] Create error:', message);
      throw new Error(message);
    }
  },

  /**
   * Update - Actualizar un incidente existente
   *
   * @param id - ID del incidente
   * @param updates - Datos a actualizar
   * @returns Promise con el incidente actualizado
   */
  async update(id: number, updates: UpdateIncidentRequest): Promise<IncidentResponse> {
    try {
      const response = await apiClient.put<IncidentResponse>(
        `${API_CONFIG.ENDPOINTS.INCIDENTS}/${id}`,
        updates
      );

      console.log(`[IncidentService] Incidente ${id} actualizado`);

      return response.data;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('[IncidentService] Update error:', message);
      throw new Error(message);
    }
  },

  /**
   * UpdateStatus - Cambiar el status de un incidente
   *
   * MANAGER y WORKER pueden cambiar el status
   *
   * @param id - ID del incidente
   * @param status - Nuevo status
   * @returns Promise con el incidente actualizado
   */
  async updateStatus(
    id: number,
    status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  ): Promise<IncidentResponse> {
    try {
      const response = await apiClient.patch<IncidentResponse>(
        `${API_CONFIG.ENDPOINTS.INCIDENTS}/${id}/status`,
        { status }
      );

      console.log(`[IncidentService] Status del incidente ${id} cambiado a ${status}`);

      return response.data;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('[IncidentService] UpdateStatus error:', message);
      throw new Error(message);
    }
  },

  /**
   * UpdatePriority - Cambiar la prioridad de un incidente
   *
   * Solo MANAGER puede cambiar la prioridad
   *
   * @param id - ID del incidente
   * @param priority - Nueva prioridad
   * @returns Promise con el incidente actualizado
   */
  async updatePriority(
    id: number,
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  ): Promise<IncidentResponse> {
    try {
      const response = await apiClient.patch<IncidentResponse>(
        `${API_CONFIG.ENDPOINTS.INCIDENTS}/${id}/priority`,
        { priority }
      );

      console.log(`[IncidentService] Prioridad del incidente ${id} cambiada a ${priority}`);

      return response.data;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('[IncidentService] UpdatePriority error:', message);
      throw new Error(message);
    }
  },

  /**
   * AssignWorker - Asignar un trabajador a un incidente
   *
   * Solo MANAGER puede asignar workers
   *
   * @param id - ID del incidente
   * @param workerId - ID del worker a asignar
   * @returns Promise con el incidente actualizado
   */
  async assignWorker(id: number, workerId: number): Promise<IncidentResponse> {
    try {
      const response = await apiClient.patch<IncidentResponse>(
        `${API_CONFIG.ENDPOINTS.INCIDENTS}/${id}/assign`,
        { workerId }
      );

      console.log(`[IncidentService] Worker ${workerId} asignado al incidente ${id}`);

      return response.data;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('[IncidentService] AssignWorker error:', message);
      throw new Error(message);
    }
  },

  /**
   * Delete - Eliminar un incidente
   *
   * Solo MANAGER puede eliminar incidentes
   *
   * @param id - ID del incidente a eliminar
   * @returns Promise<void>
   */
  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`${API_CONFIG.ENDPOINTS.INCIDENTS}/${id}`);

      console.log(`[IncidentService] Incidente ${id} eliminado`);
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('[IncidentService] Delete error:', message);
      throw new Error(message);
    }
  },
};
