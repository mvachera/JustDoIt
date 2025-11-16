import { Target, BarChart3, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function QuickAccessCards() {
  return (
    <div>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 mt-8">
        <Link
          to="/habits"
          className="group flex items-center justify-between bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 hover:border-purple-500/50 rounded-xl p-4 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="bg-purple-600/20 rounded-lg p-2">
              <Target className="w-6 h-6 text-purple-400" />
            </div>
            <span className="font-semibold text-white">Habitudes</span>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          to="/stats"
          className="group flex items-center justify-between bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-500/50 rounded-xl p-4 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="bg-blue-600/20 rounded-lg p-2">
              <BarChart3 className="w-6 h-6 text-blue-400" />
            </div>
            <span className="font-semibold text-white">Statistiques</span>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          to="/calendar"
          className="group flex items-center justify-between bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 hover:border-green-500/50 rounded-xl p-4 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="bg-green-600/20 rounded-lg p-2">
              <Calendar className="w-6 h-6 text-green-400" />
            </div>
            <span className="font-semibold text-white">Calendrier</span>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-green-400 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
      <p className="flex justify-center text-gray-500 text-sm mt-4">
        Aucune carte de crédit requise • 100% gratuit
      </p>
    </div>
  );
}