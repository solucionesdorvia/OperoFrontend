/**
 * AuthContext
 *
 * Contexto global de autenticación que maneja:
 * - Estado del usuario autenticado
 * - Funciones de login, register, logout
 * - Verificación de autenticación al iniciar la app
 * - Persistencia de sesión con AsyncStorage
 */

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { authService, UserResponse } from '../services/authService';
import { useNetwork } from '../hooks/useNetwork';

// Decodificar JWT para extraer datos básicos del usuario sin llamar al backend
function decodeJWT(token: string): { userId: number; email: string; roleId: number; roleName: string } | null {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return {
      userId: decoded.userId,
      email: decoded.sub,
      roleId: decoded.roleId,
      roleName: decoded.roleName,
    };
  } catch {
    return null;
  }
}

/**
 * Tipos de datos
 */

interface AuthContextData {
  // Estado
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Acciones
  login: (email: string, password: string) => Promise<void>;
  register: (
    fullName: string,
    email: string,
    password: string,
    roleId: number,
    departmentId?: number
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

/**
 * Crear el contexto
 */
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

/**
 * Hook personalizado para usar el contexto de autenticación
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

/**
 * AuthProvider Component
 *
 * Envuelve la aplicación para proveer el contexto de autenticación
 */
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isOnline, isVerifying } = useNetwork();

  /**
   * Verificar el estado de autenticación
   */
  const checkAuthStatus = useCallback(async () => {
    try {
      console.log('[AuthContext] Verificando estado de autenticación...');

      const token = await authService.getToken();
      console.log('[AuthContext] Token encontrado:', token ? 'SÍ' : 'NO');

      if (token) {
        // Si hay conexión, validar con el servidor
        if (isOnline && !isVerifying) {
          console.log('[AuthContext] Online - Llamando a /me para verificar token...');
          try {
            const userData = await authService.me();
            setUser(userData);
            console.log('[AuthContext] Usuario autenticado:', userData.emailUade);
          } catch (error: any) {
            // Si es 401, el token es inválido → logout
            if (error.message?.includes('401') || error.message?.includes('autenticado')) {
              console.log('[AuthContext] Token inválido, cerrando sesión');
              setUser(null);
              await authService.logout();
            } else {
              // Error de red u otro → usar datos del token
              console.log('[AuthContext] Error de red, usando datos del token');
              const decoded = decodeJWT(token);
              if (decoded) {
                setUser({
                  id: decoded.userId,
                  emailUade: decoded.email,
                  fullName: 'Usuario', // No lo tenemos en el token
                  roleName: decoded.roleName,
                  roleId: decoded.roleId,
                  departmentId: null,
                  departmentName: null,
                });
              }
            }
          }
        } else {
          // Sin conexión → usar datos del token sin validar
          console.log('[AuthContext] Sin conexión - Usando datos del token guardado');
          const decoded = decodeJWT(token);
          if (decoded) {
            setUser({
              id: decoded.userId,
              emailUade: decoded.email,
              fullName: 'Usuario', // No lo tenemos en el token
              roleName: decoded.roleName,
              roleId: decoded.roleId,
              departmentId: null,
              departmentName: null,
            });
          }
        }
      } else {
        console.log('[AuthContext] No hay sesión activa');
        setUser(null);
      }
    } catch (error) {
      console.error('[AuthContext] Error al verificar autenticación:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [isOnline, isVerifying]);

  /**
   * Verificar si hay una sesión guardada al iniciar la app
   */
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  /**
   * Login
   */
  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('[AuthContext] Iniciando sesión...');

      const response = await authService.login({
        emailUade: email,
        password: password,
      });

      setUser(response.user);
      console.log('[AuthContext] Login exitoso:', response.user.emailUade);
    } catch (error) {
      console.error('[AuthContext] Error en login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Register
   */
  const register = useCallback(async (
    fullName: string,
    email: string,
    password: string,
    roleId: number,
    departmentId?: number
  ) => {
    try {
      setIsLoading(true);
      console.log('[AuthContext] Registrando usuario...');

      const response = await authService.register({
        fullName,
        emailUade: email,
        password,
        roleId,
        departmentId,
      });

      setUser(response.user);
      console.log('[AuthContext] Registro exitoso:', response.user.emailUade);
    } catch (error) {
      console.error('[AuthContext] Error en registro:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout
   */
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('[AuthContext] Cerrando sesión...');

      await authService.logout();
      setUser(null);

      console.log('[AuthContext] Sesión cerrada');
    } catch (error) {
      console.error('[AuthContext] Error en logout:', error);
      // Aunque falle, limpiar el estado local
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Refresh User - Actualizar datos del usuario
   */
  const refreshUser = useCallback(async () => {
    try {
      console.log('[AuthContext] Actualizando datos del usuario...');

      const userData = await authService.me();
      setUser(userData);

      console.log('[AuthContext] Usuario actualizado');
    } catch (error) {
      console.error('[AuthContext] Error al actualizar usuario:', error);
      throw error;
    }
  }, []);

  /**
   * Valor del contexto — memoizado para evitar re-renders innecesarios
   * en todos los consumers del contexto.
   */
  const value: AuthContextData = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, isLoading, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
