import api from './api';

export const busService = {
  searchBuses: async (searchData) => {
    const response = await api.post('/schedules/search', searchData);
    return response.data;
  },
  
  // Admin specific methods
  addBus: async (busData) => {
    const response = await api.post('/buses', busData);
    return response.data;
  },
  
  addRoute: async (routeData) => {
    const response = await api.post('/routes', routeData);
    return response.data;
  },
  
  addSchedule: async (scheduleData) => {
    const response = await api.post('/schedules', scheduleData);
    return response.data;
  },

  getAllBuses: async () => {
    const response = await api.get('/buses');
    return response.data;
  },

  getAllRoutes: async () => {
    const response = await api.get('/routes');
    return response.data;
  },

  deleteBus: async (id) => {
    const response = await api.delete(`/buses/${id}`);
    return response.data;
  },

  deleteRoute: async (id) => {
    const response = await api.delete(`/routes/${id}`);
    return response.data;
  },

  getAllSchedules: async () => {
    const response = await api.get('/schedules');
    return response.data;
  },

  deleteSchedule: async (id) => {
    const response = await api.delete(`/schedules/${id}`);
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};
