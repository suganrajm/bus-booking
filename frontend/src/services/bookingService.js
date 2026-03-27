import api from './api';

export const bookingService = {
  
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },
  
  getUserBookings: async () => {
    const response = await api.get('/bookings/user');
    return response.data;
  },
  
  cancelBooking: async (bookingId) => {
    const response = await api.put(`/bookings/${bookingId}/cancel`);
    return response.data;
  },

  getBookedSeats: async (busRouteId) => {
    const response = await api.get(`/seats/booked/${busRouteId}`);
    return response.data;
  },

  deleteBooking: async (bookingId) => {
    const response = await api.delete(`/bookings/${bookingId}`);
    return response.data;
  }
};
