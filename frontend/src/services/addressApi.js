import api from './api';

// Validate pincode
export const validatePincode = async (pincode) => {
  try {
    const response = await api.post('/addresses/validate-pincode', { pincode });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Pincode validation failed' };
  }
};

// Add new address
export const addAddress = async (addressData) => {
  try {
    const response = await api.post('/addresses', addressData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to add address' };
  }
};

// Get all addresses
export const getAddresses = async () => {
  try {
    const response = await api.get('/addresses');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch addresses' };
  }
};

// Update address
export const updateAddress = async (id, addressData) => {
  try {
    const response = await api.put(`/addresses/${id}`, addressData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update address' };
  }
};

// Delete address
export const deleteAddress = async (id) => {
  try {
    const response = await api.delete(`/addresses/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete address' };
  }
};