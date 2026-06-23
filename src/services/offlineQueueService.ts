// Cola de incidencias pendientes de subir (modo sin conexión).
//
// Cuando el usuario crea un reporte sin internet, se guarda acá (AsyncStorage)
// con los datos del incidente y las URIs locales de las imágenes adjuntas.
// Al recuperar la conexión, OfflineSyncManager llama a flush(), que para cada
// pendiente sube la imagen (fileService) y crea el incidente (incidentService),
// reutilizando exactamente el mismo flujo que el alta online.
//
// Expone un subscribe() simple para que la UI (banner / contador) se entere
// cuando cambia la cantidad de pendientes.

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import { incidentService } from './incidentService';
import { fileService } from './fileService';

const STORAGE_KEY = '@opero_pending_incidents';

export interface PendingIncident {
  localId: string;
  title: string;
  description: string;
  departmentId: number;
  departmentName?: string;
  locationDescription?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  // URIs locales (file://) de las imágenes adjuntas, pendientes de subir.
  imageUris: string[];
  createdAt: string;
}

export type NewPendingIncident = Omit<PendingIncident, 'localId' | 'createdAt'>;

export interface FlushResult {
  uploaded: number;
  failed: number;
  lastError?: string;
}

type Listener = () => void;
const listeners = new Set<Listener>();
const notify = () => listeners.forEach((l) => l());

// Genera un ID local único para incidencias pendientes offline.
// No usamos crypto.getRandomValues porque Hermes en React Native no expone el
// objeto crypto globalmente y rompe el bundle con "property crypto doesn't exist".
// El ID es solo interno para la cola; no necesita ser seguro criptográficamente.
const genId = (): string => {
  const timestamp = Date.now().toString(36);
  const rand1 = Math.random().toString(36).slice(2, 8);
  const rand2 = Math.random().toString(36).slice(2, 6);
  return `pend_${timestamp}_${rand1}${rand2}`;
};

// Copia las imágenes elegidas a un directorio persistente de la app, para que
// sus URIs sigan siendo válidas al reconectar (las del picker/cámara viven en
// caché y pueden desaparecer). Si la copia falla, se deja la URI original.
async function persistImages(uris: string[]): Promise<string[]> {
  const dir = FileSystem.documentDirectory;
  if (!dir || uris.length === 0) return uris;

  const out: string[] = [];
  for (let i = 0; i < uris.length; i++) {
    const uri = uris[i];
    try {
      const match = uri.split('?')[0].match(/\.(jpg|jpeg|png|gif|webp)$/i);
      const ext = match ? match[0] : '.jpg';
      const dest = `${dir}offline_${Date.now().toString(36)}_${i}${ext}`;
      await FileSystem.copyAsync({ from: uri, to: dest });
      out.push(dest);
    } catch (e) {
      console.warn('[offlineQueue] no se pudo persistir la imagen, uso la uri original', e);
      out.push(uri);
    }
  }
  return out;
}

async function readAll(): Promise<PendingIncident[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Validar y limpiar items corruptos o muy antiguos (>7 días)
    const now = Date.now();
    const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 días

    const valid = (parsed as PendingIncident[]).filter(item => {
      // Validar que tenga los campos requeridos
      if (!item.localId || !item.title || !item.departmentId) {
        console.warn('[offlineQueue] Item corrupto detectado, se descarta:', item);
        return false;
      }

      // Limpiar items muy antiguos
      const age = now - new Date(item.createdAt).getTime();
      if (age > MAX_AGE_MS) {
        console.warn('[offlineQueue] Item muy antiguo detectado (>7 días), se descarta:', item.localId);
        return false;
      }

      return true;
    });

    // Si se limpiaron items, guardar la cola actualizada
    if (valid.length !== parsed.length) {
      console.log(`[offlineQueue] Se limpiaron ${parsed.length - valid.length} items`);
      await writeAll(valid);
    }

    return valid;
  } catch (err) {
    console.error('[offlineQueue] Error al leer cola:', err);
    return [];
  }
}

async function writeAll(items: PendingIncident[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  notify();
}

export const offlineQueueService = {
  /** Notifica cuando cambia la cola. Devuelve la función para desuscribirse. */
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  async getAll(): Promise<PendingIncident[]> {
    return readAll();
  },

  async count(): Promise<number> {
    return (await readAll()).length;
  },

  /** Agrega un reporte a la cola de pendientes. */
  async enqueue(data: NewPendingIncident): Promise<PendingIncident> {
    const items = await readAll();
    // Persistimos las imágenes para que sobrevivan hasta la reconexión.
    const imageUris = await persistImages(data.imageUris ?? []);
    const pending: PendingIncident = {
      ...data,
      imageUris,
      localId: genId(),
      createdAt: new Date().toISOString(),
    };
    items.push(pending);
    await writeAll(items);
    return pending;
  },

  async remove(localId: string): Promise<void> {
    const items = await readAll();
    await writeAll(items.filter((i) => i.localId !== localId));
  },

  /** Limpia TODA la cola (usar solo para debug/testing). */
  async clear(): Promise<void> {
    console.log('[offlineQueue] LIMPIANDO toda la cola');
    await AsyncStorage.removeItem(STORAGE_KEY);
    notify();
  },

  /** Debug: muestra el contenido actual de la cola en consola. */
  async debug(): Promise<void> {
    const items = await readAll();
    console.log('[offlineQueue] DEBUG - Items en cola:', items.length);
    items.forEach((item, i) => {
      console.log(`  [${i}]`, {
        localId: item.localId,
        title: item.title,
        createdAt: item.createdAt,
        age: `${Math.round((Date.now() - new Date(item.createdAt).getTime()) / 1000 / 60)} min`,
      });
    });
  },

  /**
   * Intenta subir todos los pendientes al backend.
   * Para cada uno: sube la primera imagen (si hay) y crea el incidente.
   * No lanza: deja en la cola los que fallen y devuelve el resumen.
   */
  async flush(): Promise<FlushResult> {
    const items = await readAll();
    if (items.length === 0) return { uploaded: 0, failed: 0 };

    const remaining: PendingIncident[] = [];
    let uploaded = 0;
    let failed = 0;
    let lastError: string | undefined;

    for (const pending of items) {
      try {
        // La imagen es "best-effort": si falla subirla (uri perdida, etc.),
        // igual creamos la incidencia sin foto en vez de perder todo el reporte.
        let photoUrl: string | undefined;
        if (pending.imageUris.length > 0) {
          try {
            photoUrl = await fileService.uploadImage(pending.imageUris[0]);
          } catch (imgErr) {
            console.warn('[offlineQueue] no se pudo subir la imagen, creo sin foto:', imgErr);
          }
        }

        await incidentService.create({
          title: pending.title,
          description: pending.description,
          departmentId: pending.departmentId,
          locationDescription: pending.locationDescription,
          priority: pending.priority,
          photoUrl,
        });
        uploaded += 1;

        // Limpiamos las imágenes persistidas ya subidas.
        for (const uri of pending.imageUris) {
          FileSystem.deleteAsync(uri, { idempotent: true }).catch(() => {});
        }
      } catch (err) {
        console.warn('[offlineQueue] falló crear la incidencia, queda en cola:', err);
        lastError = (err as Error)?.message || String(err);
        failed += 1;
        remaining.push(pending);
      }
    }

    await writeAll(remaining);
    return { uploaded, failed, lastError };
  },
};

// Exponer globalmente para debug desde consola del navegador
if (typeof window !== 'undefined') {
  (window as any).__operoOfflineQueue = {
    debug: () => offlineQueueService.debug(),
    clear: () => offlineQueueService.clear(),
    getAll: () => offlineQueueService.getAll(),
  };
  console.log('[offlineQueue] Debug tools disponibles: window.__operoOfflineQueue.debug() / .clear() / .getAll()');
}
