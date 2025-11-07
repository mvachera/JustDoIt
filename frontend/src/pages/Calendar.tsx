import Header from '@/components/Header';
import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../utils/api';
import { useHabits } from '../contexts/HabitsContext';

// Types
interface ActivityData {
  [date: string]: {
    [habitId: number]: boolean;
  };
}

type SelectedHabit = 'all' | number;

// Constantes
const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const DAYS_OF_WEEK = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const DEFAULT_COLORS = ['#10b981', '#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];

// Fonctions utilitaires
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

function getColorForHabit(habitId: number, habitsLength: number, habitsArray: any[]): string {
  const index = habitsArray.findIndex(h => h.id === habitId);
  return DEFAULT_COLORS[index % DEFAULT_COLORS.length];
}

export default function Calendar() {
  // ✅ Récupère les habits depuis le context
  const { habits, isLoading: habitsLoading } = useHabits();
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedHabit, setSelectedHabit] = useState<SelectedHabit>('all');
  const [activityData, setActivityData] = useState<ActivityData>({});
  const [isLoadingActivity, setIsLoadingActivity] = useState(true);

  // Fonction pour récupérer seulement les activity data
  async function fetchActivityData() {
    setIsLoadingActivity(true);
    try {
      const start = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-01`;
      const lastDay = new Date(selectedYear, selectedMonth + 1, 0).getDate();
      const end = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

      const response = await fetchWithAuth(`/api/calendar?start=${start}&end=${end}`, {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        setActivityData(data.activityData);
      }
    } catch (error) {
      console.error('Erreur récupération calendrier:', error);
    } finally {
      setIsLoadingActivity(false);
    }
  }

  // Charger les activity data quand le mois change
  useEffect(() => {
    fetchActivityData();
  }, [selectedMonth, selectedYear]);

  function getActivityLevel(date: string): number {
    if (!activityData[date]) return 0;
    
    if (selectedHabit === 'all') {
      const completed = Object.values(activityData[date]).filter(v => v).length;
      return completed;
    } else {
      return activityData[date][selectedHabit] ? 1 : 0;
    }
  }

  function getColorForLevel(level: number): string {
    if (selectedHabit === 'all') {
      if (level === 0) return '#1e293b';
      if (level === 1) return '#334155';
      if (level === 2) return '#475569';
      if (level === 3) return '#64748b';
      if (level === 4) return '#94a3b8';
      return '#cbd5e1';
    } else {
      if (level === 0) return '#1e293b';
      return getColorForHabit(selectedHabit as number, habits.length, habits);
    }
  }

  function navigateMonth(direction: number) {
    let newMonth = selectedMonth + direction;
    let newYear = selectedYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }

    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  }

  // ✅ Affiche le loading si les habits ou l'activité se chargent
  if (habitsLoading || isLoadingActivity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const firstDay = getFirstDayOfMonth(selectedYear, selectedMonth);
  const today = new Date();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Calendrier</h1>
          <p className="text-slate-400">Vue mensuelle de tes habitudes</p>
        </div>

        {/* Filtre par habitude */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-slate-700/50">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedHabit('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedHabit === 'all'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Toutes les habitudes
            </button>
            {habits.map((habit) => {
              const color = getColorForHabit(habit.id, habits.length, habits);
              return (
                <button
                  key={habit.id}
                  onClick={() => setSelectedHabit(habit.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    selectedHabit === habit.id
                      ? 'text-white shadow-lg'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                  }`}
                  style={selectedHabit === habit.id ? {
                    backgroundColor: color,
                    boxShadow: `0 10px 25px ${color}40`
                  } : {}}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  {habit.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation du mois */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold">
              {MONTHS[selectedMonth]} {selectedYear}
            </h2>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Calendrier style GitHub */}
          <div className="space-y-2">
            {/* Jours de la semaine */}
            <div className="grid grid-cols-7 gap-2 mb-3">
              {DAYS_OF_WEEK.map(day => (
                <div key={day} className="text-center text-xs text-slate-500 font-medium">
                  {day}
                </div>
              ))}
            </div>

            {/* Grille des jours */}
            <div className="grid grid-cols-7 gap-2">
              {/* Cases vides pour aligner le premier jour */}
              {[...Array(firstDay)].map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {/* Jours du mois */}
              {[...Array(daysInMonth)].map((_, i) => {
                const day = i + 1;
                const date = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const dateObj = new Date(date);
                const isToday = dateObj.toDateString() === today.toDateString();
                const isFuture = dateObj > today;
                const level = getActivityLevel(date);
                
                return (
                  <div
                    key={day}
                    className={`aspect-square rounded-lg transition-all relative group ${
                      isFuture ? 'opacity-30' : 'hover:scale-110'
                    } ${isToday ? 'ring-2 ring-purple-500' : ''}`}
                    style={{
                      backgroundColor: isFuture ? '#1e293b' : getColorForLevel(level)
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                      {day}
                    </div>
                    
                    {/* Tooltip */}
                    {!isFuture && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                        <div className="bg-slate-900 text-white text-xs rounded-lg py-2 px-3 shadow-xl border border-slate-700 whitespace-nowrap">
                          <div className="font-bold mb-1">{day} {MONTHS[selectedMonth]}</div>
                          {selectedHabit === 'all' ? (
                            <div>{level} habitude{level > 1 ? 's' : ''} complétée{level > 1 ? 's' : ''}</div>
                          ) : (
                            <div>{level ? '✓ Complété' : '✗ Non complété'}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Légende */}
          <div className="mt-6 flex items-center gap-4 text-sm text-slate-400">
            <span>Moins</span>
            <div className="flex gap-1">
              {selectedHabit === 'all' ? (
                <>
                  <div className="w-5 h-5 rounded" style={{ backgroundColor: '#1e293b' }} />
                  <div className="w-5 h-5 rounded" style={{ backgroundColor: '#334155' }} />
                  <div className="w-5 h-5 rounded" style={{ backgroundColor: '#475569' }} />
                  <div className="w-5 h-5 rounded" style={{ backgroundColor: '#64748b' }} />
                  <div className="w-5 h-5 rounded" style={{ backgroundColor: '#94a3b8' }} />
                  <div className="w-5 h-5 rounded" style={{ backgroundColor: '#cbd5e1' }} />
                </>
              ) : (
                <>
                  <div className="w-5 h-5 rounded" style={{ backgroundColor: '#1e293b' }} />
                  <div className="w-5 h-5 rounded" style={{ backgroundColor: getColorForHabit(selectedHabit as number, habits.length, habits) }} />
                </>
              )}
            </div>
            <span>Plus</span>
          </div>
        </div>
      </div>
    </div>
  );
}