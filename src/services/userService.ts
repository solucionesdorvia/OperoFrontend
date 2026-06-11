import { api, getErrorMessage } from './api';
import { UserResponse } from './authService';
import { ENDPOINTS } from '../../constants/api';

export interface UpdateUserRequest {
  fullName?: string;
  password?: string;
}

export const userService = {
  async getMe(): Promise<UserResponse> {
    try {
      const response = await api.get<UserResponse>(ENDPOINTS.USERS_ME);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async updateMe(updates: UpdateUserRequest): Promise<UserResponse> {
    try {
      const response = await api.put<UserResponse>(ENDPOINTS.USERS_ME, updates);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async getAll(): Promise<UserResponse[]> {
    try {
      const response = await api.get<UserResponse[]>(ENDPOINTS.USERS);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async getById(id: number): Promise<UserResponse> {
    try {
      const response = await api.get<UserResponse>(`${ENDPOINTS.USERS}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async getByDepartment(departmentId: number): Promise<UserResponse[]> {
    try {
      const response = await api.get<UserResponse[]>(`${ENDPOINTS.USERS}?departmentId=${departmentId}`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
