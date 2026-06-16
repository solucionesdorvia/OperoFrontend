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
}

type Listener = () => void;
const listeners = new Set<Listener>();
const notify = () => listeners.forEach((l) => l());

// Genera un ID local único para incidencias pendientes offline usando crypto.
// Usamos una combinación de timestamp y valores aleatorios criptográficamente seguros
// para evitar colisiones en IDs locales temporales.
const genId = (): string => {
  const timestamp = Date.now().toString(36);
  // Generar 8 caracteres aleatorios seguros con crypto.getRandomValues
  const randomBytes = new Uint8Array(6);
  crypto.getRandomValues(randomBytes);
  const randomPart = Array.from(randomBytes)
    .map((b) => b.toString(36))
    .join('')
    .slice(0, 8);
  return `pend_${timestamp}_${randomPart}`;
};

async function readAll(): Promise<PendingIncident[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PendingIncident[]) : [];
  } catch {
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
    const pending: PendingIncident = {
      ...data,
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

    for (const pending of items) {
      try {
        let photoUrl: string | undefined;
        if (pending.imageUris.length > 0) {
          photoUrl = await fileService.uploadImage(pending.imageUris[0]);
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
      } catch {
        failed += 1;
        remaining.push(pending);
      }
    }

    await writeAll(remaining);
    return { uploaded, failed };
  },
};
