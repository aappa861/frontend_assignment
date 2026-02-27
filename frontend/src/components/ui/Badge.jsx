/**
 * Status badge with semantic colors. variant: todo | in_progress | done | default
 */
const VARIANT_CLASSES = {
  todo: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  in_progress:
    'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  done: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  default: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
};

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${VARIANT_CLASSES[variant] || VARIANT_CLASSES.default} ${className}`}
    >
      {children}
    </span>
  );
}
