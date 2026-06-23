import { useEffect, useState } from 'react';
import { onboardingService } from '../services/onboardingService';
import { useAuth } from '../context/AuthContext';

type RouteState = {
  routeName: 'Onboarding' | 'Login' | 'StudentTabs' | 'ManagerTabs' | 'MaintenanceTabs';
  isReady: boolean;
};

/**
 * Hook que determina la pantalla inicial según:
 * 1. Si el usuario está autenticado
 * 2. Si ya vio el onboarding
 * 3. El rol del usuario autenticado
 */
export function useInitialRoute(): RouteState {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [onboardingChecked, setOnboardingChecked] = useState(false);

  // Verificar flag de onboarding al montar
  useEffect(() => {
    const checkOnboarding = async () => {
      const seen = await onboardingService.hasSeenOnboarding();
      setHasSeenOnboarding(seen);
      setOnboardingChecked(true);
    };
    checkOnboarding();
  }, []);

  // Esperar a que AuthContext Y onboarding estén listos
  const isReady = !authLoading && onboardingChecked;

  // Determinar ruta inicial
  let routeName: RouteState['routeName'] = 'Onboarding';

  if (isReady) {
    console.log('[useInitialRoute] Determinando ruta:', { isAuthenticated, hasUser: !!user, userRole: user?.roleName });

    if (isAuthenticated && user) {
      // Usuario autenticado → ir a tabs según rol
      console.log('[useInitialRoute] Usuario autenticado, rol:', user.roleName);
      switch (user.roleName) {
        case 'USER':
          routeName = 'StudentTabs';
          break;
        case 'MANAGER':
          routeName = 'ManagerTabs';
          break;
        case 'WORKER':
          routeName = 'MaintenanceTabs';
          break;
        default:
          console.warn('[useInitialRoute] Rol desconocido:', user.roleName);
          routeName = 'Login';
      }
      console.log('[useInitialRoute] Ruta determinada:', routeName);
    } else if (hasSeenOnboarding) {
      // No autenticado pero ya vio onboarding → Login
      console.log('[useInitialRoute] No autenticado, redirigiendo a Login');
      routeName = 'Login';
    } else {
      // No autenticado y nunca vio onboarding → Onboarding
      console.log('[useInitialRoute] No autenticado, redirigiendo a Onboarding');
      routeName = 'Onboarding';
    }
  }

  console.log('[useInitialRoute] Ruta final:', routeName, 'isReady:', isReady);
  return { routeName, isReady };
}
