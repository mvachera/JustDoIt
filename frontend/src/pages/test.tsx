import Header from '@/components/Header';
import React, { useState } from 'react';

// Types
interface Habit {
  id: number;
  name: string;
  color: string;
  category: string;
}

interface ActivityData {
  [date: string]: {
	[habitId: number]: boolean;
  };
}

interface HabitStat {
  completed: number;
  total: number;
}

interface Stats {
  totalDays: number;
  completedDays: number;
  habitStats: {
	[habitId: number]: HabitStat;
  };
}

type SelectedHabit = 'all' | number;

const Calendar: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedHabit, setSelectedHabit] = useState<SelectedHabit>('all');

  // Données d'exemple - à remplacer par tes vraies données
  const habits: Habit[] = [
	{ id: 1, name: 'Balade', color: '#10b981', category: 'Santé' },
	{ id: 2, name: 'Natation', color: '#3b82f6', category: 'Sport' },
	{ id: 3, name: 'Réfléchir', color: '#ef4444', category: 'Détente' },
	{ id: 4, name: 'Méditation', color: '#f59e0b', category: 'Santé' },
	{ id: 5, name: 'Lecture', color: '#8b5cf6', category: 'Détente' }
  ];

  // Données d'activité d'exemple - remplace par tes vraies données
  // Format: { date: 'YYYY-MM-DD', habitId: number, completed: boolean }
  const activityData: ActivityData = generateMockData(selectedYear, selectedMonth);

  const months: string[] = [
	'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
	'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const daysOfWeek: string[] = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  function generateMockData(year: number, month: number): ActivityData {
	const data: ActivityData = {};
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	
	for (let day = 1; day <= daysInMonth; day++) {
	  const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
	  data[date] = {};
	  
	  habits.forEach(habit => {
		// Génère des données aléatoires pour l'exemple
		data[date][habit.id] = Math.random() > 0.4;
	  });
	}
	
	return data;
  }

  function getDaysInMonth(year: number, month: number): number {
	return new Date(year, month + 1, 0).getDate();
  }

  function getFirstDayOfMonth(year: number, month: number): number {
	const day = new Date(year, month, 1).getDay();
	return day === 0 ? 6 : day - 1; // Ajuste pour commencer lundi
  }

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
	  const habit = habits.find(h => h.id === selectedHabit);
	  if (level === 0) return '#1e293b';
	  return habit ? habit.color : '#10b981';
	}
  }

  function calculateStats(): Stats {
	const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
	let totalDays = 0;
	let completedDays = 0;
	const habitStats: { [habitId: number]: HabitStat } = {};

	habits.forEach(habit => {
	  habitStats[habit.id] = { completed: 0, total: 0 };
	});

	for (let day = 1; day <= daysInMonth; day++) {
	  const date = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
	  const dateObj = new Date(date);
	  
	  if (dateObj <= new Date()) {
		totalDays++;
		let dayCompleted = false;

		habits.forEach(habit => {
		  habitStats[habit.id].total++;
		  if (activityData[date] && activityData[date][habit.id]) {
			habitStats[habit.id].completed++;
			dayCompleted = true;
		  }
		});

		if (selectedHabit === 'all') {
		  const completedCount = Object.values(activityData[date] || {}).filter(v => v).length;
		  if (completedCount > 0) completedDays++;
		} else {
		  if (activityData[date] && activityData[date][selectedHabit as number]) {
			completedDays++;
		  }
		}
	  }
	}

	return { totalDays, completedDays, habitStats };
  }

  const stats: Stats = calculateStats();
  const daysInMonth: number = getDaysInMonth(selectedYear, selectedMonth);
  const firstDay: number = getFirstDayOfMonth(selectedYear, selectedMonth);
  const today: Date = new Date();

  const navigateMonth = (direction: number): void => {
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
  };

  return (
	<div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
	  <Header />
	  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
		{/* Header */}
		<div className="mb-8">
		  <h1 className="text-4xl font-bold mb-2">Calendrier</h1>
		  <p className="text-slate-400">Vue annuelle de tes habitudes</p>
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
			{habits.map(habit => (
			  <button
				key={habit.id}
				onClick={() => setSelectedHabit(habit.id)}
				className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
				  selectedHabit === habit.id
					? 'text-white shadow-lg'
					: 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
				}`}
				style={selectedHabit === habit.id ? {
				  backgroundColor: habit.color,
				  boxShadow: `0 10px 25px ${habit.color}40`
				} : {}}
			  >
				<div
				  className="w-3 h-3 rounded-full"
				  style={{ backgroundColor: habit.color }}
				/>
				{habit.name}
			  </button>
			))}
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
			  {months[selectedMonth]} {selectedYear}
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
			  {daysOfWeek.map(day => (
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
						  <div className="font-bold mb-1">{day} {months[selectedMonth]}</div>
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
				  <div className="w-5 h-5 rounded" style={{ backgroundColor: habits.find(h => h.id === selectedHabit)?.color || '#10b981' }} />
				</>
			  )}
			</div>
			<span>Plus</span>
		  </div>
		</div>

		{/* Statistiques du mois */}
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		  {/* Stats globales */}
		  <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 shadow-xl">
			<div className="flex items-center gap-3 mb-4">
			  <div className="p-3 bg-white/20 rounded-xl">
				<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
			  </div>
			  <h3 className="text-lg font-semibold">Taux de réussite</h3>
			</div>
			<div className="text-4xl font-bold mb-2">
			  {stats.totalDays > 0 ? Math.round((stats.completedDays / stats.totalDays) * 100) : 0}%
			</div>
			<p className="text-purple-100">
			  {stats.completedDays} / {stats.totalDays} jours complétés
			</p>
		  </div>

		  {/* Meilleure habitude */}
		  <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 shadow-xl">
			<div className="flex items-center gap-3 mb-4">
			  <div className="p-3 bg-white/20 rounded-xl">
				<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
				</svg>
			  </div>
			  <h3 className="text-lg font-semibold">Meilleure habitude</h3>
			</div>
			{(() => {
			  const best = Object.entries(stats.habitStats)
				.map(([id, stat]) => ({
				  ...habits.find(h => h.id === parseInt(id)),
				  percentage: stat.total > 0 ? (stat.completed / stat.total) * 100 : 0
				}))
				.sort((a, b) => b.percentage - a.percentage)[0];
			  
			  return best ? (
				<>
				  <div className="text-2xl font-bold mb-2">{best.name}</div>
				  <p className="text-green-100">{Math.round(best.percentage)}% de réussite</p>
				</>
			  ) : (
				<p className="text-green-100">Pas encore de données</p>
			  );
			})()}
		  </div>

		  {/* Total d'habitudes */}
		  <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 shadow-xl">
			<div className="flex items-center gap-3 mb-4">
			  <div className="p-3 bg-white/20 rounded-xl">
				<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
				</svg>
			  </div>
			  <h3 className="text-lg font-semibold">Total complétions</h3>
			</div>
			<div className="text-4xl font-bold mb-2">
			  {Object.values(stats.habitStats).reduce((acc, stat) => acc + stat.completed, 0)}
			</div>
			<p className="text-blue-100">
			  habitudes complétées ce mois
			</p>
		  </div>
		</div>

		{/* Détails par habitude */}
		<div className="mt-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
		  <h3 className="text-xl font-bold mb-6">Détails par habitude</h3>
		  <div className="space-y-4">
			{habits.map(habit => {
			  const stat = stats.habitStats[habit.id];
			  const percentage = stat.total > 0 ? (stat.completed / stat.total) * 100 : 0;
			  
			  return (
				<div key={habit.id} className="space-y-2">
				  <div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
					  <div
						className="w-4 h-4 rounded-full"
						style={{ backgroundColor: habit.color }}
					  />
					  <span className="font-medium">{habit.name}</span>
					  <span className="text-sm text-slate-400">{habit.category}</span>
					</div>
					<div className="flex items-center gap-4">
					  <span className="text-slate-400">
						{stat.completed} / {stat.total}
					  </span>
					  <span className="font-bold">{Math.round(percentage)}%</span>
					</div>
				  </div>
				  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
					<div
					  className="h-full rounded-full transition-all duration-500"
					  style={{
						width: `${percentage}%`,
						backgroundColor: habit.color
					  }}
					/>
				  </div>
				</div>
			  );
			})}
		  </div>
		</div>
	  </div>
	</div>
  );
};

export default Calendar;