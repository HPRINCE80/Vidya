import { GraduationCap, KeyRound, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const roles = [
  { title: 'Student', description: 'Create your student account.', to: '/register/student', icon: GraduationCap, color: 'sky' },
  { title: 'Teacher', description: 'Register with a school-issued code.', to: '/register/teacher', icon: KeyRound, color: 'emerald' },
  { title: 'Admin', description: 'Register with an administrator code.', to: '/register/admin', icon: ShieldCheck, color: 'violet' },
];

const styles = {
  sky: { card: 'border-sky-400/30', icon: 'text-sky-300', link: 'text-sky-300' },
  emerald: { card: 'border-emerald-400/30', icon: 'text-emerald-300', link: 'text-emerald-300' },
  violet: { card: 'border-violet-400/30', icon: 'text-violet-300', link: 'text-violet-300' },
};

const RegisterRoleSelectPage = () => (
  <div className="mx-auto w-full max-w-2xl">
    <div className="mb-8 text-center"><p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-300">SchoolOS</p><h2 className="mt-3 text-3xl font-semibold text-white">Choose your account type</h2><p className="mt-2 text-slate-300">Select the registration path that matches your role.</p></div>
    <div className="grid gap-4 sm:grid-cols-3">
      {roles.map(({ title, description, to, icon: Icon, color }) => (
        <Link key={to} to={to} className={`group rounded-2xl border ${styles[color].card} bg-white/5 p-5 transition hover:-translate-y-1 hover:bg-white/10`}>
          <Icon className={styles[color].icon} size={28} />
          <h3 className="mt-5 font-semibold text-white">{title}</h3>
          <p className="mt-2 text-sm leading-5 text-slate-300">{description}</p>
          <span className={`mt-5 inline-flex text-sm font-medium ${styles[color].link}`}>Register <span aria-hidden="true" className="ml-1 transition group-hover:translate-x-1">-&gt;</span></span>
        </Link>
      ))}
    </div>
    <p className="mt-8 text-center text-sm text-slate-300">Already have an account? <Link to="/login" className="font-medium text-sky-300 hover:text-sky-200">Sign in</Link></p>
  </div>
);

export default RegisterRoleSelectPage;