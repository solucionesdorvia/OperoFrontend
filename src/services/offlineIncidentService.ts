// Servicio de incidencias locales + cola offline.
//
// Mientras el backend define su contrato final, el almacenamiento local
// (AsyncStorage) es la fuente de verdad para los reportes creados desde la app:
// guarda título, descripción, ubicación, departamento y las imágenes adjuntas
// (base64), de modo que las imágenes "quedan en el incidente" aunque no haya red.
//
// Cada reporte lleva un `syncStatus`:
//   - 'pending'  -> creado sin conexión (o subida fallida), esperando subirse.
//   - 'uploaded' -> confirmado por el backend.
//   - 'error'    -> intento de subida falló; sigue disponible para reintentar.
//
// `flushPending()` intenta subir los pendientes vía `incidentService.create`.
// El seam con el backend es ese único punto: cuando la API esté lista, no hay
// que tocar el resto del flujo.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { incidentService, IncidentRequest } from './incidentService';

const STORAGE_KEY = '@opero_local_incidents';

export type LocalSyncStatus = 'pending' | 'uploaded' | 'error';

export interface LocalIncident {
  localId: string;
  title: string;
  description: string;
  location?: string;
  department?: string;
  // Id de departamento para el backend. Placeholder hasta cerrar el contrato.
  departmentId: number;
  // Data URIs base64 de las imágenes adjuntas.
  images: string[];
  // Estado visible en la UI (ej. 'PENDIENTE', 'ABIERTO').
  status: string;
  createdAt: string;
  syncStatus: LocalSyncStatus;
  // Id devuelto por el backend una vez subido.
  serverId?: number;
}

export interface NewLocalIncident {
  title: string;
  description: string;
  location?: string;
  department?: string;
  departmentId: number;
  images: string[];
  status?: string;
}

const genId = (): string =>
  `loc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

async function readAll(): Promise<LocalIncident[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LocalIncident[]) : [];
  } catch {
    return [];
  }
}

async function writeAll(items: LocalIncident[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function toRequest(incident: LocalIncident): IncidentRequest {
  return {
    title: incident.title,
    description: incident.description,
    departmentId: incident.departmentId,
    location: incident.location,
    images: incident.images,
  };
}

export interface FlushResult {
  uploaded: number;
  failed: number;
}

export const offlineIncidentService = {
  /** Todos los reportes locales, del más nuevo al más viejo. */
  async getAll(): Promise<LocalIncident[]> {
    const items = await readAll();
    return [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  /** Reportes que todavía no se confirmaron en el backend. */
  async getPending(): Promise<LocalIncident[]> {
    const items = await readAll();
    return items.filter((i) => i.syncStatus !== 'uploaded');
  },

  async countPending(): Promise<number> {
    return (await offlineIncidentService.getPending()).length;
  },

  /** Persiste un nuevo reporte local. `synced` marca si ya se confirmó arriba. */
  async save(data: NewLocalIncident, synced = false): Promise<LocalIncident> {
    const items = await readAll();
    const incident: LocalIncident = {
      localId: genId(),
      title: data.title,
      description: data.description,
      location: data.location,
      department: data.department,
      departmentId: data.departmentId,
      images: data.images ?? [],
      status: data.status ?? 'PENDIENTE',
      createdAt: new Date().toISOString(),
      syncStatus: synced ? 'uploaded' : 'pending',
    };
    items.push(incident);
    await writeAll(items);
    return incident;
  },

  async update(localId: string, patch: Partial<LocalIncident>): Promise<void> {
    const items = await readAll();
    const next = items.map((i) => (i.localId === localId ? { ...i, ...patch } : i));
    await writeAll(next);
  },

  async remove(localId: string): Promise<void> {
    const items = await readAll();
    await writeAll(items.filter((i) => i.localId !== localId));
  },

  /**
   * Intenta subir todos los pendientes al backend.
   * No lanza: marca cada reporte como 'uploaded' o 'error' y devuelve el resumen.
   */
  async flushPending(): Promise<FlushResult> {
    const items = await readAll();
    let uploaded = 0;
    let failed = 0;

    const next = await Promise.all(
      items.map(async (incident) => {
        if (incident.syncStatus === 'uploaded') return incident;
        try {
          const created = await incidentService.create(toRequest(incident));
          uploaded += 1;
          return { ...incident, syncStatus: 'uploaded' as const, serverId: created.id };
        } catch {
          failed += 1;
          return { ...incident, syncStatus: 'error' as const };
        }
      }),
    );

    await writeAll(next);
    return { uploaded, failed };
  },
};
