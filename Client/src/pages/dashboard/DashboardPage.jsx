import { AlertCircle, CalendarDays, CheckCircle2, ClipboardCheck, Plus, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import StatCard from '../../components/common/StatCard.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Loader } from '../../components/ui/Loader.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import authService from '../../services/authService.js';
import { getApiErrorMessage } from '../../services/api.js';
import attendanceService from '../../services/attendanceService.js';
import classService from '../../services/classService.js';

const DashboardPage = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classForm, setClassForm] = useState({ name: '', section: '', classTeacher: '' });
  const [unassignedStudents, setUnassignedStudents] = useState([]);
  const [selectedExistingStudent, setSelectedExistingStudent] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().slice(0, 10));
  const [studentForm, setStudentForm] = useState({ name: '', email: '', password: '', rollNumber: '' });
  const [savingStudent, setSavingStudent] = useState(false);
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const isStaff = user?.role === 'teacher' || user?.role === 'admin';

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user?.role) {
        return;
      }

      try {
        setLoading(true);
        const data = await authService.getDashboardData(user.role);
        setDashboardData(data);
        setError('');
      } catch (apiError) {
        const message = getApiErrorMessage(apiError);
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user?.role]);

  useEffect(() => {
    if (!isStaff) return;

    const requests = [classService.getClasses(), classService.getUnassignedStudents()];
    if (user.role === 'admin') requests.push(classService.getTeachers());

    Promise.all(requests)
      .then(([loadedClasses, pendingStudents, availableTeachers = []]) => {
        setClasses(loadedClasses);
        setUnassignedStudents(pendingStudents);
        setSelectedExistingStudent(pendingStudents[0]?._id || '');
        setTeachers(availableTeachers);
        setClassForm((current) => ({ ...current, classTeacher: current.classTeacher || availableTeachers[0]?._id || '' }));
        setSelectedClassId((currentId) => currentId || loadedClasses[0]?._id || '');
      })
      .catch((apiError) => {
        const message = getApiErrorMessage(apiError);
        setError(message);
        toast.error(message);
      });
  }, [isStaff, user?.role, refreshKey]);

  useEffect(() => {
    if (!isStaff || !selectedClassId) {
      return;
    }

    const loadClassData = async () => {
      try {
        const [loadedStudents, records] = await Promise.all([
          classService.getStudents(selectedClassId),
          attendanceService.getAttendance({ classId: selectedClassId, date: attendanceDate }),
        ]);
        setStudents(loadedStudents);
        setAttendance(Object.fromEntries(
          records.map((record) => [record.student?._id || record.student, record.status])
        ));
      } catch (apiError) {
        const message = getApiErrorMessage(apiError);
        setError(message);
        toast.error(message);
      }
    };

    loadClassData();
  }, [isStaff, selectedClassId, attendanceDate, refreshKey]);

  useEffect(() => {
    if (user?.role !== 'student') return;
    attendanceService.getAttendance()
      .then((records) => setStudents(records))
      .catch((apiError) => {
        const message = getApiErrorMessage(apiError);
        setError(message);
        toast.error(message);
      });
  }, [user?.role]);

  const submitStudent = async (event) => {
    event.preventDefault();
    if (!selectedClassId) return;

    try {
      setSavingStudent(true);
      await classService.addStudent(selectedClassId, studentForm);
      setStudentForm({ name: '', email: '', password: '', rollNumber: '' });
      setRefreshKey((value) => value + 1);
      toast.success('Student added to class');
    } catch (apiError) {
      toast.error(getApiErrorMessage(apiError));
    } finally {
      setSavingStudent(false);
    }
  };

  const submitExistingStudent = async (event) => {
    event.preventDefault();
    if (!selectedClassId || !selectedExistingStudent) return;

    try {
      await classService.enrollStudent(selectedClassId, selectedExistingStudent);
      setRefreshKey((value) => value + 1);
      toast.success('Student enrolled in class');
    } catch (apiError) {
      toast.error(getApiErrorMessage(apiError));
    }
  };

  const submitClass = async (event) => {
    event.preventDefault();
    try {
      const createdClass = await classService.createClass(classForm);
      setSelectedClassId(createdClass._id);
      setClassForm({ name: '', section: '', classTeacher: teachers[0]?._id || '' });
      setRefreshKey((value) => value + 1);
      toast.success('Class created');
    } catch (apiError) {
      toast.error(getApiErrorMessage(apiError));
    }
  };

  const submitAttendance = async (event) => {
    event.preventDefault();
    if (!students.length || students.some((student) => !attendance[student._id])) {
      toast.error('Choose an attendance status for every student first');
      return;
    }

    try {
      setSavingAttendance(true);
      await attendanceService.markAttendance({
        classId: selectedClassId,
        date: attendanceDate,
        attendanceList: students.map((student) => ({ studentId: student._id, status: attendance[student._id] })),
      });
      toast.success('Attendance saved');
    } catch (apiError) {
      toast.error(getApiErrorMessage(apiError));
    } finally {
      setSavingAttendance(false);
    }
  };

  if (loading) {
    return <Loader text="Loading dashboard..." fullHeight />;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700 shadow-sm">
        <div className="flex items-center gap-2">
          <AlertCircle size={18} />
          <strong>Unable to load dashboard data</strong>
        </div>
        <p className="mt-2 text-sm">{error}</p>
      </div>
    );
  }

  const stats = [
    { title: 'Role', value: user?.role || 'Student', description: 'Current access level', accent: 'sky' },
    { title: 'Email', value: user?.email || '—', description: 'Primary account email', accent: 'emerald' },
    { title: 'User ID', value: user?._id ? String(user._id).slice(0, 8) : '—', description: 'System identifier', accent: 'violet' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-500 p-6 text-white shadow-lg shadow-sky-200">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-sky-100">Welcome</p>
            <h1 className="mt-2 text-3xl font-semibold">{user?.name || 'User'}</h1>
          </div>
          <div className="rounded-2xl border border-white/25 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-sky-100">Access</p>
            <p className="mt-2 text-lg font-semibold capitalize">{user?.role || 'student'}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {isStaff ? (
        <section className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">Classroom</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-900">Students and attendance</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <label className="space-y-1 text-sm font-medium text-slate-700">
                Class
                <select
                  value={selectedClassId}
                  onChange={(event) => {
                    setSelectedClassId(event.target.value);
                    setStudents([]);
                    setAttendance({});
                  }}
                  className="block min-w-44 rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/20"
                >
                  <option value="">Select a class</option>
                  {classes.map((classItem) => (
                    <option key={classItem._id} value={classItem._id}>{classItem.name} - {classItem.section}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 text-sm font-medium text-slate-700">
                Attendance date
                <span className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2">
                  <CalendarDays size={16} className="text-slate-500" />
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={(event) => setAttendanceDate(event.target.value)}
                    className="min-w-32 bg-transparent text-slate-900 outline-none"
                  />
                </span>
              </label>
            </div>
          </div>

          {user?.role === 'admin' && (
            <form onSubmit={submitClass} className="grid gap-3 border-b border-slate-200 pb-5 sm:grid-cols-[1fr_0.7fr_1fr_auto] sm:items-end">
              <label className="space-y-1 text-sm font-medium text-slate-700">Class name<input required value={classForm.name} onChange={(event) => setClassForm({ ...classForm, name: event.target.value })} className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal text-slate-900 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/20" /></label>
              <label className="space-y-1 text-sm font-medium text-slate-700">Section<input required value={classForm.section} onChange={(event) => setClassForm({ ...classForm, section: event.target.value })} className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal text-slate-900 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/20" /></label>
              <label className="space-y-1 text-sm font-medium text-slate-700">Class teacher<select required value={classForm.classTeacher} onChange={(event) => setClassForm({ ...classForm, classTeacher: event.target.value })} className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal text-slate-900 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/20"><option value="">Select teacher</option>{teachers.map((teacher) => <option key={teacher._id} value={teacher._id}>{teacher.name} · {teacher.email}</option>)}</select></label>
              <Button type="submit" disabled={!teachers.length}>Create class</Button>
            </form>
          )}

          {!classes.length ? (
            <div className="border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              No classes are assigned to this account yet. Ask an administrator to create a class and assign its teacher.
            </div>
          ) : (
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
              <form onSubmit={submitAttendance} className="min-w-0">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-slate-900">Class roster <span className="font-normal text-slate-500">({students.length})</span></h3>
                  <Button type="submit" disabled={!students.length || savingAttendance}>
                    <ClipboardCheck size={17} className="mr-2" />
                    {savingAttendance ? 'Saving...' : 'Save attendance'}
                  </Button>
                </div>
                <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                  <table className="w-full min-w-[620px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                      <tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">Student ID</th><th className="px-4 py-3">Roll no.</th><th className="px-4 py-3">Attendance</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {students.map((student) => (
                        <tr key={student._id}>
                          <td className="px-4 py-3"><p className="font-medium text-slate-900">{student.name}</p><p className="text-xs text-slate-500">{student.email}</p></td>
                          <td className="px-4 py-3 text-slate-600">{student.studentId || '—'}</td>
                          <td className="px-4 py-3 text-slate-600">{student.rollNumber || '—'}</td>
                          <td className="px-4 py-3">
                            <select
                              aria-label={`Attendance for ${student.name}`}
                              value={attendance[student._id] || ''}
                              onChange={(event) => setAttendance((current) => ({ ...current, [student._id]: event.target.value }))}
                              className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-slate-900 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/20"
                            >
                              <option value="">Choose status</option>
                              <option value="present">Present</option>
                              <option value="absent">Absent</option>
                              <option value="Leave">Leave</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                      {!students.length && <tr><td colSpan="4" className="px-4 py-10 text-center text-slate-500">No students in this class yet.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </form>

              <div className="h-fit space-y-4 border-t border-slate-200 pt-5 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
                <div>
                  <h3 className="font-semibold text-slate-900">Add a student</h3>
                  <p className="mt-1 text-sm text-slate-500">Enroll an existing account or create a new student login.</p>
                </div>
                <form onSubmit={submitExistingStudent} className="space-y-2 border-b border-slate-200 pb-4">
                  <label className="block space-y-1.5 text-sm font-medium text-slate-700">Existing unassigned student
                    <select value={selectedExistingStudent} onChange={(event) => setSelectedExistingStudent(event.target.value)} disabled={!unassignedStudents.length} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal text-slate-900 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/20">
                      {!unassignedStudents.length && <option value="">No unassigned students</option>}
                      {unassignedStudents.map((student) => <option key={student._id} value={student._id}>{student.name} · {student.email}</option>)}
                    </select>
                  </label>
                  <Button type="submit" variant="secondary" disabled={!selectedExistingStudent} className="w-full">Enroll existing student</Button>
                </form>
                <form onSubmit={submitStudent} className="space-y-4">
                <label className="block space-y-1.5 text-sm font-medium text-slate-700">Full name<input required minLength="2" value={studentForm.name} onChange={(event) => setStudentForm({ ...studentForm, name: event.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-slate-900 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/20" /></label>
                <label className="block space-y-1.5 text-sm font-medium text-slate-700">Email<input required type="email" value={studentForm.email} onChange={(event) => setStudentForm({ ...studentForm, email: event.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-slate-900 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/20" /></label>
                <label className="block space-y-1.5 text-sm font-medium text-slate-700">Temporary password<input required minLength="6" type="password" value={studentForm.password} onChange={(event) => setStudentForm({ ...studentForm, password: event.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-slate-900 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/20" /></label>
                <label className="block space-y-1.5 text-sm font-medium text-slate-700">Roll number <span className="font-normal text-slate-500">(optional)</span><input value={studentForm.rollNumber} onChange={(event) => setStudentForm({ ...studentForm, rollNumber: event.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-slate-900 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/20" /></label>
                <Button type="submit" disabled={savingStudent} className="w-full">
                  <Plus size={17} className="mr-2" />{savingStudent ? 'Adding student...' : 'Add student'}
                </Button>
                </form>
              </div>
            </div>
          )}
        </section>
      ) : (
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-4 text-slate-900">
            <ClipboardCheck className="h-5 w-5 text-emerald-600" />
            <h2 className="text-xl font-semibold">My attendance</h2>
          </div>
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">Class</th><th className="px-4 py-3">Status</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((record) => <tr key={record._id}><td className="px-4 py-3 text-slate-700">{new Date(record.date).toLocaleDateString()}</td><td className="px-4 py-3 text-slate-700">{record.classId?.name || '—'} {record.classId?.section || ''}</td><td className="px-4 py-3 font-medium capitalize text-slate-900">{record.status}</td></tr>)}
                {!students.length && <tr><td colSpan="3" className="px-4 py-10 text-center text-slate-500">No attendance records yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-slate-900">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <h2 className="text-xl font-semibold">System status</h2>
          </div>
          <p className="mt-4 text-base text-slate-600">
            {dashboardData?.message || 'Your dashboard is ready and connected to the backend API.'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-slate-900">
            <UserRound className="h-5 w-5 text-sky-500" />
            <h2 className="text-xl font-semibold">Quick profile</h2>
          </div>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li><span className="font-medium text-slate-900">Name:</span> {user?.name || '—'}</li>
            <li><span className="font-medium text-slate-900">Role:</span> {user?.role || '—'}</li>
            <li><span className="font-medium text-slate-900">Email:</span> {user?.email || '—'}</li>
          </ul>
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;
