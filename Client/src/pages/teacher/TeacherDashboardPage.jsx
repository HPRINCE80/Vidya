import { CalendarCheck, Users, WalletCards } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/common/StatCard.jsx';
import { Loader } from '../../components/ui/Loader.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import authService from '../../services/authService.js';
import classService from '../../services/classService.js';
import { getApiErrorMessage } from '../../services/api.js';

const TeacherDashboardPage = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [studentCount, setStudentCount] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([authService.getDashboardData('teacher'), classService.getClasses()])
      .then(async ([dashboard, assignedClasses]) => {
        const students = assignedClasses[0] ? await classService.getStudents(assignedClasses[0]._id) : [];
        setClasses(assignedClasses);
        setStudentCount(students.length);
        setMessage(dashboard.message);
      })
      .catch((apiError) => setError(getApiErrorMessage(apiError)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader text="Loading teacher workspace..." fullHeight />;
  if (error) return <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">{error}</div>;

  return (
    <div className="space-y-6">
      <header className="rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 p-6 text-white shadow-lg shadow-emerald-200">
        <p className="text-sm uppercase tracking-[0.2em] text-emerald-100">Teaching workspace</p>
        <h1 className="mt-2 text-3xl font-semibold">Welcome, {user?.name || 'Teacher'}</h1>
        <p className="mt-2 text-emerald-100">Your assigned classes, rosters, and attendance actions are gathered here.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Assigned classes" value={classes.length} description="Classes assigned to you" accent="emerald" />
        <StatCard title="Students" value={studentCount} description="Students in your first class" accent="sky" />
        <StatCard title="Account" value="Active" description={message || 'Teacher access enabled'} accent="violet" />
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <Link to="/teacher/attendance" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-emerald-300"><CalendarCheck className="text-emerald-600" /><h2 className="mt-4 font-semibold">Take attendance</h2><p className="mt-1 text-sm text-slate-600">Choose an assigned class and record today&apos;s status.</p></Link>
        <Link to="/teacher/students" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-emerald-300"><Users className="text-sky-600" /><h2 className="mt-4 font-semibold">View my students</h2><p className="mt-1 text-sm text-slate-600">See rosters scoped to your assigned classes.</p></Link>
        <Link to="/teacher/fees" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-emerald-300"><WalletCards className="text-amber-600" /><h2 className="mt-4 font-semibold">Fee information</h2><p className="mt-1 text-sm text-slate-600">View fee information permitted by the API.</p></Link>
      </section>
    </div>
  );
};

export default TeacherDashboardPage;
