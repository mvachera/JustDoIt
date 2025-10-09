import { Plus, CheckCircle2, X } from 'lucide-react';
import { useState } from 'react';
import  Header  from '../components/Header';

interface Habit {
  id: number;
  color: string;
  name: string;
  streak: number;
  description: string;
  completed: boolean;
  lastWeek: number;
  category: string;
}

interface Category {
  name: string;
  color: string;
}

interface HabitFormData {
  name: string;
  description: string;
  category: string;
}

interface HabitFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (habit: HabitFormData) => void;
}

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: number) => void;
}

const CATEGORIES: Category[] = [
  { name: 'Sport', color: 'bg-blue-500' },
  { name: 'Détente', color: 'bg-purple-500' },
  { name: 'Apprentissage', color: 'bg-orange-500' },
  { name: 'Santé', color: 'bg-green-500' },
  { name: 'Travail', color: 'bg-red-500' },
  { name: 'Social', color: 'bg-pink-500' },
];

function HabitFormModal({ isOpen, onClose, onSubmit }: HabitFormModalProps) {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('Sport');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description, category });
    setName('');
    setDescription('');
    setCategory('Sport');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-md w-full p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Nouvelle habitude</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nom de l'habitude
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Méditation, Sport..."
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: 10 minutes par jour"
              rows={3}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
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
                  onClick={() => setCategory(cat.name)}
                  className={`p-3 rounded-lg border-2 transition ${
                    category === cat.name
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

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={!name.trim()}
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Créer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function HabitCard({ habit, onToggle }: HabitCardProps) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-600 transition">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${habit.color}`}></div>
          <h3 className="text-lg font-semibold text-white">{habit.name}</h3>
        </div>
        <span className="text-sm text-gray-400">{habit.streak} jours</span>
      </div>
      
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">{habit.description}</p>
        <button
          onClick={() => onToggle(habit.id)}
          className={`p-2 rounded-lg transition ${
            habit.completed 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          <CheckCircle2 className={`w-5 h-5 ${habit.completed ? 'text-white' : 'text-gray-400'}`} />
        </button>
      </div>
      
      <div className="mt-4 flex space-x-1">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-2 rounded-full ${
              i < habit.lastWeek ? 'bg-purple-600' : 'bg-gray-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Habits() {
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: 1,
      name: 'Méditation',
      description: '10 minutes par jour',
      color: 'bg-purple-500',
      category: 'Détente',
      streak: 12,
      completed: true,
      lastWeek: 6
    },
    {
      id: 2,
      name: 'Sport',
      description: '30 minutes d\'exercice',
      color: 'bg-blue-500',
      category: 'Sport',
      streak: 8,
      completed: false,
      lastWeek: 5
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const toggleHabit = (id: number): void => {
    setHabits(habits.map(h => 
      h.id === id ? { ...h, completed: !h.completed } : h
    ));
  };

  const handleCreateHabit = (newHabit: HabitFormData): void => {
    const categoryColor = CATEGORIES.find(c => c.name === newHabit.category)?.color || 'bg-gray-500';
    
    const habit: Habit = {
      id: Date.now(),
      ...newHabit,
      color: categoryColor,
      streak: 0,
      completed: false,
      lastWeek: 0,
    };
    
    setHabits([...habits, habit]);
    setIsModalOpen(false);
  };

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

        <div className="flex flex-col space-y-6">
          {habits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onToggle={toggleHabit}
            />
          ))}
        </div>

        {habits.length === 0 && (
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
        )}
      </div>

      <HabitFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateHabit}
      />
    </div>
  );
}