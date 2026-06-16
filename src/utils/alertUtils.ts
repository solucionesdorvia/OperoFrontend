/**
 * Utilidad para mostrar alertas que funciona en web y móvil
 */

import { Platform, Alert } from 'react-native';

/**
 * Muestra una alerta que funciona tanto en web como en móvil
 * En web usa window.alert(), en móvil usa Alert.alert()
 */
export function showAlert(title: string, message?: string): void {
  if (Platform.OS === 'web') {
    // En web, window.alert solo acepta un string
    const fullMessage = message ? `${title}\n\n${message}` : title;
    window.alert(fullMessage);
  } else {
    // En móvil, usar Alert.alert nativo
    Alert.alert(title, message);
  }
}
