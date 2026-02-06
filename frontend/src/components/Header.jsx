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
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to={user?.isAdmin ? '/admin' : '/'} className="flex items-center gap-2">
              <div className="rounded-lg bg-teal-700 px-2.5 py-1.5 text-sm font-extrabold text-white">Z</div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">Zepto Market</span>
            </Link>

            <div className="flex items-center gap-3">
              {!user?.isAdmin && (
                <Link to="/cart" className="relative rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  Cart
                  {getCartCount() > 0 && (
                    <span className="ml-2 rounded-full bg-teal-700 px-2 py-0.5 text-xs text-white">{getCartCount()}</span>
                  )}
                </Link>
              )}

              {isAuthenticated() ? (
                <div className="flex items-center gap-2">
                  {user?.isAdmin && (
                    <Link to="/admin" className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                      Admin Panel
                    </Link>
                  )}
                  {!user?.isAdmin && (
                    <Link to="/profile" className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                      {user?.name}
                    </Link>
                  )}
                  <button onClick={handleLogout} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowLoginModal(true)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    Login
                  </button>
                  <button onClick={() => setShowRegisterModal(true)} className="rounded-lg bg-teal-700 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-800">
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

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
