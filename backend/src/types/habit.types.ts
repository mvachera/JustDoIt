export interface Habit {
  id: number;
  user_id: number;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  best_streak: number;
  created_at: string;
}

export interface HabitWithWeekData extends Habit {
  completed_today: number;
  weekData: boolean[];
  streak: number;
}

export interface HabitEntry {
  id: number;
  habit_id: number;
  date: string;
  completed: number;
}

export interface CreateHabitDto {
  name: string;
  description?: string;
  category?: string;
  difficulty?: string;
}

export interface UpdateHabitDto {
  name: string;
  description?: string;
  category: string;
  difficulty: string;
}