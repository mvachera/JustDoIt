import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../utils/api';
import { useHabits } from '../contexts/HabitsContext';

interface ActivityData {
  [date: string]: {
    [habitId: number]: boolean;
  };
}

interface HabitStat {
  completed: number;
  total: number;
  name: string;
  category: string;
}

interface Stats {
  totalDays: number;
  totalPossibleCompletions: number;
  totalCompletions: number;
  habitStats: {
    [habitId: number]: HabitStat;
  };
  bestHabit: {
    id: number;
    name: string;
    category: string;
    percentage: number;
  } | null;
}

export function useCalendar(selectedYear: number, selectedMonth: number) {
  const { habits, isLoading: habitsLoading } = useHabits();
  const [activityData, setActivityData] = useState<ActivityData>({});
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoadingActivity, setIsLoadingActivity] = useState(true);

  async function fetchCalendarData() {
    setIsLoadingActivity(true);
    try {
      const start = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-01`;
      const lastDay = new Date(selectedYear, selectedMonth + 1, 0).getDate();
      const end = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

      const [activityResponse, statsResponse] = await Promise.all([
        fetchWithAuth(`/api/calendar?start=${start}&end=${end}`, { method: 'GET' }),
        fetchWithAuth(`/api/calendar/stats?start=${start}&end=${end}`, { method: 'GET' })
      ]);

      if (activityResponse.ok) {
        const data = await activityResponse.json();
        setActivityData(data.activityData);
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Erreur récupération calendrier:', error);
    } finally {
      setIsLoadingActivity(false);
    }
  }

  useEffect(() => {
    fetchCalendarData();
  }, [selectedMonth, selectedYear]);

  return {
    habits,
    habitsLoading,
    activityData,
    stats,
    isLoadingActivity
  };
}