import { useEffect, useState } from 'react';
import { Loader } from '../../components/ui/Loader.jsx';
import classService from '../../services/classService.js';
import { getApiErrorMessage } from '../../services/api.js';

const AdminStudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [state, setState] = useState({ loading: true, error: '' });
  useEffect(() => { classService.getStudents().then(setStudents).catch((error) => setState({ loading: false, error: getApiErrorMessage(error) })).finally(() => setState((current) => ({ ...current, loading: false }))); }, []);
  if (state.loading) return <Loader text="Loading students..." fullHeight />;
  if (state.error) return <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">{state.error}</div>;
  return <section className="space-y-5"><div><p className="text-sm font-medium uppercase tracking-[0.16em] text-violet-600">People management</p><h1 className="mt-1 text-3xl font-semibold text-slate-900">Students</h1><p className="mt-2 text-slate-600">All enrolled student accounts and their current class assignments.</p></div><div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm"><table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-3">Student</th><th className="px-5 py-3">Student ID</th><th className="px-5 py-3">Roll number</th><th className="px-5 py-3">Class</th></tr></thead><tbody className="divide-y divide-slate-100">{students.map((student) => <tr key={student._id}><td className="px-5 py-3"><p className="font-medium text-slate-900">{student.name}</p><p className="text-xs text-slate-500">{student.email}</p></td><td className="px-5 py-3 text-slate-600">{student.studentId || '—'}</td><td className="px-5 py-3 text-slate-600">{student.rollNumber || '—'}</td><td className="px-5 py-3 text-slate-600">{student.classId?.name || 'Unassigned'} {student.classId?.section || ''}</td></tr>)}{!students.length && <tr><td colSpan="4" className="px-5 py-10 text-center text-slate-500">No students found.</td></tr>}</tbody></table></div></section>;
};

export default AdminStudentsPage;
