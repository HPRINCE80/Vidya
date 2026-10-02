import { useEffect, useState } from 'react';
import { Loader } from '../../components/ui/Loader.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import attendanceService from '../../services/attendanceService.js';
import classService from '../../services/classService.js';
import { getApiErrorMessage } from '../../services/api.js';

const AttendancePage = () => {
  const { user } = useAuth();
  const isTeacher = user?.role === 'teacher';
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [roster, setRoster] = useState([]);
  const [records, setRecords] = useState([]);
  const [classId, setClassId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filtersLoading, setFiltersLoading] = useState(true);
  const [recordsLoading, setRecordsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const loadFilters = async () => {
      try {
        const [loadedClasses, loadedStudents] = await Promise.all([
          classService.getClasses(),
          isTeacher ? Promise.resolve([]) : classService.getStudents(),
        ]);
        if (!active) return;
        setClasses(loadedClasses);
        setStudents(loadedStudents);
      } catch (apiError) {
        if (active) setError(getApiErrorMessage(apiError));
      } finally {
        if (active) setFiltersLoading(false);
      }
    };
    loadFilters();
    return () => { active = false; };
  }, [isTeacher]);

  useEffect(() => {
    if (!isTeacher || !classId) {
      return undefined;
    }
    let active = true;
    classService.getStudents(classId)
      .then((classStudents) => { if (active) setRoster(classStudents); })
      .catch((apiError) => { if (active) setError(getApiErrorMessage(apiError)); });
    return () => { active = false; };
  }, [isTeacher, classId]);

  useEffect(() => {
    if (filtersLoading || !user?.role) return undefined;
    let active = true;
    const params = {};
    if (classId) params.classId = classId;
    if (studentId) params.studentId = studentId;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    attendanceService.getAttendance(params)
      .then((attendanceRecords) => { if (active) setRecords(attendanceRecords); })
      .catch((apiError) => { if (active) setError(getApiErrorMessage(apiError)); })
      .finally(() => { if (active) setRecordsLoading(false); });
    return () => { active = false; };
  }, [filtersLoading, user?.role, classId, studentId, startDate, endDate]);

  const visibleStudents = classId
    ? students.filter((student) => String(student.classId?._id || student.classId) === classId)
    : students;

  if (filtersLoading) return <Loader text="Loading attendance filters..." fullHeight />;

  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-sky-600">Classroom records</p>
        <h1 className="mt-1 text-3xl font-semibold text-slate-900">Attendance</h1>
        <p className="mt-2 text-slate-600">{isTeacher ? 'Attendance for your assigned classes.' : 'Attendance across all students and classes.'}</p>
      </div>

      <div className="flex flex-wrap items-end gap-3 border-b border-slate-200 pb-5">
        <label className="space-y-1 text-sm font-medium text-slate-700">
          Class
          <select value={classId} onChange={(event) => { setRecordsLoading(true); setError(''); setRoster([]); setClassId(event.target.value); setStudentId(''); }} className="block min-w-44 rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/20">
            <option value="">{isTeacher ? 'All assigned classes' : 'All classes'}</option>
            {classes.map((classItem) => <option key={classItem._id} value={classItem._id}>{classItem.name} - {classItem.section}</option>)}
          </select>
        </label>
        {!isTeacher && (
          <label className="space-y-1 text-sm font-medium text-slate-700">
            Student
            <select value={studentId} onChange={(event) => { setRecordsLoading(true); setError(''); setStudentId(event.target.value); }} className="block min-w-52 rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/20">
              <option value="">All students</option>
              {visibleStudents.map((student) => <option key={student._id} value={student._id}>{student.name}{student.studentId ? ` · ${student.studentId}` : ''}</option>)}
            </select>
          </label>
        )}
        <label className="space-y-1 text-sm font-medium text-slate-700">From date<input type="date" value={startDate} max={endDate || undefined} onChange={(event) => { setRecordsLoading(true); setError(''); setStartDate(event.target.value); }} className="block rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/20" /></label>
        <label className="space-y-1 text-sm font-medium text-slate-700">To date<input type="date" value={endDate} min={startDate || undefined} onChange={(event) => { setRecordsLoading(true); setError(''); setEndDate(event.target.value); }} className="block rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/20" /></label>
      </div>

      {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</div>}

      {isTeacher && classId && (
        <div className="space-y-2">
          <h2 className="font-semibold text-slate-900">Students in selected class <span className="font-normal text-slate-500">({roster.length})</span></h2>
          {!roster.length ? <p className="text-sm text-slate-500">No students are enrolled in this class.</p> : (
            <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
              {roster.map((student) => <li key={student._id} className="border-b border-slate-100 py-2 text-sm"><span className="font-medium text-slate-900">{student.name}</span><span className="ml-2 text-slate-500">{student.studentId || student.rollNumber || ''}</span></li>)}
            </ul>
          )}
        </div>
      )}

      {recordsLoading ? <Loader text="Loading attendance records..." /> : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">Student ID</th><th className="px-4 py-3">Class</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Status</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((record) => <tr key={record._id}><td className="px-4 py-3 font-medium text-slate-900">{record.student?.name || '—'}</td><td className="px-4 py-3 text-slate-600">{record.student?.studentId || record.student?.rollNumber || '—'}</td><td className="px-4 py-3 text-slate-600">{record.classId?.name || '—'} {record.classId?.section || ''}</td><td className="px-4 py-3 text-slate-700">{new Date(record.date).toLocaleDateString()}</td><td className="px-4 py-3 font-medium capitalize text-slate-900">{record.status}</td></tr>)}
              {!records.length && <tr><td colSpan="5" className="px-4 py-10 text-center text-slate-500">No attendance records found for these filters.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default AttendancePage;