import { getColorForHabit } from '../../utils/calendarHelpers';

interface CalendarLegendProps {
  selectedHabit: 'all' | number;
  habits: any[];
}

export default function CalendarLegend({ selectedHabit, habits }: CalendarLegendProps) {
  return (
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
            <div className="w-5 h-5 rounded" style={{ backgroundColor: getColorForHabit(selectedHabit as number, habits) }} />
          </>
        )}
      </div>
      <span>Plus</span>
    </div>
  );
}