export interface ActivityData {
  [date: string]: { [habitId: number]: boolean };
}

export interface HabitStats {
  completed: number;
  total: number;
  name: string;
  category: string;
}

export interface CalendarStats {
  totalDays: number;
  totalPossibleCompletions: number;
  totalCompletions: number;
  habitStats: { [habitId: number]: HabitStats };
  bestHabit: {
    id: number;
    name: string;
    category: string;
    percentage: number;
  } | null;
}

export interface DateRange {
  start: string;
  end: string;
}