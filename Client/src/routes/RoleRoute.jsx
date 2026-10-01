import { Navigate, Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Loader } from '../components/ui/Loader.jsx';
import { useAuth } from '../hooks/useAuth.js';

const RoleRoute = ({ role }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return <Loader fullHeight />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
        <div className="max-w-md rounded-2xl border border-amber-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">You do not have permission to access this page</h1>
          <p className="mt-2 text-sm text-slate-600">This area is restricted to {role} accounts.</p>
          <Link className="mt-5 inline-flex rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white" to={`/${user?.role || 'student'}/dashboard`}>Return to your dashboard</Link>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default RoleRoute;
