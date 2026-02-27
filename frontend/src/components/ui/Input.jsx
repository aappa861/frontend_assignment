/**
 * Reusable text input / textarea with label and error.
 */
export default function Input({
  label,
  error,
  type = 'text',
  as = 'input',
  className = '',
  ...rest
}) {
  const base =
    'w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-500';

  const content = (
    <>
      {as === 'textarea' ? (
        <textarea className={`${base} resize-none ${className}`} {...rest} />
      ) : (
        <input type={type} className={`${base} ${className}`} {...rest} />
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </>
  );

  if (!label) return content;

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        {label}
      </label>
      {content}
    </div>
  );
}
