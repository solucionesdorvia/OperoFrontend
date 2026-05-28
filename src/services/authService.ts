import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, TOKEN_KEY, getErrorMessage } from './api';
import { ENDPOINTS } from '../../constants/api';

export interface LoginRequest {
  emailUade: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  emailUade: string;
  password: string;
  roleId: number;
  departmentId?: number;
}

export interface UserResponse {
  id: number;
  fullName: string;
  emailUade: string;
  roleId: number;
  roleName: string;
  departmentId?: number | null;
  departmentName?: string | null;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
  message: string;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, credentials);
      await AsyncStorage.setItem(TOKEN_KEY, response.data.token);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(ENDPOINTS.AUTH.REGISTER, userData);
      await AsyncStorage.setItem(TOKEN_KEY, response.data.token);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post(ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // Ignorar errores del backend en logout
    } finally {
      await AsyncStorage.removeItem(TOKEN_KEY);
    }
  },

  async me(): Promise<UserResponse> {
    try {
      const response = await api.get<UserResponse>(ENDPOINTS.AUTH.ME);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return token !== null;
  },
};
