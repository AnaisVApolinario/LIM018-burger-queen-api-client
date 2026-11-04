import { formatMinutes, minutesBetween } from './time';

describe('time helpers', () => {
  it('calcula minutos completos entre dos instantes', () => {
    expect(minutesBetween('2026-10-12T12:00:00Z', '2026-10-12T12:07:59Z')).toBe(7);
  });

  it('acepta timestamps numéricos', () => {
    const start = new Date('2026-10-12T12:00:00Z').getTime();
    expect(minutesBetween(start, start + 5 * 60000)).toBe(5);
  });

  it('nunca devuelve negativos', () => {
    expect(minutesBetween('2026-10-12T12:10:00Z', '2026-10-12T12:00:00Z')).toBe(0);
  });

  it('formatea minutos y horas', () => {
    expect(formatMinutes(0)).toBe('0 min');
    expect(formatMinutes(59)).toBe('59 min');
    expect(formatMinutes(60)).toBe('1 h');
    expect(formatMinutes(75)).toBe('1 h 15 min');
  });
});