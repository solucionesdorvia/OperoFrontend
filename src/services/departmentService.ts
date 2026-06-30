import { api, getErrorMessage, TOKEN_KEY } from './api';
import { ENDPOINTS } from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Matchea DepartmentResponse del backend (no usa description).
export interface DepartmentResponse {
  id: number;
  name: string;
  managerId?: number | null;
  managerName?: string | null;
  managerEmail?: string | null;
}

export interface DepartmentRequest {
  name: string;
  managerId?: number;
}

export const departmentService = {
  async getAll(): Promise<DepartmentResponse[]> {
    try {
      const response = await api.get<DepartmentResponse[]>(ENDPOINTS.DEPARTMENTS);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async getById(id: number): Promise<DepartmentResponse> {
    try {
      const response = await api.get<DepartmentResponse>(`${ENDPOINTS.DEPARTMENTS}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async create(department: DepartmentRequest): Promise<DepartmentResponse> {
    try {
      const response = await api.post<DepartmentResponse>(ENDPOINTS.DEPARTMENTS, department);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async update(id: number, updates: DepartmentRequest): Promise<DepartmentResponse> {
    try {
      const response = await api.put<DepartmentResponse>(`${ENDPOINTS.DEPARTMENTS}/${id}`, updates);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async delete(id: number): Promise<void> {
    try {
      // Obtener token explícitamente para asegurar que se envíe
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      console.log('[departmentService.delete] Token:', token ? `SÍ - Preview: ${token.substring(0, 30)}...` : 'NO - NULL o undefined');

      if (!token) {
        throw new Error('No autenticado - token no encontrado en AsyncStorage');
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };
      console.log('[departmentService.delete] Headers que se enviarán:', JSON.stringify(headers).substring(0, 80));

      await api.delete(`${ENDPOINTS.DEPARTMENTS}/${id}`, { headers });
      console.log('[departmentService.delete] DELETE exitoso');
    } catch (error) {
      console.error('[departmentService.delete] Error completo:', error);
      throw new Error(getErrorMessage(error));
    }
  },
};
