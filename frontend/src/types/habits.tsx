export type HabitCategory = 'Sport' | 'Détente' | 'Apprentissage'
	| 'Santé' | 'Travail' | 'Social';

export interface Habit {
  id: number;
  name: string;
  description: string;
  category: HabitCategory;
  user_id: number;
  created_at: string;
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