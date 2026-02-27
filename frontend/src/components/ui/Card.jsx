/**
 * Reusable card container with optional padding and title.
 */
export default function Card({
  title,
  children,
  className = '',
  padding = true,
}) {
  return (
    <section
      className={`rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm transition-colors duration-200 ${padding ? 'p-6' : ''} ${className}`}
    >
      {title && (
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
