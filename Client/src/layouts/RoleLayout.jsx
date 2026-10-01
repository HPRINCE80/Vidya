import { LogOut, School } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const RoleLayout = ({ roleLabel, navItems, accent = 'sky' }) => {
  const { user, logout } = useAuth();
  const accentClasses = accent === 'violet'
    ? 'bg-violet-600 shadow-violet-600/20'
    : accent === 'emerald'
      ? 'bg-emerald-600 shadow-emerald-600/20'
      : 'bg-sky-600 shadow-sky-600/20';

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full border-b border-slate-200 bg-white p-4 shadow-sm lg:w-72 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-900 p-2 text-white"><School size={20} /></div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">School Portal</p>
              <h2 className="text-lg font-semibold text-slate-900">{roleLabel} workspace</h2>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Signed in</p>
            <p className="mt-2 font-semibold text-slate-900">{user?.name || 'User'}</p>
            <p className="text-sm capitalize text-slate-600">{user?.role || roleLabel}</p>
          </div>

          <nav className="mt-6 grid gap-1.5">
            {navItems.map(({ label, to, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? `${accentClasses} text-white shadow-lg` : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>

          <button type="button" onClick={logout} className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
            <LogOut size={18} />
            Logout
          </button>
        </aside>

        <main className="flex-1 p-4 sm:p-6 lg:p-8"><Outlet /></main>
      </div>
    </div>
  );
};

export default RoleLayout;
