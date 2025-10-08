import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'

function Header() {
	const { logout } = useAuth();
	
	const handleLogout = () => {
		logout();
	};

    return (
        <header className="bg-gray-900 fixed top-0 left-0 right-0
			py-2 flex items-center justify-between px-4 flex-wrap z-50">
            <h1 className="text-xl font-bold text-white">
				  JustDoIt
			</h1>
			<nav className="hidden sm:flex justify-center space-x-8 px-6 py-3">
                <Link to="/" className='text-gray-400 hover:text-purple-900
					transition-colors duration-300'>
                    Home
                </Link>
                <Link to="/habits" className='text-gray-400 hover:text-purple-900
					transition-colors duration-300'>
                    Habits
                </Link>
                <Link to="/stats" className='text-gray-400 hover:text-purple-900
					transition-colors duration-300'>
                    Stats
                </Link>
                <Link to="/calendar" className='text-gray-400 hover:text-purple-900
					transition-colors duration-300'>
                    Calendar
                </Link>
            </nav>
			<button 
				  onClick={handleLogout}
				  className="bg-purple-600 hover:bg-purple-700 text-white
				  	px-4 py-2 rounded-lg"
				>
				  Déconnexion
				</button>
        </header>
    );
}

export default Header;
