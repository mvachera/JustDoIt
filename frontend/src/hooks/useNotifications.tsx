import { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/utils/api';

export const useNotifications = () => {
  const [dailyReminder, setDailyReminder] = useState(true);
  const [weeklyStats, setWeeklyStats] = useState(true);
  const [monthlyStats, setMonthlyStats] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const response = await fetchWithAuth('/api/notifs');
      const data = await response.json();
      
      setDailyReminder(data.daily_reminder_enabled === 1);
      setWeeklyStats(data.weekly_stats_enabled === 1);
      setMonthlyStats(data.monthly_stats_enabled === 1);
    } catch (error) {
      console.error('Erreur chargement préférences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleNotification = async (type: 'daily' | 'weekly' | 'monthly', newValue: boolean) => {
    try {
      const field = type === 'daily' ? 'daily_reminder_enabled' : `${type}_stats_enabled`;
      
      await fetchWithAuth('/api/notifs', {
        method: 'PUT',
        body: JSON.stringify({
          [field]: newValue ? 1 : 0
        }),
      });
      
      if (type === 'daily') setDailyReminder(newValue);
      if (type === 'weekly') setWeeklyStats(newValue);
      if (type === 'monthly') setMonthlyStats(newValue);
      
    } catch (error) {
      console.error('Erreur mise à jour notification:', error);
    }
  };

  return {
    dailyReminder,
    weeklyStats,
    monthlyStats,
    isLoading,
    toggleNotification
  };
};