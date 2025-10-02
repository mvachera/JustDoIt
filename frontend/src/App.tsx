import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import './App.css'
import { Toaster } from "@/components/ui/toaster";
import Home from './components/Home'
import { useAuth } from "./hooks/useAuth";

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        {!isLoggedIn && (
          <>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            {/* Si user non loggé et tente d’aller ailleurs → redirigé vers login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}

        {/* Routes privées */}
        {isLoggedIn && (
          <>
            <Route path="/" element={<Home />} />
            {/* Si user loggé et tente /login → redirigé vers home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App
