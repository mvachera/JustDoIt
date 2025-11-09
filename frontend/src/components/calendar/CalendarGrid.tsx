import { DAYS_OF_WEEK, MONTHS } from '../../utils/calendarHelpers';

interface CalendarGridProps {
  year: number;
  month: number;
  daysInMonth: number;
  firstDay: number;
  selectedHabit: 'all' | number;
  getActivityLevel: (date: string) => number;
  getColorForLevel: (level: number) => string;
}

export default function CalendarGrid({
  year,
  month,
  daysInMonth,
  firstDay,
  selectedHabit,
  getActivityLevel,
  getColorForLevel
}: CalendarGridProps) {
  const today = new Date();

  return (
    <div className="space-y-2">
      {/* Jours de la semaine */}
      <div className="grid grid-cols-7 gap-2 mb-3">
        {DAYS_OF_WEEK.map((day, index) => (
          <div key={index} className="text-center text-xs text-slate-500 font-medium">
            {day}
          </div>
        ))}
      </div>

      {/* Grille des jours */}
      <div className="grid grid-cols-7 gap-2">
        {/* Cases vides */}
        {[...Array(firstDay)].map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Jours du mois */}
        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
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
              
              {!isFuture && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                  <div className="bg-slate-900 text-white text-xs rounded-lg py-2 px-3 shadow-xl border border-slate-700 whitespace-nowrap">
                    <div className="font-bold mb-1">{day} {MONTHS[month]}</div>
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
  );
}