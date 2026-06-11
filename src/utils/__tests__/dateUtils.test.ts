import { getRelativeTime, formatDate, isToday } from '../dateUtils';

describe('dateUtils', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-06-11T10:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('getRelativeTime', () => {
    it('debería retornar "Hace menos de 1 min" para fechas muy recientes', () => {
      const now = new Date();
      const result = getRelativeTime(now.toISOString());
      expect(result).toBe('Hace menos de 1 min');
    });

    it('debería retornar minutos para fechas de hace menos de una hora', () => {
      const date = new Date(Date.now() - 30 * 60000);
      const result = getRelativeTime(date.toISOString());
      expect(result).toBe('Hace 30 min');
    });

    it('debería retornar horas para fechas de hace menos de un día', () => {
      const date = new Date(Date.now() - 5 * 3600000);
      const result = getRelativeTime(date.toISOString());
      expect(result).toBe('Hace 5h');
    });

    it('debería retornar "Ayer" para fechas de hace 1 día', () => {
      const date = new Date(Date.now() - 86400000);
      const result = getRelativeTime(date.toISOString());
      expect(result).toBe('Ayer');
    });

    it('debería retornar días para fechas de hace más de 1 día', () => {
      const date = new Date(Date.now() - 3 * 86400000);
      const result = getRelativeTime(date.toISOString());
      expect(result).toBe('Hace 3 días');
    });
  });

  describe('formatDate', () => {
    it('debería formatear correctamente una fecha', () => {
      const date = new Date('2026-03-15T14:30:00Z');
      const result = formatDate(date.toISOString());
      expect(result).toMatch(/15 Mar, \d{2}:\d{2}/);
    });

    it('debería incluir ceros a la izquierda en horas y minutos', () => {
      const date = new Date('2026-03-15T09:05:00Z');
      const result = formatDate(date.toISOString());
      expect(result).toMatch(/15 Mar, \d{2}:0\d/);
    });
  });

  describe('isToday', () => {
    it('debería retornar true para la fecha de hoy', () => {
      const today = new Date();
      const result = isToday(today.toISOString());
      expect(result).toBe(true);
    });

    it('debería retornar false para una fecha de ayer', () => {
      const yesterday = new Date(Date.now() - 86400000);
      const result = isToday(yesterday.toISOString());
      expect(result).toBe(false);
    });

    it('debería retornar false para una fecha de mañana', () => {
      const tomorrow = new Date(Date.now() + 86400000);
      const result = isToday(tomorrow.toISOString());
      expect(result).toBe(false);
    });
  });
});
