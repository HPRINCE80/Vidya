import { Save, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader } from '../../components/ui/Loader.jsx';
import userService from '../../services/userService.js';
import { getApiErrorMessage } from '../../services/api.js';

const StudentProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [state, setState] = useState({ loading: true, saving: false, error: '' });

  useEffect(() => {
    userService.getProfile()
      .then((data) => {
        setProfile(data);
        setForm({ name: data.name || '', phone: data.phone || '' });
      })
      .catch((error) => setState((current) => ({ ...current, error: getApiErrorMessage(error) })))
      .finally(() => setState((current) => ({ ...current, loading: false })));
  }, []);

  const updateField = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    if (form.name.trim().length < 2) {
      toast.error('Name must be at least 2 characters');
      return;
    }

    try {
      setState((current) => ({ ...current, saving: true, error: '' }));
      const updatedProfile = await userService.updateProfile({ name: form.name.trim(), phone: form.phone.trim() });
      setProfile(updatedProfile);
      setForm({ name: updatedProfile.name || '', phone: updatedProfile.phone || '' });
      toast.success('Profile updated');
    } catch (error) {
      const message = getApiErrorMessage(error);
      setState((current) => ({ ...current, error: message }));
      toast.error(message);
    } finally {
      setState((current) => ({ ...current, saving: false }));
    }
  };

  if (state.loading) return <Loader text="Loading your profile..." fullHeight />;
  if (state.error && !profile) return <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">{state.error}</div>;

  return (
    <section className="max-w-3xl space-y-5">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-sky-600">Personal account</p>
        <h1 className="mt-1 text-3xl font-semibold text-slate-900">My profile</h1>
        <p className="mt-2 text-slate-600">Update your contact details. Your role, email, and student identity are managed by the school.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-5"><div className="rounded-xl bg-sky-100 p-2 text-sky-700"><UserRound size={20} /></div><div><h2 className="font-semibold text-slate-900">Account details</h2><p className="text-sm text-slate-500">Student information</p></div></div>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <label className="block space-y-1.5 text-sm font-medium text-slate-700">Full name<input value={form.name} onChange={updateField('name')} minLength="2" maxLength="120" required className="w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-slate-900 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/20" /></label>
          <label className="block space-y-1.5 text-sm font-medium text-slate-700">Phone<input value={form.phone} onChange={updateField('phone')} maxLength="30" className="w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-slate-900 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/20" /></label>
          <div className="grid gap-4 sm:grid-cols-2"><div><p className="text-sm font-medium text-slate-700">Email</p><p className="mt-1 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">{profile?.email || '—'}</p></div><div><p className="text-sm font-medium text-slate-700">Student ID</p><p className="mt-1 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">{profile?.studentId || '—'}</p></div></div>
          {state.error && <p className="text-sm text-rose-600">{state.error}</p>}
          <button type="submit" disabled={state.saving} className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"><Save size={17} />{state.saving ? 'Saving...' : 'Save changes'}</button>
        </form>
      </div>
    </section>
  );
};

export default StudentProfilePage;
