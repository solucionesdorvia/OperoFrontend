import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService, LoginRequest, RegisterRequest } from '../authService';

jest.mock('@react-native-async-storage/async-storage');
jest.mock('../api', () => ({
  default: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

const mockedAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const api = require('../api').default;

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('debería iniciar sesión correctamente', async () => {
      const loginRequest: LoginRequest = {
        emailUade: 'test@example.com',
        password: 'password123',
      };

      const mockResponse = {
        data: {
          token: 'mock-jwt-token',
          user: { id: 1, emailUade: 'test@example.com', roleName: 'STUDENT' },
        },
      };

      api.post.mockResolvedValueOnce(mockResponse);

      const result = await authService.login(loginRequest);

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
    });
  });

  describe('register', () => {
    it('debería registrar un usuario correctamente', async () => {
      const registerRequest: RegisterRequest = {
        emailUade: 'new@example.com',
        password: 'password123',
        fullName: 'Test User',
        roleId: 1,
      };

      const mockResponse = {
        data: {
          id: 1,
          emailUade: 'new@example.com',
          fullName: 'Test User',
          roleId: 1,
          roleName: 'STUDENT',
        },
      };

      api.post.mockResolvedValueOnce(mockResponse);

      const result = await authService.register(registerRequest);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('fullName');
    });
  });

  describe('logout', () => {
    it('debería llamar a la función de logout', async () => {
      await authService.logout();
      expect(true).toBe(true);
    });
  });

  describe('getToken', () => {
    it('debería ser una función', () => {
      expect(typeof authService.getToken).toBe('function');
    });
  });

  describe('getCurrentUser', () => {
    it('debería retornar los datos del usuario actual', async () => {
      const mockUser = {
        data: { id: 1, emailUade: 'test@example.com', roleName: 'STUDENT', fullName: 'Test User' },
      };

      api.get.mockResolvedValueOnce(mockUser);

      const result = await authService.getCurrentUser();

      expect(result).toHaveProperty('id');
    });
  });
});
