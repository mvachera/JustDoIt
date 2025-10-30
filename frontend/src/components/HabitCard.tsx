import { CheckCircle2, Trash2 } from 'lucide-react';
import { Habit, CATEGORIES } from '../types/habits';

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function HabitCard({ habit, onToggle, onDelete }: HabitCardProps) {
  const categoryColor = CATEGORIES.find(c => c.name === habit.category)?.color || 'bg-gray-500';
  
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-600 transition">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${categoryColor}`}></div>
          <h3 className="text-lg font-semibold text-white">{habit.name}</h3>
        </div>
        <button
          onClick={() => onDelete(habit.id)}
          className="p-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
          title="Supprimer cette habitude"
        >
          <Trash2 className="w-4 h-4 text-white" />
        </button>
      </div>
      
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">{habit.description || 'Pas de description'}</p>
        <button
          onClick={() => onToggle(habit.id)}
          className={`p-2 rounded-lg transition ${
            habit.completed_today === 1
            ? 'bg-green-600 hover:bg-green-700'
            : 'bg-gray-700 hover:bg-gray-600'
          }`}
          title={habit.completed_today === 1 ? 'Habitude complétée' : 'Marquer comme complétée'}
        >
          <CheckCircle2
            className={`w-5 h-5 ${
              habit.completed_today === 1 ? 'text-white' : 'text-gray-400'
            }`}
          />
        </button>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-700">
        <span className="text-xs text-gray-500">Catégorie: {habit.category}</span>
      </div>
    </div>
  );
}