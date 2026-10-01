export const StatCard = ({ title, value, description, accent = 'sky' }) => {
  const accentStyles = {
    sky: 'bg-sky-50 text-sky-900 border-sky-100',
    emerald: 'bg-emerald-50 text-emerald-900 border-emerald-100',
    amber: 'bg-amber-50 text-amber-900 border-amber-100',
    violet: 'bg-violet-50 text-violet-900 border-violet-100',
  };

  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${accentStyles[accent] || accentStyles.sky}`}>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h3 className="mt-3 text-3xl font-semibold text-slate-900">{value}</h3>
      {description && <p className="mt-2 text-sm text-slate-600">{description}</p>}
    </div>
  );
};

export default StatCard;
