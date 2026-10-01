import { Activity, BookOpen, CircleDollarSign, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/common/StatCard.jsx';
import { Loader } from '../../components/ui/Loader.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import authService from '../../services/authService.js';
import classService from '../../services/classService.js';
import { getApiErrorMessage } from '../../services/api.js';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState({ classes: 0, teachers: 0, students: 0, message: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([authService.getDashboardData('admin'), classService.getClasses(), classService.getTeachers(), classService.getStudents()])
      .then(([dashboard, classes, teachers, students]) => setSummary({ classes: classes.length, teachers: teachers.length, students: students.length, message: dashboard.message }))
      .catch((apiError) => setError(getApiErrorMessage(apiError)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader text="Loading admin overview..." fullHeight />;
  if (error) return <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">{error}</div>;

  const stats = [
    { title: 'Total students', value: summary.students, description: 'Students across the system', accent: 'sky' },
    { title: 'Total teachers', value: summary.teachers, description: 'Teaching staff accounts', accent: 'emerald' },
    { title: 'Total classes', value: summary.classes, description: 'Configured classes', accent: 'violet' },
  ];

  return (
    <div className="space-y-6">
      <header className="rounded-3xl bg-gradient-to-r from-violet-700 via-indigo-600 to-sky-600 p-6 text-white shadow-lg shadow-indigo-200">
        <p className="text-sm uppercase tracking-[0.2em] text-indigo-100">System overview</p>
        <h1 className="mt-2 text-3xl font-semibold">Good morning, {user?.name || 'Admin'}</h1>
        <p className="mt-2 max-w-2xl text-indigo-100">Manage people, classes, attendance, and financial records from one administrative workspace.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">{stats.map((stat) => <StatCard key={stat.title} {...stat} />)}</div>

      <section className="grid gap-4 md:grid-cols-3">
        <Link to="/admin/classes" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300">
          <BookOpen className="text-indigo-600" /><h2 className="mt-4 font-semibold text-slate-900">Manage classes</h2><p className="mt-1 text-sm text-slate-600">Create classes and assign teachers.</p>
        </Link>
        <Link to="/admin/attendance" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300">
          <Activity className="text-emerald-600" /><h2 className="mt-4 font-semibold text-slate-900">Review attendance</h2><p className="mt-1 text-sm text-slate-600">Open the classroom operations workspace.</p>
        </Link>
        <Link to="/admin/fees" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300">
          <CircleDollarSign className="text-amber-600" /><h2 className="mt-4 font-semibold text-slate-900">Fee records</h2><p className="mt-1 text-sm text-slate-600">View and manage student fee status.</p>
        </Link>
      </section>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center gap-2"><Users size={18} className="text-indigo-600" /><h2 className="font-semibold text-slate-900">System status</h2></div><p className="mt-3 text-sm text-slate-600">{summary.message || 'Administrative services are connected.'}</p></div>
    </div>
  );
};

export default AdminDashboardPage;
