import { useEffect, useState } from 'react';
import { Loader } from '../../components/ui/Loader.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import attendanceService from '../../services/attendanceService.js';
import { getApiErrorMessage } from '../../services/api.js';

const StudentAttendancePage = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [state, setState] = useState({ loading: true, error: '' });

  useEffect(() => {
    attendanceService.getAttendance()
      .then(setRecords)
      .catch((error) => setState({ loading: false, error: getApiErrorMessage(error) }))
      .finally(() => setState((current) => ({ ...current, loading: false })));
  }, []);

  if (state.loading) return <Loader text="Loading your attendance..." fullHeight />;
  if (state.error) return <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">{state.error}</div>;

  return (
    <section className="space-y-5">
      <div><p className="text-sm font-medium uppercase tracking-[0.16em] text-sky-600">Personal record</p><h1 className="mt-1 text-3xl font-semibold text-slate-900">My attendance</h1><p className="mt-2 text-slate-600">Only attendance records belonging to {user?.name || 'you'} are shown.</p></div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm"><table className="w-full min-w-[560px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">Class</th><th className="px-4 py-3">Status</th></tr></thead><tbody className="divide-y divide-slate-100">{records.map((record) => <tr key={record._id}><td className="px-4 py-3">{new Date(record.date).toLocaleDateString()}</td><td className="px-4 py-3">{record.classId?.name || '—'} {record.classId?.section || ''}</td><td className="px-4 py-3 font-medium capitalize">{record.status}</td></tr>)}{!records.length && <tr><td colSpan="3" className="px-4 py-10 text-center text-slate-500">No attendance records yet.</td></tr>}</tbody></table></div>
    </section>
  );
};

export default StudentAttendancePage;
