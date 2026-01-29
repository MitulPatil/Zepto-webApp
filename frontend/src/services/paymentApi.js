import api from './api';

// Create dummy payment
export const createPayment = async (amount) => {
  try {
    const response = await api.post('/payments/create', { amount });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Payment failed' };
  }
};

// Verify payment
export const verifyPayment = async (paymentData) => {
  try {
    const response = await api.post('/payments/verify', paymentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Payment verification failed' };
  }
};

// Get payment methods
export const getPaymentMethods = async () => {
  try {
    const response = await api.get('/payments/methods');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch payment methods' };
  }
};