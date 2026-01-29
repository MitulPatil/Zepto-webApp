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

// Update user profile
export const updateProfile = async (name, phone) => {
  try {
    const response = await api.put('/auth/update-profile', {
      name,
      phone
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update profile' };
  }
};

// Change password
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.put('/auth/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to change password' };
  }
};

// Add address
export const addAddress = async (addressData) => {
  try {
    const response = await api.post('/auth/add-address', addressData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to add address' };
  }
};

// Update address
export const updateAddress = async (addressId, addressData) => {
  try {
    const response = await api.put(`/auth/update-address/${addressId}`, addressData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update address' };
  }
};

// Delete address
export const deleteAddress = async (addressId) => {
  try {
    const response = await api.delete(`/auth/delete-address/${addressId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete address' };
  }
};