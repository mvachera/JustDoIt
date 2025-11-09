import { getColorForHabit } from '../../utils/calendarHelpers';

interface HabitDetailsProps {
  habitStats: {
    [habitId: number]: {
      completed: number;
      total: number;
      name: string;
      category: string;
    };
  };
  habits: any[];
}

export default function HabitDetails({ habitStats, habits }: HabitDetailsProps) {
  return (
    <div className="mt-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
      <h3 className="text-xl font-bold mb-6">Détails par habitude</h3>
      <div className="space-y-4">
        {Object.entries(habitStats).map(([id, stat]) => {
          const habitId = parseInt(id);
          const color = getColorForHabit(habitId, habits);
          const percentage = stat.total > 0 ? (stat.completed / stat.total) * 100 : 0;
          
          return (
            <div key={habitId} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="font-medium">{stat.name}</span>
                  <span className="text-sm text-slate-400">{stat.category}</span>
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
                    backgroundColor: color
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}