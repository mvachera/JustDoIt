import { Plus, CheckCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import HabitCard from '../components/HabitCard';
import HabitFormModal from '../components/HabitForm';
import { useHabits } from '../hooks/useHabits';
import { CATEGORIES, Habit } from '../types/habits';

export default function Habits() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string>('Toutes');
  const { habits, isLoading, getHabits, deleteHabit, toggleHabit, toggleAllHabits } = useHabits();

  useEffect(() => {
    getHabits();
  }, []);

  // Ouvre le modal d'édition
  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  // Ferme le modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingHabit(undefined);
  };

  const filteredHabits = selectedCategory === 'Toutes'
    ? habits
    : habits.filter(h => h.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-white">Mes habitudes</h3>
          <div className='flex gap-3'>
            {habits.length > 0 && (
                <button
                  onClick={toggleAllHabits}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition"
                >
                  <CheckCheck className="w-5 h-5" />
                  <span>Tout valider</span>
                </button>
              )}
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition"
            >
              <Plus className="w-5 h-5" />
              <span>Nouvelle habitude</span>
            </button>
          </div>
        </div>

        {habits.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSelectedCategory('Toutes')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedCategory === 'Toutes'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              Toutes ({habits.length})
            </button>
            {CATEGORIES.map(cat => {
              const count = habits.filter(h => h.category === cat.name).length;
              if (count === 0) return null;
              
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    selectedCategory === cat.name
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Chargement...</p>
          </div>
        ) : habits.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-800 rounded-xl p-12 border border-gray-700">
              <p className="text-gray-400 mb-6">Aucune habitude pour le moment</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg inline-flex items-center space-x-2 transition"
              >
                <Plus className="w-5 h-5" />
                <span>Créer ma première habitude</span>
              </button>
            </div>
          </div>
        ) : filteredHabits.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-800 rounded-xl p-12 border border-gray-700">
              <p className="text-gray-400 mb-6">
                Aucune habitude dans la catégorie "{selectedCategory}"
              </p>
              <button
                onClick={() => setSelectedCategory('Toutes')}
                className="text-purple-400 hover:text-purple-300 transition"
              >
                Voir toutes les habitudes
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-6">
            {filteredHabits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggle={toggleHabit}
                onDelete={deleteHabit}
                onEdit={handleEditHabit}
              />
            ))}
          </div>
        )}
      </div>

      <HabitFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={getHabits}
        editHabit={editingHabit}
      />
    </div>
  );
}