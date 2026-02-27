import { Loader, Badge, Button } from '../ui';

const STATUS_LABELS = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

export default function TaskList({
  tasks,
  loading,
  onEdit,
  onDelete,
  deleteLoadingId,
}) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader label="Loading tasks..." />
      </div>
    );
  }

  if (!tasks?.length) {
    return (
      <p className="text-center text-slate-500 dark:text-slate-400 py-8 animate-fade-in">
        No tasks yet. Create one above.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-slate-200 dark:divide-slate-700">
      {tasks.map((task, i) => (
        <li
          key={task._id}
          className="py-4 px-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200 animate-fade-in"
          style={{ animationDelay: `${i * 30}ms` }}
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-slate-900 dark:text-white">
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
              <Badge variant={task.status} className="mt-2">
                {STATUS_LABELS[task.status] || task.status}
              </Badge>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(task)}
                className="!p-1.5 text-primary-600 dark:text-primary-400"
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(task._id)}
                disabled={deleteLoadingId === task._id}
                className="!p-1.5 text-red-600 dark:text-red-400 hover:!bg-red-50 dark:hover:!bg-red-900/20"
              >
                {deleteLoadingId === task._id ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
