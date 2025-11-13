interface WeekCalendarProps {
  weeklyData: Array<{ date: string; completed: number; total: number }>;
  totalHabits: number;
  totalCompletedThisWeek: number;
  averagePerDay: string;
}

function getWeekDayColor(completed: number): string {
  if (completed === 0) return 'bg-gray-700';
  if (completed === 1) return 'bg-purple-300';
  if (completed === 2) return 'bg-purple-400';
  if (completed === 3) return 'bg-purple-500';
  if (completed === 4) return 'bg-purple-600';
  return 'bg-purple-800';
}

export default function WeekCalendar({ 
  weeklyData, 
  totalHabits, 
  totalCompletedThisWeek,
  averagePerDay 
}: WeekCalendarProps) {
  const today = new Date().getDay();
  const adjustedToday = today === 0 ? 6 : today - 1;

  return (
    <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition">
      <div className='flex justify-between mb-4'>
        <h3 className="text-lg font-semibold text-white">Cette semaine</h3>
        <span className='text-gray-500'>
          Habitudes complétées : {totalCompletedThisWeek}/{totalHabits * 7}
        </span>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, i) => {
          const dayData = weeklyData[i];
          const isToday = i === adjustedToday;
          const isFuture = i > adjustedToday;
          const completed = dayData?.completed || 0;

          return (
            <div key={i} className="text-center">
              <p className={`text-xs mb-2 ${isToday ? 'text-purple-400 font-bold' : 'text-gray-500'}`}>
                {day}
              </p>
              <div
                className={`w-full aspect-square rounded-lg flex items-center justify-center transition-all duration-300 relative group ${
                  isFuture ? 'bg-gray-700 opacity-30' : getWeekDayColor(completed)
                } ${isToday ? 'ring-2 ring-purple-400' : ''}`}
              >
                {!isFuture && (
                  <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                    <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-xl border border-gray-700 whitespace-nowrap">
                      <div className="font-bold mb-1">{day}</div>
                      <div>
                        {completed} habitude{completed > 1 ? 's' : ''} complétée{completed > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Légende */}
      <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-400">
        <span>Moins</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded bg-gray-700" />
          <div className="w-4 h-4 rounded bg-purple-300" />
          <div className="w-4 h-4 rounded bg-purple-400" />
          <div className="w-4 h-4 rounded bg-purple-500" />
          <div className="w-4 h-4 rounded bg-purple-600" />
          <div className="w-4 h-4 rounded bg-purple-800" />
        </div>
        <span>Plus</span>
      </div>

      <p className="text-xs text-gray-500 mt-4 text-center">
        Nombre d'habitudes complétées en moyenne par jour : {averagePerDay}
      </p>
    </div>
  );
}