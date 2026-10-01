import api from './api.js';

export const noticeService = {
  getStudentNotices: async () => {
    const { data } = await api.get('/notices');
    return data;
  },
  getNotices: async () => {
    const { data } = await api.get('/notices');
    return data;
  },
  createNotice: async (payload) => {
    const { data } = await api.post('/notices', payload);
    return data;
  },
  updateNotice: async (noticeId, payload) => {
    const { data } = await api.put(`/notices/${noticeId}`, payload);
    return data;
  },
  deleteNotice: async (noticeId) => {
    const { data } = await api.delete(`/notices/${noticeId}`);
    return data;
  },
};

export default noticeService;
