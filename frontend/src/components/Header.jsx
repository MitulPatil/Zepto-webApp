import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-3xl">🛒</span>
            <span className="text-2xl font-bold text-zepto-orange">Zepto</span>
          </Link>

          {/* Right side - Cart & User */}
          <div className="flex items-center space-x-6">
            {/* Cart */}
            <Link to="/cart" className="relative">
              <div className="flex items-center space-x-1 hover:text-zepto-orange transition">
                <span className="text-2xl">🛒</span>
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-zepto-orange text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </div>
            </Link>

            {/* User Menu */}
            {isAuthenticated() ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/profile" 
                  className="text-gray-700 hover:text-zepto-orange transition font-medium"
                >
                  👤 {user?.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-zepto-orange transition font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-zepto-orange text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;