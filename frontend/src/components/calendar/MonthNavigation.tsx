import { MONTHS } from '../../utils/calendarHelpers';

interface MonthNavigationProps {
  selectedMonth: number;
  selectedYear: number;
  onNavigate: (direction: number) => void;
}

export default function MonthNavigation({ selectedMonth, selectedYear, onNavigate }: MonthNavigationProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={() => onNavigate(-1)}
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
        onClick={() => onNavigate(1)}
        className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-all"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}