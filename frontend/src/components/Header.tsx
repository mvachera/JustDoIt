import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, Target, BarChart3, Calendar, LogOut, Bell } from 'lucide-react';
import { useState } from 'react';
import NotificationsModal from './notification/NotificationsModal';
import { useNotifications } from '../hooks/useNotifications';

interface NavLinkProps {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  isActive: boolean;
}

function NavLink({ to, icon: Icon, children, isActive }: NavLinkProps) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
        isActive
          ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
          : 'text-gray-400 hover:text-white hover:bg-gray-800'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{children}</span>
    </Link>
  );
}

export default function Header() {
  const { logout } = useAuth();
  const location = useLocation();
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const { dailyReminder, weeklyStats, monthlyStats, toggleNotification } = useNotifications();

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/habits', icon: Target, label: 'Habits' },
    { to: '/stats', icon: BarChart3, label: 'Stats' },
    { to: '/calendar', icon: Calendar, label: 'Calendar' },
  ];

  return (
    <>
      {/* Header Desktop */}
      <header className="hidden md:block bg-gray-900 border-b border-gray-800 fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">J</span>
              </div>
              <h1 className="text-xl font-bold text-white">
                Just<span className="text-purple-500">DoIt</span>
              </h1>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  isActive={location.pathname === item.to}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsNotifModalOpen(true)}
                className="bg-gray-800 hover:bg-purple-600 text-gray-300 hover:text-white p-2 rounded-lg transition-all duration-300"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
              </button>

              <button
                onClick={logout}
                className="flex items-center gap-2 bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-all duration-300 group"
              >
                <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span className="font-medium">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Mobile */}
      <nav className="md:hidden fixed top-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50 backdrop-blur-sm bg-opacity-95">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all ${
                  isActive ? 'text-purple-500' : 'text-gray-400'
                }`}
                title={item.label}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
          
          <button
            onClick={() => setIsNotifModalOpen(true)}
            className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg text-gray-400 transition-all"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="text-xs font-medium">Notifs</span>
          </button>

          <button
            onClick={logout}
            className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg text-gray-400 transition-all"
            title="Déconnexion"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-xs font-medium">Sortir</span>
          </button>
        </div>
      </nav>

      {/* Modal Notifications */}
      <NotificationsModal
        isOpen={isNotifModalOpen}
        onClose={() => setIsNotifModalOpen(false)}
        dailyReminder={dailyReminder}
        weeklyStats={weeklyStats}
        monthlyStats={monthlyStats}
        onToggle={toggleNotification}
      />
    </>
  );
}