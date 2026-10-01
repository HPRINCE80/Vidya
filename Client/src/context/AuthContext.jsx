import { useEffect, useMemo, useState } from 'react';
import { AuthContext } from './authContext.js';
import authService from '../services/authService.js';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('school_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('school_auth_token') || '');
  const loading = false;

  useEffect(() => {
    const handleSessionExpired = () => {
      setUser(null);
      setToken('');
    };

    const handleLogout = () => {
      setUser(null);
      setToken('');
    };

    window.addEventListener('auth:session-expired', handleSessionExpired);
    window.addEventListener('auth:logout', handleLogout);

    return () => {
      window.removeEventListener('auth:session-expired', handleSessionExpired);
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    const nextUser = {
      _id: response._id,
      name: response.name,
      email: response.email,
      role: response.role,
      studentId: response.studentId,
    };

    localStorage.setItem('school_auth_token', response.token);
    localStorage.setItem('school_user', JSON.stringify(nextUser));

    setToken(response.token);
    setUser(nextUser);

    return response;
  };

  const register = async (payload) => {
    const response = await authService.register(payload);

    const nextUser = {
      _id: response._id,
      name: response.name,
      email: response.email,
      role: response.role,
      studentId: response.studentId,
    };

    localStorage.setItem('school_auth_token', response.token);
    localStorage.setItem('school_user', JSON.stringify(nextUser));

    setToken(response.token);
    setUser(nextUser);

    return response;
  };

  const logout = () => {
    localStorage.removeItem('school_auth_token');
    localStorage.removeItem('school_user');
    setToken('');
    setUser(null);
    window.dispatchEvent(new Event('auth:logout'));
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      logout,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
