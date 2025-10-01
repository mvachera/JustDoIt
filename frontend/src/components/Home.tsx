interface HomeProps {
  onLogout: () => void;
}

export default function Home({ onLogout }: HomeProps) {
	return (
		<div className="min-h-screen bg-gray-50">
		  <header className="bg-white shadow-sm border-b">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			  <div className="flex justify-between items-center h-16">
				<h1 className="text-xl font-semibold text-gray-900">
				  Habit Tracker
				</h1>
				<button 
				  onClick={onLogout}
				  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
				>
				  Se déconnecter
				</button>
			  </div>
			</div>
		  </header>	
		  <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
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