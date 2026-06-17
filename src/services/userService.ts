import { api, getErrorMessage } from './api';
import { UserResponse } from './authService';
import { ENDPOINTS } from '../../constants/api';

export interface UpdateUserRequest {
  fullName?: string;
  password?: string;
}

export interface CreateWorkerRequest {
  fullName: string;
  emailUade: string;
  password: string;
  departmentId: number;
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

  // Crear un operario (rol WORKER) desde la pantalla de Manager.
  // Usa el endpoint público /auth/register pero NO toca el token actual
  // (a diferencia de authService.register que loguea al usuario nuevo).
  // El manager sigue logueado con su propio token.
  async createWorker(data: CreateWorkerRequest): Promise<UserResponse> {
    try {
      const response = await api.post<{ token: string; user: UserResponse; message: string }>(
        ENDPOINTS.AUTH.REGISTER,
        { ...data, roleId: 3 },
      );
      return response.data.user;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
