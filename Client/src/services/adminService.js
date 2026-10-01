import api from './api.js';

export const adminService = {
  createTeacher: async (payload) => {
    const { data } = await api.post('/admin/teachers', payload);
    return data;
  },
};

export default adminService;
