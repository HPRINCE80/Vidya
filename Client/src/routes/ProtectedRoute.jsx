import { Navigate, Outlet } from 'react-router-dom';
import { Loader } from '../components/ui/Loader.jsx';
import { useAuth } from '../hooks/useAuth.js';

const ProtectedRoute = () => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <Loader fullHeight />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
