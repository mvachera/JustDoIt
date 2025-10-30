import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import HabitCard from '../components/HabitCard';
import HabitFormModal from '../components/HabitForm';
import { useHabits } from '../hooks/useHabits';

export default function Habits() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { habits, isLoading, fetchHabits, deleteHabit, toggleHabit } = useHabits();

  useEffect(() => {
    fetchHabits();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-white">Mes habitudes</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition"
          >
            <Plus className="w-5 h-5" />
            <span>Nouvelle habitude</span>
          </button>
        </div>

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
        ) : (
          <div className="flex flex-col space-y-6">
            {habits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggle={toggleHabit}
                onDelete={deleteHabit}
              />
            ))}
          </div>
        )}
      </div>

      <HabitFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchHabits}
      />
    </div>
  );
}