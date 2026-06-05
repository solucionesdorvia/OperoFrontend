import { api, getErrorMessage } from './api';
import { ENDPOINTS } from '../../constants/api';

export interface IncidentRequest {
  title: string;
  description: string;
  departmentId: number;
  locationDescription?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface UpdateIncidentRequest {
  title?: string;
  description?: string;
}

export interface IncidentResponse {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
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

export const incidentService = {
  async getAll(): Promise<IncidentResponse[]> {
    try {
      const response = await api.get<IncidentResponse[]>(ENDPOINTS.INCIDENTS);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async getById(id: number): Promise<IncidentResponse> {
    try {
      const response = await api.get<IncidentResponse>(`${ENDPOINTS.INCIDENTS}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async create(incident: IncidentRequest): Promise<IncidentResponse> {
    try {
      const response = await api.post<IncidentResponse>(ENDPOINTS.INCIDENTS, incident);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async update(id: number, updates: UpdateIncidentRequest): Promise<IncidentResponse> {
    try {
      const response = await api.put<IncidentResponse>(`${ENDPOINTS.INCIDENTS}/${id}`, updates);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async updateStatus(id: number, status: string): Promise<IncidentResponse> {
    try {
      const response = await api.patch<IncidentResponse>(`${ENDPOINTS.INCIDENTS}/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async updatePriority(id: number, priority: string): Promise<IncidentResponse> {
    try {
      const response = await api.patch<IncidentResponse>(`${ENDPOINTS.INCIDENTS}/${id}/priority`, { priority });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async assignWorker(id: number, workerId: number): Promise<IncidentResponse> {
    try {
      const response = await api.patch<IncidentResponse>(`${ENDPOINTS.INCIDENTS}/${id}/assign`, { workerId });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`${ENDPOINTS.INCIDENTS}/${id}`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async updateDepartment(id: number, departmentId: number): Promise<IncidentResponse> {
    try {
      const response = await api.put<IncidentResponse>(
        `${ENDPOINTS.INCIDENTS}/${id}/department`,
        { departmentId }
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async acceptIncident(id: number): Promise<IncidentResponse> {
    try {
      const response = await api.put<IncidentResponse>(
        `${ENDPOINTS.INCIDENTS}/${id}/accept`
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
