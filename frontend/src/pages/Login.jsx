import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../services/authApi';
import { toast } from 'react-toastify';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!phone || !password) return toast.error('Please fill in all fields');
      const response = await loginApi(phone, password);
      if (response.success) {
        const userData = {
          _id: response.data._id,
          name: response.data.name,
          phone: response.data.phone,
          isAdmin: response.data.isAdmin
        };
        login(userData, response.data.token);
        navigate(userData.isAdmin ? '/admin' : '/profile');
      } else {
        toast.error(response.message || 'Login failed');
      }
    } catch (error) {
      toast.error(error.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="bg-slate-900 p-7 text-center">
          <h2 className="text-2xl font-extrabold text-white">Welcome back</h2>
          <p className="mt-1 text-sm text-slate-300">Login to continue</p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 focus:border-teal-700 focus:bg-white focus:outline-none" placeholder="Phone Number" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 focus:border-teal-700 focus:bg-white focus:outline-none" placeholder="Password" />
            <button type="submit" disabled={isLoading} className="w-full rounded-lg bg-teal-700 py-3 font-bold text-white hover:bg-teal-800 disabled:opacity-60">
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-600">
            Don't have an account? <Link to="/register" className="font-bold text-teal-700 hover:underline">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
