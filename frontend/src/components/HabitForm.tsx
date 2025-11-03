import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { CATEGORIES, HabitCategory, DIFFICULTY, HabitDifficulty, Habit } from '../types/habits';
import { useHabits } from '../hooks/useHabits';

interface HabitFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editHabit?: Habit;
}

export default function HabitForm({ isOpen, onClose, onSuccess, editHabit }: HabitFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Sport' as HabitCategory,
    difficulty: 'easy' as HabitDifficulty,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { createHabit, updateHabit } = useHabits();

  // Pré-remplis le formulaire si on édite
  useEffect(() => {
    if (editHabit) {
      setFormData({
        name: editHabit.name,
        description: editHabit.description || '',
        category: editHabit.category,
        difficulty: editHabit.difficulty,
      });
    } else {
      // Reset si création
      setFormData({ name: '', description: '', category: 'Sport', difficulty: 'easy' });
    }
  }, [editHabit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let success = false;

    if (editHabit) {
      success = await updateHabit(editHabit.id, formData);
    } else {
      success = await createHabit(formData);
    }

    if (success) {
      setFormData({ name: '', description: '', category: 'Sport', difficulty: 'easy' });
      onSuccess();
      onClose();
    }

    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-md w-full p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {editHabit ? 'Modifier l\'habitude' : 'Nouvelle habitude'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nom de l'habitude
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Méditation, Sport..."
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600
                rounded-lg text-white placeholder-gray-400 focus:outline-none
                focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ex: 10 minutes par jour"
              rows={3}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600
                rounded-lg text-white placeholder-gray-400 focus:outline-none
                focus:border-purple-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Catégorie
            </label>
            <div className="grid grid-cols-3 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.name })}
                  className={`p-3 rounded-lg border-2 transition ${
                    formData.category === cat.name
                      ? 'border-purple-500 bg-gray-700'
                      : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full ${cat.color} mx-auto mb-1`} />
                  <span className="text-xs text-white">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulté */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Difficulté
            </label>
            <div className="grid grid-cols-3 gap-3">
              {DIFFICULTY.map((diff) => (
                <button
                  key={diff.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, difficulty: diff.value })}
                  className={`p-3 rounded-lg border-2 transition ${
                    formData.difficulty === diff.value
                      ? 'border-purple-500 bg-gray-700'
                      : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                  }`}
                >
                  <div className="text-2xl mb-1">{diff.icon}</div>
                  <span className="text-xs text-white">{diff.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600
                text-white rounded-lg transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!formData.name.trim() || isLoading}
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700
                text-white rounded-lg transition disabled:opacity-50
                disabled:cursor-not-allowed"
            >
              {isLoading 
                ? (editHabit ? 'Modification...' : 'Création...') 
                : (editHabit ? 'Modifier' : 'Créer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}