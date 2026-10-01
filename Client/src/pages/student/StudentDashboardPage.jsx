import { CalendarCheck, CircleDollarSign, Megaphone, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/common/StatCard.jsx';
import { Loader } from '../../components/ui/Loader.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import attendanceService from '../../services/attendanceService.js';
import authService from '../../services/authService.js';
import { getApiErrorMessage } from '../../services/api.js';

const StudentDashboardPage = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([authService.getDashboardData('student'), attendanceService.getAttendance()])
      .then(([dashboard, attendance]) => { setMessage(dashboard.message); setRecords(attendance); })
      .catch((apiError) => setError(getApiErrorMessage(apiError)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader text="Loading student dashboard..." fullHeight />;
  if (error) return <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">{error}</div>;

  const presentCount = records.filter((record) => record.status === 'present').length;
  const attendanceRate = records.length ? `${Math.round((presentCount / records.length) * 100)}%` : '—';

  return (
    <div className="space-y-6">
      <header className="rounded-3xl bg-gradient-to-r from-sky-700 via-cyan-600 to-teal-500 p-6 text-white shadow-lg shadow-cyan-200">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-100">Student workspace</p>
        <h1 className="mt-2 text-3xl font-semibold">Hello, {user?.name || 'Student'}</h1>
        <p className="mt-2 text-cyan-100">Your personal academic information, attendance, and account details.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Attendance rate" value={attendanceRate} description="Based on recorded attendance" accent="emerald" />
        <StatCard title="Attendance records" value={records.length} description="Records available to you" accent="sky" />
        <StatCard title="Account" value="Active" description={message || 'Student access enabled'} accent="violet" />
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <Link to="/student/attendance" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-sky-300"><CalendarCheck className="text-sky-600" /><h2 className="mt-4 font-semibold">My attendance</h2><p className="mt-1 text-sm text-slate-600">Review your attendance history.</p></Link>
        <Link to="/student/fees" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-sky-300"><CircleDollarSign className="text-amber-600" /><h2 className="mt-4 font-semibold">My fees</h2><p className="mt-1 text-sm text-slate-600">View your own payment records.</p></Link>
        <Link to="/student/profile" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-sky-300"><UserRound className="text-violet-600" /><h2 className="mt-4 font-semibold">My profile</h2><p className="mt-1 text-sm text-slate-600">Check your account information.</p></Link>
      </section>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center gap-2"><Megaphone size={18} className="text-sky-600" /><h2 className="font-semibold">Notices</h2></div><p className="mt-3 text-sm text-slate-600">No notice feed endpoint is currently exposed by the backend.</p></div>
    </div>
  );
};

export default StudentDashboardPage;
