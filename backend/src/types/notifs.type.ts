export interface WeeklyEmailStats {
  completionRate: number;
  completedDays: number;
  bestStreak: number;
  topHabits: { name: string; completionRate: number }[];
}

export interface MonthlyEmailStats {
  totalHabits: number;
  completionRate: number;
  completedDays: number;
  totalDaysInMonth: number;
  bestStreak: number;
  topHabits: { name: string; completionRate: number }[];
  monthName: string;
  improvementFromLastMonth: number;
}