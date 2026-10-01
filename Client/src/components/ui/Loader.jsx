export const Loader = ({ text = 'Loading...', fullHeight = false }) => {
  return (
    <div
      className={[
        'flex items-center justify-center gap-3 text-slate-600',
        fullHeight ? 'min-h-screen' : 'min-h-[200px]',
      ].join(' ')}
    >
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-sky-200 border-t-sky-600" />
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
};

export default Loader;
