/**
 * Reusable select with label. options: [{ value, label }]
 */
export default function Select({ label, options = [], error, className = '', ...rest }) {
  const base =
    'w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all duration-200';

  const content = (
    <>
      <select className={`${base} ${className}`} {...rest}>
        {options.map((opt) => (
          <option key={opt.value ?? 'all'} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
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
