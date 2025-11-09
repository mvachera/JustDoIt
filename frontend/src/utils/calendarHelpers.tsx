export const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

export const DAYS_OF_WEEK = ['L', 'Ma', 'Me', 'J', 'V', 'S', 'D'];

export const DEFAULT_COLORS = [
  '#10b981', '#3b82f6', '#ef4444', '#f59e0b', 
  '#8b5cf6', '#ec4899', '#14b8a6'
];

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

export function getColorForHabit(habitId: number, habitsArray: any[]): string {
  const index = habitsArray.findIndex(h => h.id === habitId);
  return DEFAULT_COLORS[index % DEFAULT_COLORS.length];
}

export function getColorForLevel(level: number, selectedHabit: 'all' | number, habits: any[]): string {
  if (selectedHabit === 'all') {
    if (level === 0) return '#1e293b';
    if (level === 1) return '#334155';
    if (level === 2) return '#475569';
    if (level === 3) return '#64748b';
    if (level === 4) return '#94a3b8';
    return '#cbd5e1';
  } else {
    if (level === 0) return '#1e293b';
    return getColorForHabit(selectedHabit as number, habits);
  }
}