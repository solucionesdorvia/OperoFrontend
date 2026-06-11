import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService, LoginRequest, RegisterRequest } from '../authService';
import axios from 'axios';

jest.mock('axios');
jest.mock('@react-native-async-storage/async-storage');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('debería iniciar sesión correctamente y guardar el token', async () => {
      const loginRequest: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResponse = {
        data: {
          token: 'mock-jwt-token',
          user: { id: 1, email: 'test@example.com', role: 'STUDENT' },
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await authService.login(loginRequest);

      expect(mockedAxios.post).toHaveBeenCalledWith('/auth/login', loginRequest);
      expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith('token', 'mock-jwt-token');
      expect(result).toEqual(mockResponse.data);
    });

    it('debería lanzar error si las credenciales son incorrectas', async () => {
      const loginRequest: LoginRequest = {
        email: 'wrong@example.com',
        password: 'wrongpassword',
      };

      mockedAxios.post.mockRejectedValueOnce(new Error('Unauthorized'));

      await expect(authService.login(loginRequest)).rejects.toThrow('Unauthorized');
      expect(mockedAsyncStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('debería registrar un usuario correctamente', async () => {
      const registerRequest: RegisterRequest = {
        email: 'new@example.com',
        password: 'password123',
        fullName: 'Test User',
        role: 'STUDENT',
      };

      const mockResponse = {
        data: {
          id: 1,
          email: 'new@example.com',
          fullName: 'Test User',
          role: 'STUDENT',
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await authService.register(registerRequest);

      expect(mockedAxios.post).toHaveBeenCalledWith('/auth/register', registerRequest);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('logout', () => {
    it('debería eliminar el token del almacenamiento', async () => {
      await authService.logout();

      expect(mockedAsyncStorage.removeItem).toHaveBeenCalledWith('token');
    });
  });

  describe('getToken', () => {
    it('debería retornar el token almacenado', async () => {
      mockedAsyncStorage.getItem.mockResolvedValueOnce('stored-token');

      const token = await authService.getToken();

      expect(mockedAsyncStorage.getItem).toHaveBeenCalledWith('token');
      expect(token).toBe('stored-token');
    });

    it('debería retornar null si no hay token', async () => {
      mockedAsyncStorage.getItem.mockResolvedValueOnce(null);

      const token = await authService.getToken();

      expect(token).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('debería retornar los datos del usuario actual', async () => {
      const mockUser = {
        data: { id: 1, email: 'test@example.com', role: 'STUDENT', fullName: 'Test User' },
      };

      mockedAxios.get.mockResolvedValueOnce(mockUser);

      const result = await authService.getCurrentUser();

      expect(mockedAxios.get).toHaveBeenCalledWith('/auth/me');
      expect(result).toEqual(mockUser.data);
    });
  });
});
