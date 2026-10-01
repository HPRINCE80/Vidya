import api from './api.js';

export const authService = {
  login: async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  },

  register: async (payload, role = 'student') => {
    const endpoints = {
      student: '/auth/register/student',
      teacher: '/auth/register/teacher',
      admin: '/auth/register/admin',
    };
    const { data } = await api.post(endpoints[role] || endpoints.student, payload);
    return data;
  },

  getDashboardData: async (role) => {
    const endpoints = {
      admin: '/auth/admin-dashboard',
      teacher: '/auth/teacher-dashboard',
      student: '/auth/student-dashboard',
    };

    const endpoint = endpoints[role] || '/auth/student-dashboard';
    const { data } = await api.get(endpoint);
    return data;
  },

  logout: () => {
    localStorage.removeItem('school_auth_token');
    localStorage.removeItem('school_user');
    window.dispatchEvent(new Event('auth:logout'));
  },
};

export default authService;
