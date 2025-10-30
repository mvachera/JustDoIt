import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Target, Award } from 'lucide-react';
import Header from '../components/Header';
import { fetchWithAuth } from '../utils/api';
import { ComponentType } from 'react';

interface StatsCardProps {
  icon: ComponentType<any>;
  title: string;
  value: string | number;
  color: string;
}

function StatsCard({ icon: Icon, title, value, color }: StatsCardProps) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

export default function Stats() {
  const [stats, setStats] = useState({
    totalHabits: 0,
    completedToday: 0,
    longestStreak: 0,
    successRate: 0,
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

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="flex flex-col space-y-8 pt-24 pb-12 mx-4">
        <StatsCard
          icon={Target}
          title="Habitudes actives"
          value={stats.totalHabits}
          color="bg-purple-600"
        />
        <StatsCard
          icon={Award}
          title="Complétées aujourd'hui"
          value={`${stats.completedToday}/${stats.totalHabits}`}
          color="bg-blue-600"
        />
        <StatsCard
          icon={TrendingUp}
          title="Plus longue série"
          value={`${stats.longestStreak} jours`}
          color="bg-green-600"
        />
        <StatsCard
          icon={Calendar}
          title="Taux de réussite"
          value={`${Math.round(stats.successRate)}%`}
          color="bg-orange-600"
        />
      </div>
    </div>
  );
}