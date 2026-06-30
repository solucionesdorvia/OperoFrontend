// Caché de incidencias para uso offline.
// Guarda las últimas incidencias cargadas para que el usuario las vea sin conexión.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { IncidentResponse } from './incidentService';

const CACHE_KEY_PREFIX = '@opero_incidents_cache_user_';
const MAX_CACHE_AGE_MS = 24 * 60 * 60 * 1000; // 24 horas

interface CacheData {
  incidents: IncidentResponse[];
  timestamp: number;
}

let currentUserId: number | null = null;

function getCacheKey(): string {
  if (!currentUserId) return '@opero_incidents_cache';
  return `${CACHE_KEY_PREFIX}${currentUserId}`;
}

export const incidentCacheService = {
  setUserId(userId: number | null): void {
    currentUserId = userId;
  },

  async save(incidents: IncidentResponse[]): Promise<void> {
    try {
      const data: CacheData = {
        incidents,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(getCacheKey(), JSON.stringify(data));
      console.log('[incidentCache] Guardadas', incidents.length, 'incidencias');
    } catch (error) {
      console.error('[incidentCache] Error al guardar:', error);
    }
  },

  async load(): Promise<IncidentResponse[] | null> {
    try {
      const raw = await AsyncStorage.getItem(getCacheKey());
      if (!raw) return null;

      const data: CacheData = JSON.parse(raw);
      const age = Date.now() - data.timestamp;

      // Si la caché es muy antigua, descartarla
      if (age > MAX_CACHE_AGE_MS) {
        console.log('[incidentCache] Caché expirada, descartando');
        await this.clear();
        return null;
      }

      console.log('[incidentCache] Cargadas', data.incidents.length, 'incidencias del caché');
      return data.incidents;
    } catch (error) {
      console.error('[incidentCache] Error al cargar:', error);
      return null;
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(getCacheKey());
      console.log('[incidentCache] Caché limpiada');
    } catch (error) {
      console.error('[incidentCache] Error al limpiar:', error);
    }
  },
};
