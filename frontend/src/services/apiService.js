import axiosInstance from './axiosConfig';

// Auth API calls
export const authAPI = {
  login: (email, password) => 
    axiosInstance.post('/auth/login', { email, password }),

  register: (userData) => 
    axiosInstance.post('/auth/register', userData),

  getCurrentUser: () => 
    axiosInstance.get('/auth/me'),

  logout: () => 
    axiosInstance.post('/auth/logout')
};

// Ride API calls
export const ridesAPI = {
  createRide: (rideData) => 
    axiosInstance.post('/rides', rideData),

  getRides: (params) => 
    axiosInstance.get('/rides', { params }),

  getMyRides: () => 
    axiosInstance.get('/rides/my'),

  getJoinedRides: () => 
    axiosInstance.get('/rides/joined'),

  getRideById: (rideId) => 
    axiosInstance.get(`/rides/${rideId}`),

  joinRide: (rideId) => 
    axiosInstance.post(`/rides/${rideId}/join`),

  leaveRide: (rideId) => 
    axiosInstance.delete(`/rides/${rideId}/leave`)
};

// Users API calls
export const usersAPI = {
  getPlatformStats: () => 
    axiosInstance.get('/users/stats')
};

export default axiosInstance;