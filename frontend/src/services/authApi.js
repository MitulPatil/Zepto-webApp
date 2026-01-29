import api from './api';

// Register new user
export const register = async (name, phone, password) => {
  try {
    const response = await api.post('/auth/register', {
      name,
      phone,
      password
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};

// Login user
export const login = async (phone, password) => {
  try {
    const response = await api.post('/auth/login', {
      phone,
      password
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

// Get current user profile
export const getProfile = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch profile' };
  }
};