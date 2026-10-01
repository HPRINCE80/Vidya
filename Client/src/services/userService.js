import api from './api.js';

export const userService = {
  getProfile: async () => {
    const { data } = await api.get('/users/profile');
    return data;
  },

  updateProfile: async (payload) => {
    const { data } = await api.put('/users/profile', payload);
    return data;
  },
};

export default userService;
