import { ShieldAlert } from 'lucide-react';

const RoleFeaturePage = ({ title, description, scope = 'This feature is not exposed by the current backend yet.' }) => (
  <section className="max-w-3xl space-y-5">
    <div><p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">Role workspace</p><h1 className="mt-1 text-3xl font-semibold text-slate-900">{title}</h1><p className="mt-2 text-slate-600">{description}</p></div>
    <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900"><ShieldAlert className="mt-0.5 shrink-0" size={20} /><p className="text-sm">{scope}</p></div>
  </section>
);

export default RoleFeaturePage;
