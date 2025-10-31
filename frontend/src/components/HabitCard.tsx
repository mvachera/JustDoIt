import { Calendar, CheckCircle2, Trash2, Flame } from 'lucide-react';
import { Habit, CATEGORIES } from '../types/habits';

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

export default function HabitCard({ habit, onToggle, onDelete }: HabitCardProps) {
  const categoryColor = CATEGORIES.find(c => c.name === habit.category)?.color || 'bg-gray-500';
  
  return (
    <div className="bg-[#1a1d24] rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${categoryColor}`}></div>
          <h3 className="text-lg font-semibold text-white">{habit.name}</h3>
        </div>
        <div className="flex items-center space-x-2">
          {/* NOUVEAU: Badge de série */}
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

      {/* Description */}
      <p className="text-gray-400 text-sm mb-4">{habit.description || 'Pas de description'}</p>

      {/* Calendrier hebdomadaire */}
      <div className="flex items-center space-x-2 mb-4">
        <Calendar className="text-gray-500 text-xs mr-2"/>
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
      <div className="pt-4 border-t border-gray-800">
        <span className="text-xs text-gray-500">Catégorie: {habit.category}</span>
      </div>
    </div>
  );
}