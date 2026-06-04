import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = '@opero_has_seen_onboarding';

export const onboardingService = {
  /**
   * Verifica si el usuario ya vio el onboarding
   */
  async hasSeenOnboarding(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      return value === 'true';
    } catch (error) {
      console.error('[OnboardingService] Error al leer flag:', error);
      // En caso de error, asumimos que NO vio onboarding (UX conservadora)
      return false;
    }
  },

  /**
   * Marca el onboarding como visto
   */
  async markAsCompleted(): Promise<void> {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      console.log('[OnboardingService] Onboarding marcado como completado');
    } catch (error) {
      console.error('[OnboardingService] Error al guardar flag:', error);
      throw error;
    }
  },

  /**
   * Resetear onboarding (útil para testing/debugging)
   */
  async reset(): Promise<void> {
    try {
      await AsyncStorage.removeItem(ONBOARDING_KEY);
      console.log('[OnboardingService] Onboarding reseteado');
    } catch (error) {
      console.error('[OnboardingService] Error al resetear:', error);
      throw error;
    }
  },
};
