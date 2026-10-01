import { LayoutDashboard, LogOut, ShieldCheck, UserCircle2 } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const navItems = [
  { label: 'Overview', to: '/', icon: LayoutDashboard },
  { label: 'Profile', to: '/profile', icon: UserCircle2 },
  { label: 'Security', to: '/security', icon: ShieldCheck },
];

const DashboardLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full border-b border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur lg:w-72 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Workspace</p>
              <h2 className="text-xl font-semibold text-slate-900">School Portal</h2>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Logged in as</p>
            <div className="mt-3">
              <p className="text-base font-semibold text-slate-900">{user?.name || 'User'}</p>
              <p className="text-sm text-slate-600">{user?.role || 'student'}</p>
            </div>
          </div>

          <nav className="mt-8 space-y-2">
            {navItems.map(({ label, to, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            onClick={logout}
            className="mt-10 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <LogOut size={18} />
            Logout
          </button>
        </aside>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
