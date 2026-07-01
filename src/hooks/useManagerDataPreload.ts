/**
 * Hook para precargar todos los datos necesarios para Manager en modo offline
 * Se ejecuta automáticamente cuando el Manager está online
 */

import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNetwork } from './useNetwork';
import { incidentService } from '../services/incidentService';
import { departmentService } from '../services/departmentService';
import { userService } from '../services/userService';
import { incidentCacheService } from '../services/incidentCacheService';
import { teamCacheService } from '../services/teamCacheService';

export const useManagerDataPreload = () => {
  const { user, isAuthenticated } = useAuth();
  const { isOnline } = useNetwork();

  useEffect(() => {
    // Solo precargar si es Manager, está autenticado y online
    if (!isAuthenticated || !user || user.roleName !== 'MANAGER' || !isOnline) {
      return;
    }

    const preloadData = async () => {
      try {
        console.log('[ManagerDataPreload] Iniciando precarga de datos...');

        // Cargar en paralelo todos los datos necesarios
        const [incidents, departments, users] = await Promise.all([
          incidentService.getAll(),
          departmentService.getAll(),
          userService.getAll(),
        ]);

        // Guardar en caché para uso offline
        await incidentCacheService.save(incidents);

        const workers = users.filter(u => u.roleName === 'WORKER');
        await teamCacheService.save(departments, workers);

        console.log('[ManagerDataPreload] Precarga completada:', {
          incidentes: incidents.length,
          departamentos: departments.length,
          trabajadores: workers.length,
        });
      } catch (error) {
        console.error('[ManagerDataPreload] Error en precarga:', error);
        // No mostrar error al usuario, es una operación en background
      }
    };

    // Ejecutar precarga con un pequeño delay para no bloquear la UI
    const timer = setTimeout(preloadData, 1000);
    return () => clearTimeout(timer);
  }, [isAuthenticated, user, isOnline]);
};
