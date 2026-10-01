import api from './api.js';

export const userService = {
  getProfile: async () => {
    // Placeholder until the backend exposes a profile endpoint.
    const { data } = await api.get('/users/profile');
    return data;
  },

  updateProfile: async (payload) => {
    // Placeholder until the backend exposes a profile update endpoint.
    const { data } = await api.put('/users/profile', payload);
    return data;
  },
};

export default userService;
