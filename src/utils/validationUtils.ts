/**
 * Utilidades de validación
 */

/**
 * Validar formato de email
 * Validación simple sin regex para evitar backtracking (Sonar)
 *
 * @param email - Email a validar
 * @returns true si el formato es válido
 */
export function isValidEmail(email: string): boolean {
  // Validación básica: debe contener @ y un punto después del @
  const parts = email.split('@');
  if (parts.length !== 2) return false;

  const [local, domain] = parts;
  if (!local || !domain) return false;
  if (!domain.includes('.')) return false;

  return true;
}
