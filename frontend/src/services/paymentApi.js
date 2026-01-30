import api from './api';

// Create Razorpay payment order
export const createPayment = async (amount) => {
  try {
    const response = await api.post('/payments/create', { amount });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Payment creation failed' };
  }
};

// Verify Razorpay payment
export const verifyPayment = async (paymentData) => {
  try {
    const response = await api.post('/payments/verify', paymentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Payment verification failed' };
  }
};