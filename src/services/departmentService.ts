import { api, getErrorMessage } from './api';
import { ENDPOINTS } from '../../constants/api';

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
};
