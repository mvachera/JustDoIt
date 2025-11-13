export interface WeeklyData {
  date: string;
  completed: number;
  total: number;
}

export interface HabitRate {
  name: string;
  rate: number;
}

export interface Stats {
  totalHabits: number;
  completedToday: number;
  totalCompletedThisWeek: number;
  averagePerDay: string;
  longestStreak: number;
  longestStreakName: string;
  successRate: number;
  weeklyData: WeeklyData[];
  bestHabit: HabitRate | null;
  worstHabit: HabitRate | null;
}