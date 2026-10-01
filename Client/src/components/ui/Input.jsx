export const Input = ({
  label,
  id,
  type = 'text',
  placeholder,
  error,
  register,
  required = false,
  ...props
}) => {
  const fieldProps = register ? register(id, { required }) : {};

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-200">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={[
          'w-full rounded-xl border bg-slate-900/50 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-400 transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30',
          error ? 'border-rose-500' : 'border-slate-700',
        ].join(' ')}
        {...fieldProps}
        {...props}
      />
      {error && <p className="text-sm text-rose-300">{error}</p>}
    </div>
  );
};

export default Input;
