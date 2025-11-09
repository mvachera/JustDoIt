interface MonthStatsProps {
  stats: {
    totalDays: number;
    totalPossibleCompletions: number;
    totalCompletions: number;
    bestHabit: {
      name: string;
      percentage: number;
    } | null;
  };
}

export default function MonthStats({ stats }: MonthStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Taux de réussite */}
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
          {stats.totalPossibleCompletions > 0 
            ? Math.round((stats.totalCompletions / stats.totalPossibleCompletions) * 100) 
            : 0}%
        </div>
        <p className="text-purple-100">
          {stats.totalCompletions} / {stats.totalPossibleCompletions} habitudes complétées
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
        {stats.bestHabit ? (
          <>
            <div className="text-2xl font-bold mb-2">{stats.bestHabit.name}</div>
            <p className="text-green-100">{stats.bestHabit.percentage}% de réussite</p>
          </>
        ) : (
          <p className="text-green-100">Pas encore de données</p>
        )}
      </div>

      {/* Total complétions */}
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
          {stats.totalCompletions}
        </div>
        <p className="text-blue-100">
          habitudes complétées ce mois
        </p>
      </div>
    </div>
  );
}