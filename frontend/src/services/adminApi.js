import api from './api';

export const getAdminStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

export const getAdminProducts = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await api.get(`/admin/products${query ? `?${query}` : ''}`);
  return response.data;
};

export const createAdminProduct = async (productData) => {
  const response = await api.post('/admin/products', productData);
  return response.data;
};

export const updateAdminProduct = async (productId, productData) => {
  const response = await api.put(`/admin/products/${productId}`, productData);
  return response.data;
};

export const updateAdminProductStock = async (productId, stockData) => {
  const response = await api.patch(`/admin/products/${productId}/stock`, stockData);
  return response.data;
};

export const deleteAdminProduct = async (productId) => {
  const response = await api.delete(`/admin/products/${productId}`);
  return response.data;
};

export const getAdminOrders = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await api.get(`/admin/orders${query ? `?${query}` : ''}`);
  return response.data;
};

export const updateAdminOrderStatus = async (orderId, status) => {
  const response = await api.put(`/admin/orders/${orderId}/status`, { status });
  return response.data;
};

export const getAdminUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const updateAdminUser = async (userId, payload) => {
  const response = await api.put(`/admin/users/${userId}`, payload);
  return response.data;
};

export const deleteAdminUser = async (userId) => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
};
