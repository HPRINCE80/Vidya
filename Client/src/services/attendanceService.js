import api from './api.js';

export const attendanceService = {
  getAttendance: async (params = {}) => {
    const { data } = await api.get('/attendance/get-attendance', { params });
    return data.records;
  },

  markAttendance: async (payload) => {
    const { data } = await api.post('/attendance/mark-attendance', payload);
    return data;
  },
};

export default attendanceService;