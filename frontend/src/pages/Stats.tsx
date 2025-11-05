import { Calendar, TrendingUp, Target, Award, Flame, BarChart3 } from 'lucide-react';
import Header from '../components/Header';
import StatsCard from '../components/StatsCard';
import { useStats } from '../hooks/useStats';

export default function Stats() {
  const { stats, isLoading, error } = useStats();

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

  if (error) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="text-center pt-24 text-red-400">
          {error}
        </div>
      </div>
    );
  }

  const getMotivationMessage = (rate: number): string => {
    if (rate === 0) return '😅 Pas encore commencé !';
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
            title={`Plus longue série en cours : ${stats.longestStreakName || "Inconnue"}`}
            value={
              stats.longestStreak > 0
                ? `${stats.longestStreak} jours`
                : "Aucune série en cours"
            }
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

          {/* Habitude la plus régulière / la moins régulière */}
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

        {/* Résumé de la semaine */}
        <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition">
          <div className='flex justify-between mb-4'>
            <h3 className="text-lg font-semibold text-white">Cette semaine</h3>
            <span className='text-gray-500'>Habitude complétée : {stats.totalCompletedThisWeek}/35</span>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, i) => {
              const dayData = stats.weeklyData?.[i];
              const today = new Date().getDay();
              const adjustedToday = today === 0 ? 6 : today - 1;
              const isToday = i === adjustedToday;

              let bgColor = 'bg-gray-700';
              const completed = dayData?.completed || 0;

              if (completed === 1) bgColor = 'bg-purple-300';
              else if (completed === 2) bgColor = 'bg-purple-400';
              else if (completed === 3) bgColor = 'bg-purple-500';
              else if (completed === 4) bgColor = 'bg-purple-600';
              else if (completed >= 5) bgColor = 'bg-purple-800';

              return (
                <div key={i} className="text-center">
                  <p
                    className={`text-xs mb-2 ${
                      isToday ? 'text-purple-400 font-bold' : 'text-gray-500'
                    }`}
                  >
                    {day}
                  </p>
                  <div
                    className={`w-full aspect-square rounded-lg flex items-center justify-center transition-all duration-300 ${bgColor} ${
                      isToday ? 'ring-2 ring-purple-400' : ''
                    }`}
                  />
                </div>
              );
            })}
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Nombre d'habitudes complétées en moyenne par jour : {stats.averagePerDay}
          </p>
        </div>
      </div>
    </div>
  );
}