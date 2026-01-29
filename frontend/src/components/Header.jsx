import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 sm:gap-2 group">
            <div className="bg-gradient-to-br from-purple-900 to-purple-700 text-white p-1.5 sm:p-2 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span className="text-xl sm:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-900 to-purple-700 tracking-tight">
              Zepto
            </span>
          </Link>

          {/* Right side - Cart & User */}
          <div className="flex items-center gap-2 sm:gap-6">
            {/* Cart */}
            <Link to="/cart" className="relative group">
              <div className="flex items-center gap-2 text-gray-700 hover:text-purple-900 transition-colors">
                <div className="p-1.5 sm:p-2 rounded-full hover:bg-purple-50 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                {getCartCount() > 0 && (
                  <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm">
                    {getCartCount()}
                  </span>
                )}
              </div>
            </Link>

            {/* User Menu */}
            {isAuthenticated() ? (
              <div className="flex items-center gap-2 sm:gap-4">
                <Link to="/profile" className="hidden md:flex items-center gap-2 hover:bg-purple-50 px-3 py-2 rounded-xl transition-all group">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-900 font-bold text-sm group-hover:bg-purple-200 transition-colors">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-gray-700 group-hover:text-purple-900">{user?.name}</span>
                </Link>
                <Link
                  to="/profile"
                  className="md:hidden w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-900 font-bold text-sm hover:bg-purple-200 transition-colors"
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs sm:text-sm font-semibold text-gray-500 hover:text-red-600 transition-colors px-2 sm:px-0"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-3">
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-purple-900 font-bold hover:bg-purple-50 transition-all text-xs sm:text-sm"
                >
                  Login
                </button>
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-purple-900 text-white font-bold hover:bg-purple-800 transition-all shadow-md hover:shadow-lg text-xs sm:text-sm"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>

    {/* Modals */}
    <LoginModal 
      isOpen={showLoginModal} 
      onClose={() => setShowLoginModal(false)}
      onSwitchToRegister={() => setShowRegisterModal(true)}
    />
    <RegisterModal 
      isOpen={showRegisterModal} 
      onClose={() => setShowRegisterModal(false)}
      onSwitchToLogin={() => setShowLoginModal(true)}
    />
  </>
  );
};

export default Header;