// Caché de departamentos y usuarios para modo offline en Manager

import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY_PREFIX = '@opero_team_cache_user_';
const MAX_CACHE_AGE_MS = 24 * 60 * 60 * 1000; // 24 horas

interface TeamCacheData {
  departments: any[];
  users: any[];
  timestamp: number;
}

let currentUserId: number | null = null;

function getCacheKey(): string {
  if (!currentUserId) return '@opero_team_cache';
  return `${CACHE_KEY_PREFIX}${currentUserId}`;
}

export const teamCacheService = {
  setUserId(userId: number | null): void {
    currentUserId = userId;
  },

  async save(departments: any[], users: any[]): Promise<void> {
    try {
      const data: TeamCacheData = {
        departments,
        users,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(getCacheKey(), JSON.stringify(data));
      console.log('[teamCache] Guardados', departments.length, 'deptos y', users.length, 'usuarios');
    } catch (error) {
      console.error('[teamCache] Error al guardar:', error);
    }
  },

  async load(): Promise<{ departments: any[]; users: any[] } | null> {
    try {
      const raw = await AsyncStorage.getItem(getCacheKey());
      if (!raw) return null;

      const data: TeamCacheData = JSON.parse(raw);
      const age = Date.now() - data.timestamp;

      if (age > MAX_CACHE_AGE_MS) {
        console.log('[teamCache] Caché expirada');
        await this.clear();
        return null;
      }

      console.log('[teamCache] Cargados', data.departments.length, 'deptos y', data.users.length, 'usuarios');
      return { departments: data.departments, users: data.users };
    } catch (error) {
      console.error('[teamCache] Error al cargar:', error);
      return null;
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(getCacheKey());
    } catch (error) {
      console.error('[teamCache] Error al limpiar:', error);
    }
  },
};
