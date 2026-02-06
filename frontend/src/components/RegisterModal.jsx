import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register as registerApi } from '../services/authApi';
import { toast } from 'react-toastify';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
    isAdmin: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      const isAdminRegistration = Boolean(formData.isAdmin);
      const response = await registerApi(formData.name, formData.phone, formData.password, isAdminRegistration);
      
      if (response.success) {
        toast.success('Registration successful!');
        // Automatically login after register if token is provided
        if (response.data && response.data.token) {
          const userData = {
            _id: response.data._id,
            name: response.data.name,
            phone: response.data.phone,
            isAdmin: response.data.isAdmin
          };
          login(userData, response.data.token);
          onClose();
          navigate(userData.isAdmin ? '/admin' : '/profile');
          setFormData({
            name: '',
            phone: '',
            password: '',
            confirmPassword: '',
            isAdmin: false
          });
        }
      } else {
        toast.error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed');
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
          <h2 className="mb-1 text-2xl font-extrabold text-white">Create account</h2>
          <p className="text-sm text-slate-300">Sign up to start shopping</p>
        </div>
        
        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 ml-1 block text-sm font-bold text-slate-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 focus:border-teal-700 focus:bg-white focus:outline-none"
                placeholder="Enter your full name"
                required
              />
            </div>

            <label className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <input
                type="checkbox"
                name="isAdmin"
                checked={formData.isAdmin}
                onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
                className="h-4 w-4"
              />
              <span className="text-sm font-semibold text-slate-700">Sign up as Admin</span>
            </label>
            
            <div>
              <label className="mb-2 ml-1 block text-sm font-bold text-slate-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 focus:border-teal-700 focus:bg-white focus:outline-none"
                placeholder="Ex. 9876543210"
                maxLength={10}
                required
              />
            </div>

            <div>
              <label className="mb-2 ml-1 block text-sm font-bold text-slate-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 focus:border-teal-700 focus:bg-white focus:outline-none"
                placeholder="Create a password"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="mb-2 ml-1 block text-sm font-bold text-slate-700">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 focus:border-teal-700 focus:bg-white focus:outline-none"
                placeholder="Confirm your password"
                required
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
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            <p>
              Already have an account?{' '}
              <button
                onClick={() => {
                  onClose();
                  onSwitchToLogin();
                }}
                className="font-bold text-teal-700 hover:underline"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
