import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Bars3Icon, 
  XMarkIcon, 
  UserCircleIcon,
  BellIcon 
} from '@heroicons/react/24/outline';

interface HeaderProps {
  onMenuToggle?: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuToggle = () => {
    const newState = !isMenuOpen;
    setIsMenuOpen(newState);
    onMenuToggle?.(newState);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left section - Logo and mobile menu button */}
          <div className="flex items-center">
            <button
              onClick={handleMenuToggle}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
            
            <div className="flex-shrink-0 ml-4 md:ml-0">
              <h1 className="text-xl font-bold text-gray-900">TaskFlow AI</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex md:ml-8 space-x-8">
              <button
                onClick={() => handleNavigation('/dashboard')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActiveRoute('/dashboard')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => handleNavigation('/tasks')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActiveRoute('/tasks')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Tasks
              </button>
              <button
                onClick={() => handleNavigation('/profile')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActiveRoute('/profile')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Profile
              </button>
            </nav>
          </div>

          {/* Right section - User profile and notifications */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">
              <BellIcon className="h-5 w-5" />
              <span className="sr-only">View notifications</span>
            </button>

            {/* User profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <UserCircleIcon className="h-8 w-8" />
                <span className="hidden md:block text-sm font-medium">
                  {user?.username}
                </span>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>
                  
                  <button
                    onClick={() => handleNavigation('/profile')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile Settings
                  </button>
                  
                  <button
                    onClick={() => handleNavigation('/settings')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Preferences
                  </button>
                  
                  <div className="border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <nav className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => handleNavigation('/dashboard')}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  isActiveRoute('/dashboard')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => handleNavigation('/tasks')}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  isActiveRoute('/tasks')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Tasks
              </button>
              <button
                onClick={() => handleNavigation('/profile')}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  isActiveRoute('/profile')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Profile
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;