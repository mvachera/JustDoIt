import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../utils/api';

interface WeeklyDataItem {
  date: string;
  completed: number;
  total: number;
}

export interface StatsData {
  totalHabits: number;
  completedToday: number;
  totalCompletedThisWeek: number;
  averagePerDay: number;
  longestStreak: number;
  longestStreakName: string;
  successRate: number;
  weeklyData: WeeklyDataItem[];
  bestHabit?: { name: string; rate: number };
  worstHabit?: { name: string; rate: number };
}

export function useStats() {
  const [stats, setStats] = useState<StatsData>({
    totalHabits: 0,
    completedToday: 0,
    totalCompletedThisWeek: 0,
    averagePerDay: 0,
    longestStreak: 0,
    longestStreakName: "",
    successRate: 0,
    weeklyData: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetchWithAuth('/api/stats', { method: 'GET' });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          setError('Erreur lors du chargement des statistiques');
        }
      } catch (error) {
        console.error('Erreur:', error);
        setError('Erreur lors du chargement des statistiques');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, isLoading, error };
}