import { Plus, RefreshCw, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader } from '../../components/ui/Loader.jsx';
import adminService from '../../services/adminService.js';
import classService from '../../services/classService.js';
import { getApiErrorMessage } from '../../services/api.js';

const emptyForm = { name: '', email: '', password: '', phone: '', subject: '' };

const AdminTeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [state, setState] = useState({ loading: true, saving: false, error: '' });

  const loadTeachers = async () => {
    try {
      setState((current) => ({ ...current, loading: true, error: '' }));
      setTeachers(await classService.getTeachers());
    } catch (error) {
      setState((current) => ({ ...current, error: getApiErrorMessage(error) }));
    } finally {
      setState((current) => ({ ...current, loading: false }));
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const updateField = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    try {
      setState((current) => ({ ...current, saving: true, error: '' }));
      await adminService.createTeacher({ ...form, name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), subject: form.subject.trim() });
      setForm(emptyForm);
      toast.success('Teacher account created');
      await loadTeachers();
    } catch (error) {
      const message = getApiErrorMessage(error);
      setState((current) => ({ ...current, error: message }));
      toast.error(message);
    } finally {
      setState((current) => ({ ...current, saving: false }));
    }
  };

  return (
    <section className="space-y-6">
      <div><p className="text-sm font-medium uppercase tracking-[0.16em] text-violet-600">People management</p><h1 className="mt-1 text-3xl font-semibold text-slate-900">Teachers</h1><p className="mt-2 text-slate-600">Create and review teacher accounts. Only administrators can create privileged staff accounts.</p></div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-5"><div className="flex items-center gap-2"><Users size={19} className="text-violet-600" /><h2 className="font-semibold text-slate-900">Teacher accounts</h2></div><button type="button" onClick={loadTeachers} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900" title="Refresh teachers"><RefreshCw size={17} /></button></div>
          {state.loading ? <Loader text="Loading teachers..." /> : state.error && !teachers.length ? <p className="p-5 text-sm text-rose-600">{state.error}</p> : <div className="overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-3">Name</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Subject</th></tr></thead><tbody className="divide-y divide-slate-100">{teachers.map((teacher) => <tr key={teacher._id}><td className="px-5 py-3 font-medium text-slate-900">{teacher.name}</td><td className="px-5 py-3 text-slate-600">{teacher.email}</td><td className="px-5 py-3 text-slate-600">{teacher.subject || '—'}</td></tr>)}{!teachers.length && <tr><td colSpan="3" className="px-5 py-10 text-center text-slate-500">No teacher accounts yet.</td></tr>}</tbody></table></div>}
        </div>

        <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><Plus size={19} className="text-violet-600" /><h2 className="font-semibold text-slate-900">Add teacher</h2></div><div className="mt-5 space-y-4"><label className="block space-y-1.5 text-sm font-medium text-slate-700">Full name<input required minLength="2" maxLength="120" value={form.name} onChange={updateField('name')} className="w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-slate-900 focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-600/20" /></label><label className="block space-y-1.5 text-sm font-medium text-slate-700">Email<input required type="email" value={form.email} onChange={updateField('email')} className="w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-slate-900 focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-600/20" /></label><label className="block space-y-1.5 text-sm font-medium text-slate-700">Temporary password<input required minLength="6" type="password" value={form.password} onChange={updateField('password')} className="w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-slate-900 focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-600/20" /></label><label className="block space-y-1.5 text-sm font-medium text-slate-700">Phone <span className="font-normal text-slate-500">(optional)</span><input value={form.phone} onChange={updateField('phone')} maxLength="30" className="w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-slate-900 focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-600/20" /></label><label className="block space-y-1.5 text-sm font-medium text-slate-700">Subject <span className="font-normal text-slate-500">(optional)</span><input value={form.subject} onChange={updateField('subject')} maxLength="120" className="w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-slate-900 focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-600/20" /></label>{state.error && <p className="text-sm text-rose-600">{state.error}</p>}<button type="submit" disabled={state.saving} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60">{state.saving ? 'Creating...' : 'Create teacher account'}</button></div></form>
      </div>
    </section>
  );
};

export default AdminTeachersPage;
