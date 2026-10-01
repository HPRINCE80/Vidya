import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),transparent_45%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-slate-950/30 backdrop-blur-sm lg:grid-cols-[1.1fr_0.9fr]">
          <div className="hidden items-center justify-center bg-slate-900/70 p-8 lg:flex">
            <div className="max-w-md space-y-6">
              <div className="inline-flex items-center rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-sky-200">
                School Management
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold leading-tight text-white">
                  Manage learning, attendance, and performance in one place.
                </h1>
                <p className="text-base text-slate-300">
                  Designed for schools and colleges to keep administrators, teachers, and students aligned.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: 'Classes', value: '12+' },
                  { label: 'Faculty', value: '150+' },
                  { label: 'Students', value: '2k+' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-2xl font-semibold text-white">{item.value}</div>
                    <div className="mt-1 text-xs text-slate-300">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full bg-slate-950/90 p-6 sm:p-8 lg:p-10">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
