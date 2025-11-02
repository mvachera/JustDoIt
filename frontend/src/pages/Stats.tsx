import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Target, Award, Flame } from 'lucide-react';
import Header from '../components/Header';
import { fetchWithAuth } from '../utils/api';
import { ComponentType } from 'react';

interface WeeklyDataItem {
  date: string;
  completed: number;
  total: number;
}

interface StatsData {
  totalHabits: number;
  completedToday: number;
  longestStreak: number;
  successRate: number;
  weeklyData: WeeklyDataItem[];
}

interface StatsCardProps {
  icon: ComponentType<any>;
  title: string;
  value: string | number;
  color: string;
  children?: React.ReactNode;
}

function StatsCard({ icon: Icon, title, value, color, children }: StatsCardProps) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {children}
        </div>
        <div className={`p-3 rounded-lg ${color} ml-4`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

export default function Stats() {
  const [stats, setStats] = useState<StatsData>({
    totalHabits: 0,
    completedToday: 0,
    longestStreak: 0,
    successRate: 0,
    weeklyData: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetchWithAuth('/api/stats', { method: 'GET' });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="text-center pt-24 text-gray-400">
          Chargement...
        </div>
      </div>
    );
  }

  const getMotivationMessage = (rate: number) => {
    if (rate >= 80) return '🔥 Excellent !';
    if (rate >= 60) return '👍 Très bien';
    return '💪 Continue !';
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <div className="max-w-4xl mx-auto px-4 pt-24 pb-12">
        {/* Header avec date */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Statistiques 📊</h1>
          <p className="text-gray-400">
            {new Date().toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long' 
            })}
          </p>
        </div>

        {/* Stats cards */}
        <div className="space-y-4">
          {/* Habitudes actives */}
          <StatsCard
            icon={Target}
            title="Habitudes actives"
            value={stats.totalHabits}
            color="bg-purple-600"
          >
            <p className="text-xs text-gray-500 mt-1">Total d'habitudes</p>
          </StatsCard>

          {/* Complétées aujourd'hui avec barre de progression */}
          <StatsCard
            icon={Award}
            title="Complétées aujourd'hui"
            value={`${stats.completedToday}/${stats.totalHabits}`}
            color="bg-blue-600"
          >
            <div className="mt-3 bg-gray-700 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ 
                  width: stats.totalHabits > 0 
                    ? `${(stats.completedToday / stats.totalHabits) * 100}%` 
                    : '0%' 
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.totalHabits > 0 
                ? `${Math.round((stats.completedToday / stats.totalHabits) * 100)}% du jour` 
                : '0% du jour'}
            </p>
          </StatsCard>

          {/* Plus longue série avec flamme */}
          <StatsCard
            icon={TrendingUp}
            title="Plus longue série"
            value={`${stats.longestStreak} jours`}
            color="bg-green-600"
          >
            {stats.longestStreak > 0 && (
              <div className="flex items-center gap-1 mt-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <p className="text-xs text-gray-500">Record de consécutivité</p>
              </div>
            )}
          </StatsCard>

          {/* Taux de réussite avec message motivant */}
          <StatsCard
            icon={Calendar}
            title="Taux de réussite"
            value={`${Math.round(stats.successRate)}%`}
            color="bg-orange-600"
          >
            <p className="text-sm text-gray-300 mt-2">
              {getMotivationMessage(stats.successRate)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Basé sur aujourd'hui</p>
          </StatsCard>
        </div>

        {/* Résumé de la semaine - MODIFIÉ */}
        <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition">
          <h3 className="text-lg font-semibold text-white mb-4">Cette semaine</h3>
          <div className="grid grid-cols-7 gap-2">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, i) => {
              const dayData = stats.weeklyData?.[i];
              const today = new Date().getDay();
              const adjustedToday = today === 0 ? 6 : today - 1;
              const isToday = i === adjustedToday;

              return (
                <div key={i} className="text-center">
                  <p className={`text-xs mb-2 ${isToday ? 'text-purple-400 font-bold' : 'text-gray-500'}`}>
                    {day}
                  </p>
                  <div className={`w-full aspect-square rounded-lg flex items-center justify-center ${
                    dayData && dayData.completed > 0 ? 'bg-purple-600' : 'bg-gray-700'
                  }`}>
                    <span className="text-sm font-bold text-white">
                      {dayData ? `${dayData.completed}/${dayData.total}` : '-'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center">
            Nombre d'habitudes complétées par jour
          </p>
        </div>
      </div>
    </div>
  );
}