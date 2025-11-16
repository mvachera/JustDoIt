import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginForm from './components/auth/LoginForm'
import RegisterForm from './components/auth/RegisterForm'
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import './App.css'
import { Toaster } from "@/components/ui/toaster";
import Home from './pages/Home'
import { useAuth } from "./contexts/AuthContext";
import Stats from "./pages/Stats";
import Habits from "./pages/Habits";
import Calendar from "./pages/Calendar";

function App() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-white">Chargement...</p>
    </div>;
  }

  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        {!isLoggedIn && (
          <>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </>
        )}

        {/* Routes privées */}
        {isLoggedIn && (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/habits" element={<Habits />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/calendar" element={<Calendar />} />
          </>
        )}

        {/* Catch-all en dehors */}
        <Route path="*"
        element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App
