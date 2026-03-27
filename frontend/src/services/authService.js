import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/signin', { email, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  }
};
