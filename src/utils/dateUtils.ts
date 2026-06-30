const MS_PER_MINUTE = 60000;
const MS_PER_HOUR = 3600000;
const MS_PER_DAY = 86400000;
const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export const getRelativeTime = (dateString: string): string => {
  if (!dateString) {
    console.warn('[dateUtils] Fecha vacía recibida');
    return 'Fecha desconocida';
  }

  // Parsear la fecha correctamente (el backend envía en formato ISO con zona horaria)
  const pastDate = new Date(dateString);

  // Verificar que la fecha es válida
  if (isNaN(pastDate.getTime())) {
    console.warn('[dateUtils] Fecha inválida:', dateString);
    return 'Fecha inválida';
  }

  const now = new Date();

  // Calcular diferencia en milisegundos
  const diffMs = now.getTime() - pastDate.getTime();

  // Debug: loguear para ver qué está pasando
  console.log('[dateUtils] Input:', dateString, '| Parsed:', pastDate.toISOString(), '| Diff (ms):', diffMs);

  // Si la diferencia es negativa, la fecha es futura (error)
  if (diffMs < 0) {
    console.warn('[dateUtils] Fecha futura detectada:', dateString);
    return 'Hace menos de 1 min';
  }

  const diffMins = Math.floor(diffMs / MS_PER_MINUTE);
  const diffHours = Math.floor(diffMs / MS_PER_HOUR);
  const diffDays = Math.floor(diffMs / MS_PER_DAY);

  if (diffMins < 1) return 'Hace menos de 1 min';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 30) return `Hace ${diffDays} días`;

  // Para fechas muy antiguas, mostrar fecha formateada
  return formatDate(dateString);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getDate()} ${MONTHS[date.getMonth()]}, ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

export const isToday = (dateString: string): boolean =>
  new Date(dateString).toDateString() === new Date().toDateString();
