const MS_PER_MINUTE = 60000;
const MS_PER_HOUR = 3600000;
const MS_PER_DAY = 86400000;
const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export const getRelativeTime = (dateString: string): string => {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMins = Math.floor(diffMs / MS_PER_MINUTE);
  const diffHours = Math.floor(diffMs / MS_PER_HOUR);
  const diffDays = Math.floor(diffMs / MS_PER_DAY);

  if (diffMins < 1) return 'Hace menos de 1 min';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffDays === 1) return 'Ayer';
  return `Hace ${diffDays} días`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getDate()} ${MONTHS[date.getMonth()]}, ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

export const isToday = (dateString: string): boolean =>
  new Date(dateString).toDateString() === new Date().toDateString();
