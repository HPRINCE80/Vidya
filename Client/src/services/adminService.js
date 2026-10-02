import api from './api.js';

export const adminService = {
  createTeacher: async (payload) => {
    const { data } = await api.post('/admin/teachers', payload);
    return data;
  },

  deleteStudent: async (studentId) => {
    const { data } = await api.delete(`/admin/students/${studentId}`);
    return data;
  },
};

export default adminService;
