import { Save, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader } from '../../components/ui/Loader.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import userService from '../../services/userService.js';
import { getApiErrorMessage } from '../../services/api.js';

const AccountProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [state, setState] = useState({ loading: true, saving: false, error: '' });
  useEffect(() => { userService.getProfile().then((data) => { setProfile(data); setForm({ name: data.name || '', phone: data.phone || '' }); }).catch((error) => setState((current) => ({ ...current, error: getApiErrorMessage(error) }))).finally(() => setState((current) => ({ ...current, loading: false }))); }, []);
  const submit = async (event) => { event.preventDefault(); try { setState((current) => ({ ...current, saving: true, error: '' })); const updated = await userService.updateProfile({ name: form.name.trim(), phone: form.phone.trim() }); setProfile(updated); toast.success('Profile updated'); } catch (error) { const message = getApiErrorMessage(error); setState((current) => ({ ...current, error: message })); toast.error(message); } finally { setState((current) => ({ ...current, saving: false })); } };
  if (state.loading) return <Loader text="Loading your profile..." fullHeight />;
  if (state.error && !profile) return <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">{state.error}</div>;
  return <section className="max-w-3xl space-y-5"><div><p className="text-sm font-medium uppercase tracking-[0.16em] text-emerald-600">Personal account</p><h1 className="mt-1 text-3xl font-semibold text-slate-900">My profile</h1><p className="mt-2 text-slate-600">Update your contact details. Your role and account identity are managed by the school.</p></div><form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center gap-3 border-b border-slate-100 pb-5"><div className="rounded-xl bg-emerald-100 p-2 text-emerald-700"><UserRound size={20} /></div><div><h2 className="font-semibold text-slate-900">{user?.role === 'teacher' ? 'Teacher' : 'Account'} details</h2><p className="text-sm text-slate-500">{profile?.email || '—'}</p></div></div><div className="mt-5 space-y-4"><label className="block space-y-1.5 text-sm font-medium text-slate-700">Full name<input required minLength="2" maxLength="120" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-slate-900" /></label><label className="block space-y-1.5 text-sm font-medium text-slate-700">Phone<input maxLength="30" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-slate-900" /></label>{state.error && <p className="text-sm text-rose-600">{state.error}</p>}<button type="submit" disabled={state.saving} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"><Save size={17} />{state.saving ? 'Saving...' : 'Save changes'}</button></div></form></section>;
};

export default AccountProfilePage;
