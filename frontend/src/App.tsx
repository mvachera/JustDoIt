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
  const { isLoggedIn } = useAuth();

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
            {/* Si user non loggé et tente d’aller ailleurs → redirigé vers login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}

        {/* Routes privées */}
        {isLoggedIn && (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/Habits" element={<Habits />} />
            <Route path="/Stats" element={<Stats />} />
            <Route path="/Calendar" element={<Calendar />} />
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
