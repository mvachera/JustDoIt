import { useState, useEffect } from 'react'
import LoginForm from './components/LoginForm'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Vérifie si l'utilisateur est connecté au chargement
  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    
    if (token && user) {
      setIsLoggedIn(true)
    }
    
    setIsLoading(false)
  }, [])

  // Fonction pour gérer la connexion réussie
  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
  }

  // Fonction pour se déconnecter
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
  }

  // Affichage de chargement
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Chargement...</div>
      </div>
    )
  }

  // Si pas connecté, afficher toujours le formulaire de connexion
  if (!isLoggedIn) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />
  }

  // Si connecté, afficher l'app principale
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              Habit Tracker
            </h1>
            <button 
              onClick={handleLogout}
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

export default App