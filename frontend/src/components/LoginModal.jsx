import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../services/authApi';
import { toast } from 'react-toastify';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!phone || !password) {
        toast.error('Please fill in all fields');
        return;
      }

      const response = await loginApi(phone, password);
      
      if (response.success) {
        const userData = {
          _id: response.data._id,
          name: response.data.name,
          phone: response.data.phone,
          isAdmin: response.data.isAdmin
        };
        login(userData, response.data.token);
        onClose();
        navigate(userData.isAdmin ? '/admin' : '/profile');
        setPhone('');
        setPassword('');
      } else {
        toast.error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      // Check if user not found
      if (error.message && error.message.includes('not found')) {
        toast.error('Signup before login');
        onClose();
        onSwitchToRegister();
      } else {
        toast.error(error.message || 'Invalid credentials');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="relative bg-slate-900 p-7 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="mb-1 text-2xl font-extrabold text-white">Welcome back</h2>
          <p className="text-sm text-slate-300">Login to continue</p>
        </div>
        
        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 ml-1 block text-sm font-bold text-slate-700">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 focus:border-teal-700 focus:bg-white focus:outline-none"
                placeholder="Ex. 9876543210"
                maxLength={10}
              />
            </div>
            
            <div>
              <label className="mb-2 ml-1 block text-sm font-bold text-slate-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 focus:border-teal-700 focus:bg-white focus:outline-none"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-teal-700 py-3 font-bold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => {
                  onClose();
                  onSwitchToRegister();
                }}
                className="font-bold text-teal-700 hover:underline"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
