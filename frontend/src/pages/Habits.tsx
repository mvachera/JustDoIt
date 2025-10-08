import { Plus, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import Header  from '../components/Header'

interface Habit {
  id: number;
  color: string;
  name: string;
  streak: number;
  description: string;
  completed: boolean;
  lastWeek: number;
}

interface HabitCardProps {
	habit : Habit;
	onToggle: (id: number) => void;
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
	const [habits, setHabits] = useState([
    {
      id: 1,
      name: 'Méditation',
      description: '10 minutes par jour',
      color: 'bg-purple-500',
      streak: 12,
      completed: true,
      lastWeek: 6
    },
    {
      id: 2,
      name: 'Sport',
      description: '30 minutes d\'exercice',
      color: 'bg-blue-500',
      streak: 8,
      completed: false,
      lastWeek: 5
    },
    {
      id: 3,
      name: 'Lecture',
      description: '20 pages',
      color: 'bg-green-500',
      streak: 15,
      completed: true,
      lastWeek: 7
    },
    {
      id: 4,
      name: 'Apprentissage',
      description: '1 heure de code',
      color: 'bg-orange-500',
      streak: 5,
      completed: false,
      lastWeek: 4
    }
  ]);

  const toggleHabit = (id: number) => {
    setHabits(habits.map(h => 
      h.id === id ? { ...h, completed: !h.completed } : h
    ));
  };

	return (
		<div className="min-h-screen bg-black">
			<Header />
			<div className="flex items-center justify-between pt-24 pb-12 mx-4">
        	  <h3 className="text-2xl font-bold text-white">Mes habitudes</h3>
        	  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition">
        	    <Plus className="w-5 h-5" />
        	    <span>Nouvelle habitude</span>
        	  </button>
        	</div>
        	<div className="flex flex-col space-y-8 mx-4">
        	  {habits.map(habit => (
        	    <HabitCard
        	      key={habit.id}
        	      habit={habit}
        	      onToggle={toggleHabit}
        	    />
        	  ))}
        	</div>
        </div>
	);
}