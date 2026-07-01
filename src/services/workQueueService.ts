import AsyncStorage from '@react-native-async-storage/async-storage';
import { incidentService } from './incidentService';

type WorkAction = 'START' | 'FINISH';

interface PendingWork {
  incidentId: number;
  action: WorkAction;
  targetStatus: string;
  timestamp: string;
}

const STORAGE_KEY_PREFIX = 'work_queue_';
let currentUserId: number | null = null;

const getStorageKey = () => {
  if (!currentUserId) {
    throw new Error('userId no configurado en workQueueService');
  }
  return `${STORAGE_KEY_PREFIX}${currentUserId}`;
};

const listeners: Array<() => void> = [];

const workQueueService = {
  setUserId(userId: number) {
    currentUserId = userId;
  },

  async add(incidentId: number, action: WorkAction, targetStatus: string): Promise<void> {
    const queue = await this.getAll();

    // Si ya existe una operación para esta incidencia, reemplazarla
    const filtered = queue.filter(item => item.incidentId !== incidentId);

    const newWork: PendingWork = {
      incidentId,
      action,
      targetStatus,
      timestamp: new Date().toISOString(),
    };

    filtered.push(newWork);
    await AsyncStorage.setItem(getStorageKey(), JSON.stringify(filtered));
    this.notifyListeners();
  },

  async getAll(): Promise<PendingWork[]> {
    try {
      const data = await AsyncStorage.getItem(getStorageKey());
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('[workQueueService] Error al leer cola:', error);
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
    const remaining: PendingWork[] = [];

    for (const work of queue) {
      try {
        await incidentService.updateStatus(work.incidentId, work.targetStatus);
        uploaded++;
      } catch (error) {
        console.error(`[workQueueService] Error al subir ${work.action} para incidente ${work.incidentId}:`, error);
        failed++;
        remaining.push(work);
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

export { workQueueService, type PendingWork, type WorkAction };
