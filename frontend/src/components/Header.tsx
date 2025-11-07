import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, Target, BarChart3, Calendar, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface NavLinkProps {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  isActive: boolean;
  onClick?: () => void;
}

function NavLink({ to, icon: Icon, children, isActive, onClick }: NavLinkProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/habits', icon: Target, label: 'Habits' },
    { to: '/stats', icon: BarChart3, label: 'Stats' },
    { to: '/calendar', icon: Calendar, label: 'Calendar' },
  ];

  return (
    <>
      <header className="bg-gray-900 border-b border-gray-800 fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">J</span>
              </div>
              <h1 className="text-xl font-bold text-white">
                Just<span className="text-purple-500">DoIt</span>
              </h1>
            </div>

            {/* Navigation Desktop */}
            <nav className="hidden md:flex items-center gap-2">
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

            {/* Actions Desktop */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-all duration-300 group"
              >
                <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span className="font-medium">Déconnexion</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm" onClick={closeMobileMenu}>
          <div
            className="fixed top-16 left-0 right-0 bg-gray-900 border-b border-gray-800 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="px-4 py-6 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  isActive={location.pathname === item.to}
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </NavLink>
              ))}
              <button
                onClick={() => {
                  handleLogout();
                  closeMobileMenu();
                }}
                className="w-full flex items-center gap-2 bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-all duration-300 mt-4"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Déconnexion</span>
              </button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}