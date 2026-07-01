import AsyncStorage from '@react-native-async-storage/async-storage';
import { incidentService } from './incidentService';

interface PendingAssignment {
  incidentId: number;
  workerId: number;
  timestamp: string;
}

const STORAGE_KEY_PREFIX = 'assignment_queue_';
let currentUserId: number | null = null;

const getStorageKey = () => {
  if (!currentUserId) {
    throw new Error('userId no configurado en assignmentQueueService');
  }
  return `${STORAGE_KEY_PREFIX}${currentUserId}`;
};

const listeners: Array<() => void> = [];

const assignmentQueueService = {
  setUserId(userId: number | null) {
    currentUserId = userId;
  },

  async add(incidentId: number, workerId: number): Promise<void> {
    if (!currentUserId) {
      throw new Error('No se puede agregar a la cola de asignaciones sin usuario autenticado');
    }
    const queue = await this.getAll();

    // Si ya existe una asignación para esta incidencia, reemplazarla
    const filtered = queue.filter(item => item.incidentId !== incidentId);

    const newAssignment: PendingAssignment = {
      incidentId,
      workerId,
      timestamp: new Date().toISOString(),
    };

    filtered.push(newAssignment);
    await AsyncStorage.setItem(getStorageKey(), JSON.stringify(filtered));
    this.notifyListeners();
  },

  async getAll(): Promise<PendingAssignment[]> {
    if (!currentUserId) {
      console.warn('[assignmentQueueService] getAll llamado sin userId, retornando array vacío');
      return [];
    }
    try {
      const data = await AsyncStorage.getItem(getStorageKey());
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('[assignmentQueueService] Error al leer cola:', error);
      return [];
    }
  },

  async remove(incidentId: number): Promise<void> {
    const queue = await this.getAll();
    const filtered = queue.filter(item => item.incidentId !== incidentId);
    await AsyncStorage.setItem(getStorageKey(), JSON.stringify(filtered));
    this.notifyListeners();
  },

  async clear(): Promise<void> {
    if (!currentUserId) return;
    await AsyncStorage.removeItem(getStorageKey());
    this.notifyListeners();
  },

  async flush(): Promise<{ uploaded: number; failed: number }> {
    const queue = await this.getAll();
    if (queue.length === 0) {
      return { uploaded: 0, failed: 0 };
    }

    let uploaded = 0;
    let failed = 0;
    const remaining: PendingAssignment[] = [];

    for (const assignment of queue) {
      try {
        await incidentService.assignWorker(assignment.incidentId, assignment.workerId);
        uploaded++;
      } catch (error) {
        console.error(`[assignmentQueueService] Error al asignar incidente ${assignment.incidentId}:`, error);
        failed++;
        remaining.push(assignment);
      }
    }

    await AsyncStorage.setItem(getStorageKey(), JSON.stringify(remaining));
    this.notifyListeners();

    return { uploaded, failed };
  },

  subscribe(callback: () => void): () => void {
    listeners.push(callback);
    return () => {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  },

  notifyListeners() {
    listeners.forEach(callback => callback());
  },
};

export { assignmentQueueService, type PendingAssignment };
