import { useState, useEffect } from 'react'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import './App.css'
import { Toaster } from "@/components/ui/toaster";
import Home from './components/Home' // <-- j’imagine que tu voulais rendre Home ici

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [showRegister, setShowRegister] = useState<boolean>(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    
    if (token && user) {
      setIsLoggedIn(true)
    }
  }, [])

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
  }

  const handleRegisterSuccess = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    setShowRegister(false)
  }

  return (
    <>
      {!isLoggedIn ? (
        showRegister ? (
          <RegisterForm 
            onRegisterSuccess={handleRegisterSuccess}
            onBackToLogin={() => setShowRegister(false)}
          />
        ) : (
          <LoginForm 
            onLoginSuccess={handleLoginSuccess}
            onNavigateToRegister={() => setShowRegister(true)}
          />
        )
      ) : (
        <Home onLogout={handleLogout} />
      )}
      
      <Toaster />
    </>
  )
}

export default App
