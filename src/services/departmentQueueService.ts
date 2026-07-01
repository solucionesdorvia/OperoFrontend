import AsyncStorage from '@react-native-async-storage/async-storage';
import { departmentService } from './departmentService';

interface PendingDepartment {
  name: string;
  timestamp: string;
  tempId: string; // ID temporal para identificar en la UI
}

const STORAGE_KEY_PREFIX = 'department_queue_';
let currentUserId: number | null = null;

const getStorageKey = () => {
  if (!currentUserId) {
    throw new Error('userId no configurado en departmentQueueService');
  }
  return `${STORAGE_KEY_PREFIX}${currentUserId}`;
};

const listeners: Array<() => void> = [];

const departmentQueueService = {
  setUserId(userId: number | null) {
    currentUserId = userId;
  },

  async add(name: string): Promise<string> {
    if (!currentUserId) {
      throw new Error('No se puede agregar a la cola de departamentos sin usuario autenticado');
    }
    const queue = await this.getAll();
    const tempId = `temp_${Date.now()}`;

    const newDept: PendingDepartment = {
      name,
      timestamp: new Date().toISOString(),
      tempId,
    };

    queue.push(newDept);
    await AsyncStorage.setItem(getStorageKey(), JSON.stringify(queue));
    this.notifyListeners();
    return tempId;
  },

  async getAll(): Promise<PendingDepartment[]> {
    if (!currentUserId) {
      console.warn('[departmentQueueService] getAll llamado sin userId, retornando array vacío');
      return [];
    }
    try {
      const data = await AsyncStorage.getItem(getStorageKey());
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('[departmentQueueService] Error al leer cola:', error);
      return [];
    }
  },

  async remove(tempId: string): Promise<void> {
    const queue = await this.getAll();
    const filtered = queue.filter(item => item.tempId !== tempId);
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
    const remaining: PendingDepartment[] = [];

    for (const dept of queue) {
      try {
        await departmentService.create({ name: dept.name });
        uploaded++;
      } catch (error) {
        console.error(`[departmentQueueService] Error al crear departamento "${dept.name}":`, error);
        failed++;
        remaining.push(dept);
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

export { departmentQueueService, type PendingDepartment };
