const MS_PER_MINUTE = 60000;
const MS_PER_HOUR = 3600000;
const MS_PER_DAY = 86400000;
const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export const getRelativeTime = (dateString: string): string => {
  if (!dateString) {
    console.warn('[dateUtils] Fecha vacía recibida');
    return 'Fecha desconocida';
  }

  // El backend envía fechas en hora local de Argentina (UTC-3) sin zona horaria explícita.
  // Por ejemplo: "2026-07-01T02:30:11.15332"
  // Debemos parsearlas como UTC-3, no como UTC.

  // Si la fecha NO tiene 'Z' al final ni offset (+/-), agregar el offset de Argentina
  let dateToProcess = dateString;
  if (!dateString.endsWith('Z') && !dateString.includes('+') && !dateString.includes('-', 10)) {
    // Agregar offset de Argentina (UTC-3): "-03:00"
    dateToProcess = dateString + '-03:00';
  }

  const pastDate = new Date(dateToProcess);

  // Verificar que la fecha es válida
  if (isNaN(pastDate.getTime())) {
    console.warn('[dateUtils] Fecha inválida:', dateString);
    return 'Fecha inválida';
  }

  const now = new Date();

  // Calcular diferencia en milisegundos
  const diffMs = now.getTime() - pastDate.getTime();

  // Si la diferencia es negativa, la fecha es futura (error del servidor o reloj)
  if (diffMs < 0) {
    console.warn('[dateUtils] Fecha futura detectada:', dateString, '| Diff:', diffMs);
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
  // Aplicar el mismo fix de timezone que en getRelativeTime
  let dateToProcess = dateString;
  if (!dateString.endsWith('Z') && !dateString.includes('+') && !dateString.includes('-', 10)) {
    dateToProcess = dateString + '-03:00';
  }

  const date = new Date(dateToProcess);
  return `${date.getDate()} ${MONTHS[date.getMonth()]}, ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

export const isToday = (dateString: string): boolean => {
  // Aplicar el mismo fix de timezone que en getRelativeTime
  let dateToProcess = dateString;
  if (!dateString.endsWith('Z') && !dateString.includes('+') && !dateString.includes('-', 10)) {
    dateToProcess = dateString + '-03:00';
  }

  return new Date(dateToProcess).toDateString() === new Date().toDateString();
};
