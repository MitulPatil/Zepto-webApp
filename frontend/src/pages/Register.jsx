import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register as registerApi } from '../services/authApi';
import { toast } from 'react-toastify';

const Register = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (formData.password !== formData.confirmPassword) return toast.error('Passwords do not match');

      const response = await registerApi(formData.name, formData.phone, formData.password, Boolean(formData.isAdmin));
      if (response.success && response.data?.token) {
        const userData = {
          _id: response.data._id,
          name: response.data.name,
          phone: response.data.phone,
          isAdmin: response.data.isAdmin
        };
        login(userData, response.data.token);
        navigate(userData.isAdmin ? '/admin' : '/profile');
      } else {
        toast.error(response.message || 'Registration failed');
      }
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="bg-slate-900 p-7 text-center">
          <h2 className="text-2xl font-extrabold text-white">Create account</h2>
          <p className="mt-1 text-sm text-slate-300">Join Zepto Market</p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 focus:border-teal-700 focus:bg-white focus:outline-none" placeholder="Full Name" required />
            <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 focus:border-teal-700 focus:bg-white focus:outline-none" placeholder="Phone Number" required />
            <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 focus:border-teal-700 focus:bg-white focus:outline-none" placeholder="Password" required minLength={6} />
            <input type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 focus:border-teal-700 focus:bg-white focus:outline-none" placeholder="Confirm Password" required />
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={formData.isAdmin} onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })} />
              Sign up as Admin
            </label>
            <button type="submit" disabled={isLoading} className="w-full rounded-lg bg-teal-700 py-3 font-bold text-white hover:bg-teal-800 disabled:opacity-60">
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-600">
            Already have an account? <Link to="/login" className="font-bold text-teal-700 hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
