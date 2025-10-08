import { ComponentType } from 'react';
import { Calendar, TrendingUp, Target } from 'lucide-react';
import Header  from '../components/Header'

interface StatsCardProps {
  icon: ComponentType<any>; // Type pour un composant React
  title: string;
  color: string;
}

function StatsCard({ icon: Icon, title, color }: StatsCardProps) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          {/* <p className="text-3xl font-bold text-white">{value}</p> */}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

export default function Stats() {
	return (
		<div className="min-h-screen bg-black">
			<Header />
			<div className="flex flex-col space-y-8 pt-24 pb-12 mx-4">
        	  <StatsCard
        	    icon={Target}
        	    title="Habitudes du jour"
        	    // value={`${completedToday}/${totalHabits}`}
        	    color="bg-purple-600"
        	  />
        	  <StatsCard
        	    icon={TrendingUp}
        	    title="Série moyenne"
        	    // value={`${averageStreak} jours`}
        	    color="bg-blue-600"
        	  />
        	  <StatsCard
        	    icon={Calendar}
        	    title="Taux de réussite"
        	    // value={`${Math.round((completedToday / totalHabits) * 100)}%`}
        	    color="bg-green-600"
        	  />
        	</div>
        </div>
	);
}