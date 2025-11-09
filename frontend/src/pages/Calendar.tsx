// pages/Calendar.tsx
import { useState } from 'react';
import Header from '@/components/Header';
import { useCalendar } from '../hooks/useCalendar';
import { getDaysInMonth, getFirstDayOfMonth, getColorForLevel } from '../utils/calendarHelpers';
import HabitFilters from '../components/calendar/HabitFilters';
import MonthNavigation from '../components/calendar/MonthNavigation';
import CalendarGrid from '../components/calendar/CalendarGrid';
import CalendarLegend from '../components/calendar/CalendarLegend';
import MonthStats from '../components/calendar/MonthStats';
import HabitDetails from '../components/calendar/HabitDetails';

type SelectedHabit = 'all' | number;

export default function Calendar() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedHabit, setSelectedHabit] = useState<SelectedHabit>('all');

  const { habits, habitsLoading, activityData, stats, isLoadingActivity } = useCalendar(
    selectedYear,
    selectedMonth
  );

  function getActivityLevel(date: string): number {
    if (!activityData[date]) return 0;
    
    if (selectedHabit === 'all') {
      return Object.values(activityData[date]).filter(v => v).length;
    } else {
      return activityData[date][selectedHabit] ? 1 : 0;
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

  if (habitsLoading || isLoadingActivity || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const firstDay = getFirstDayOfMonth(selectedYear, selectedMonth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Calendrier</h1>
          <p className="text-slate-400">Vue mensuelle de tes habitudes</p>
        </div>

        {/* Filtres */}
        <HabitFilters
          habits={habits}
          selectedHabit={selectedHabit}
          onSelectHabit={setSelectedHabit}
        />

        {/* Calendrier */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-slate-700/50">
          <MonthNavigation
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onNavigate={navigateMonth}
          />

          <CalendarGrid
            year={selectedYear}
            month={selectedMonth}
            daysInMonth={daysInMonth}
            firstDay={firstDay}
            selectedHabit={selectedHabit}
            getActivityLevel={getActivityLevel}
            getColorForLevel={(level) => getColorForLevel(level, selectedHabit, habits)}
          />

          <CalendarLegend selectedHabit={selectedHabit} habits={habits} />
        </div>

        {/* Stats */}
        <MonthStats stats={stats} />

        {/* Détails */}
        <HabitDetails habitStats={stats.habitStats} habits={habits} />
      </div>
    </div>
  );
}