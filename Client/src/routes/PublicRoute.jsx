import { Navigate, Outlet } from 'react-router-dom';
import { Loader } from '../components/ui/Loader.jsx';
import { useAuth } from '../hooks/useAuth.js';

const PublicRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader fullHeight />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
