/**
 * Centered loading spinner with optional label.
 */
export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center gap-3 animate-fade-in">
      <div className="w-10 h-10 border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin" />
      <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
    </div>
  );
}
