import { useState, useEffect } from 'react';
import Header  from '../components/Header'

export default function Home() {
	const [name, setName] = useState('');

	useEffect(() => {
    const storedName = localStorage.getItem('name');
    if (storedName) {
      setName(storedName);
    }
  }, []);

	return (
		<div className="min-h-screen bg-black">
		  <Header />
		  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
			<div className="mb-8">
          		<h2 className="text-3xl font-bold text-white mb-2">
          		  Bonjour {name} ! 👋
          		</h2>
          		<p className="text-gray-400">
          		  {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          		</p>
        	</div>
			<div className="px-4 py-6 sm:px-0">
			  <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
				<div className="text-center">
				  <h2 className="text-2xl font-bold text-gray-900 mb-4">
					Bienvenue dans votre Habit Tracker !
				  </h2>
				  <p className="text-gray-600">
					Ici vous pourrez gérer vos habitudes quotidiennes.
				  </p>
				  <p className="text-sm text-gray-500 mt-4">
					Interface principale à venir...
				  </p>
				</div>
			  </div>
			</div>
		  </main>
		</div>
	)
}