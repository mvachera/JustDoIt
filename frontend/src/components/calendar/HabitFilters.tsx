import { getColorForHabit } from '../../utils/calendarHelpers';

interface Habit {
  id: number;
  name: string;
}

interface HabitFiltersProps {
  habits: Habit[];
  selectedHabit: 'all' | number;
  onSelectHabit: (habitId: 'all' | number) => void;
}

export default function HabitFilters({ habits, selectedHabit, onSelectHabit }: HabitFiltersProps) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-slate-700/50">
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onSelectHabit('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            selectedHabit === 'all'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Toutes les habitudes
        </button>
        {habits.map((habit) => {
          const color = getColorForHabit(habit.id, habits);
          return (
            <button
              key={habit.id}
              onClick={() => onSelectHabit(habit.id)}
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
  );
}