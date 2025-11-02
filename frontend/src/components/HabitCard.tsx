import { Calendar, CheckCircle2, Trash2, Flame } from 'lucide-react';
import { Habit, CATEGORIES, DIFFICULTY } from '../types/habits';
import { Pencil } from 'lucide-react';

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

export default function HabitCard({ habit, onToggle, onDelete }: HabitCardProps) {
  const categoryColor = CATEGORIES.find(c => c.name === habit.category)?.color || 'bg-gray-500';
  
  // Calcul du pourcentage de complétion de la semaine
  const completedDays = habit.weekData.filter(day => day === true).length;
  const totalDays = habit.weekData.length;
  const completionRate = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
  
  return (
    <div className="bg-[#1a1d24] rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${categoryColor}`}></div>
          <h3 className="text-lg font-semibold text-white">{habit.name}</h3>
        </div>
        <div className="flex items-center space-x-2">
          {/* Badge de série */}
          {habit.streak > 0 && (
            <div className="flex items-center gap-1 hover:bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full">
              <Flame className="w-4 h-4" />
              <span className="text-sm font-semibold">{habit.streak}j</span>
            </div>
          )}

          <button
            onClick={() => onDelete(habit.id)}
            className="p-2 hover:bg-red-500/10 rounded-lg transition"
            title="Supprimer cette habitude"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>

          <button
            // onClick={handleEdit}
            className="p-2 hover:bg-blue-500/10 rounded-lg transition"
            title="Modifier cette habitude"
          >
            <Pencil className="w-4 h-4 text-blue-500" />
          </button>

          <button
            onClick={() => onToggle(habit.id)}
            className={`p-2 rounded-lg transition ${
              habit.completed_today === 1
                ? 'hover:bg-green-500/10'
                : 'hover:bg-gray-700'
            }`}
            title={habit.completed_today === 1 ? 'Habitude complétée' : 'Marquer comme complétée'}
          >
            <CheckCircle2
              className={`w-5 h-5 ${
                habit.completed_today === 1 ? 'text-green-500' : 'text-gray-500'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Description avec pourcentage */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-400 text-sm">{habit.description || 'Pas de description'}</p>
        <div className="text-right">
          <p className="text-sm font-semibold text-purple-400">{completedDays}/7 cette semaine</p>
          <p className="text-xs text-gray-500">({completionRate}%)</p>
        </div>
      </div>

      {/* Calendrier hebdomadaire */}
      <div className="flex items-center space-x-2 mb-4">
        <Calendar className="text-gray-500 text-xs mr-2" />
        {DAYS.map((day, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <span className="text-gray-500 text-xs mb-2">{day}</span>
            <div
              className={`w-full h-12 rounded-lg transition ${
                habit.weekData[index]
                  ? 'bg-purple-600'
                  : 'bg-gray-800'
              }`}
            />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
        <span className="text-xs text-gray-400">Catégorie: {habit.category}</span>
        <span className="text-xs text-gray-400 flex items-center gap-1">
          {DIFFICULTY.find(d => d.value === habit.difficulty)?.icon} {' '}
          {DIFFICULTY.find(d => d.value === habit.difficulty)?.label}
        </span>
        {habit.best_streak < 1 && (
          <span className="text-xs text-gray-400 flex items-center gap-1">
            🏆 Record : {habit.best_streak} jour
          </span>
        )}
        {habit.best_streak === 1 && (
          <span className="text-xs text-yellow-500 flex items-center gap-1">
            🏆 Record : {habit.best_streak} jour
          </span>
        )}
        {habit.best_streak > 1 && (
          <span className="text-xs text-yellow-500 flex items-center gap-1">
            🏆 Record : {habit.best_streak} jours
          </span>
        )}
      </div>
    </div>
  );
}