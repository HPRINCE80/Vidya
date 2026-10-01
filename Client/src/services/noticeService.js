import api from './api.js';

export const noticeService = {
  getStudentNotices: async () => {
    const { data } = await api.get('/notices');
    return data;
  },
};

export default noticeService;
