export type HabitCategory = 'Sport' | 'Détente' | 'Apprentissage'
	| 'Santé' | 'Travail' | 'Social';

export interface Habit {
  id: number;
  name: string;
  description: string;
  category: HabitCategory;
  difficulty: HabitDifficulty;
  user_id: number;
  created_at: string;
  completed_today: number;
  weekData: boolean[];
  streak: number;
  best_streak: number;
}

export interface CategoryConfig {
  name: HabitCategory;
  color: string;
}

export const CATEGORIES: CategoryConfig[] = [
  { name: 'Sport', color: 'bg-blue-500' },
  { name: 'Détente', color: 'bg-purple-500' },
  { name: 'Apprentissage', color: 'bg-orange-500' },
  { name: 'Santé', color: 'bg-green-500' },
  { name: 'Travail', color: 'bg-red-500' },
  { name: 'Social', color: 'bg-pink-500' },
];

export type HabitDifficulty = 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
  value: HabitDifficulty;
  label: string;
  color: string;
  icon: string;
}

export const DIFFICULTY: DifficultyConfig[] = [
  { value: 'easy', label: 'Facile', color: 'bg-green-500', icon: '🟢' },
  { value: 'medium', label: 'Moyen', color: 'bg-yellow-500', icon: '🟡' },
  { value: 'hard', label: 'Difficile', color: 'bg-red-500', icon: '🔴' },
];