import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('school_auth_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      localStorage.removeItem('school_auth_token');
      localStorage.removeItem('school_user');
      window.dispatchEvent(new Event('auth:session-expired'));
    }

    return Promise.reject(error);
  }
);

export const getApiErrorMessage = (error) => {
  const serverMessage = error?.response?.data?.message;

  if (serverMessage) {
    return serverMessage;
  }

  if (error?.message === 'Network Error') {
    return 'Network error. Please check your connection and try again.';
  }

  return 'Something went wrong. Please try again.';
};

export default api;
