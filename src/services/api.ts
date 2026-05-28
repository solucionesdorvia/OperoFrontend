import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../constants/api';

export const TOKEN_KEY = '@opero_auth_token';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      return config;
    }
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem(TOKEN_KEY);
    }
    return Promise.reject(error);
  }
);

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response?.data) {
      if (typeof error.response.data === 'string') {
        return error.response.data;
      }
      if (error.response.data.message) {
        return error.response.data.message;
      }
      if (error.response.data.error) {
        return error.response.data.error;
      }
    }
    if (error.message === 'Network Error') {
      return 'No se pudo conectar con el servidor';
    }
    if (error.code === 'ECONNABORTED') {
      return 'La petición tardó demasiado tiempo';
    }
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Ocurrió un error inesperado';
};
