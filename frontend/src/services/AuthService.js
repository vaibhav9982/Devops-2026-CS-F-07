import api from './api.js';

export const registerUser = async ({ name, email, password }) => {
  const response = await api.post('/api/register', { name, email, password });
  return response.data;
};

export const loginUser = async ({ email, password }) => {
  const response = await api.post('/api/login', { email, password });
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post('/api/logout');
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/api/me');
  return response.data;
};
