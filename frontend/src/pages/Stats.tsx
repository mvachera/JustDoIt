// pages/Stats.tsx
import { Calendar, TrendingUp, Target, Award, Flame, BarChart3 } from 'lucide-react';
import Header from '../components/Header';
import StatsCard from '../components/stats/StatsCard';
import WeekCalendar from '../components/stats/WeekCalendar';
import { useStats } from '../hooks/useStats';

function getMotivationMessage(rate: number): string {
  if (rate === 0) return '😅 Pas encore commencé !';
  if (rate >= 80) return '🔥 Excellent !';
  if (rate >= 60) return '👍 Très bien';
  return '💪 Continue !';
}

export default function Stats() {
  const { stats, isLoading, error } = useStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <Header />
        <div className="text-center pt-24 text-gray-400">
          Chargement...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <Header />
        <div className="text-center pt-24 text-red-400">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <Header />

      <div className="max-w-4xl mx-auto px-4 pt-24 pb-12">
        {/* Header */}
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

          {/* Complétées aujourd'hui */}
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

          {/* Plus longue série */}
          <StatsCard
            icon={TrendingUp}
            title={`Plus longue série en cours : ${stats.longestStreakName || "Inconnue"}`}
            value={stats.longestStreak > 0 ? `${stats.longestStreak} jours` : "Aucune série en cours"}
            color="bg-green-600"
          >
            {stats.longestStreak > 0 ? (
              <div className="flex items-center gap-1 mt-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <p className="text-xs text-gray-500">Record de consécutivité</p>
              </div>
            ) : (
              <p className="text-xs text-gray-500 mt-2">
                Aucune habitude n'a encore de série active.
              </p>
            )}
          </StatsCard>

          {/* Taux de réussite */}
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

          {/* Régularité */}
          <StatsCard
            icon={BarChart3}
            title="Régularité des habitudes de cette semaine"
            value=""
            color="bg-pink-600"
          >
            {stats.bestHabit && stats.worstHabit ? (
              <div className="mt-2 space-y-2">
                <p className="text-sm text-gray-300">
                  <span className="text-green-400 font-semibold">✔️ Tu es le plus constant dans :</span>{' '}
                  <span className="font-medium text-white">{stats.bestHabit.name}</span>{' '}
                  ({stats.bestHabit.rate}%)
                </p>
                <p className="text-sm text-gray-300">
                  <span className="text-red-400 font-semibold">⚠️ À améliorer :</span>{' '}
                  <span className="font-medium text-white">{stats.worstHabit.name}</span>{' '}
                  ({stats.worstHabit.rate}%)
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-2">
                Aucune donnée encore disponible.
              </p>
            )}
          </StatsCard>
        </div>

        {/* Calendrier de la semaine */}
        <WeekCalendar
          weeklyData={stats.weeklyData}
          totalHabits={stats.totalHabits}
          totalCompletedThisWeek={stats.totalCompletedThisWeek}
          averagePerDay={stats.averagePerDay.toString()}
        />
      </div>
    </div>
  );
}