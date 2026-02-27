import { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import Navbar from '../components/layout/Navbar';
import TaskForm from '../components/tasks/TaskForm';
import TaskList from '../components/tasks/TaskList';
import { Button, Card, Select, Loader } from '../components/ui';
import { useDebounce } from '../hooks/useDebounce';
import { userAPI, taskAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

export default function Dashboard() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [tasksLoading, setTasksLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const searchDebounce = useDebounce(search, 300);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  const fetchProfile = useCallback(async () => {
    setProfileLoading(true);
    try {
      const { data } = await userAPI.getMe();
      setProfile(data);
      updateUser(data);
    } catch {
      setProfile(user ? { name: user.name, email: user.email } : null);
    } finally {
      setProfileLoading(false);
    }
  }, [updateUser]);

  const fetchTasks = useCallback(async () => {
    setTasksLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (statusFilter) params.status = statusFilter;
      if (searchDebounce) params.search = searchDebounce;
      const { data } = await taskAPI.getTasks(params);
      setTasks(data.tasks);
      setPagination((prev) => ({
        ...prev,
        ...data.pagination,
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load tasks');
      setTasks([]);
    } finally {
      setTasksLoading(false);
    }
  }, [pagination.page, pagination.limit, statusFilter, searchDebounce]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const didMountRef = useRef(false);
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [statusFilter, searchDebounce]);

  const handleCreateTask = async (payload) => {
    setFormLoading(true);
    try {
      await taskAPI.createTask(payload);
      toast.success('Task created');
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateTask = async (payload) => {
    if (!editingTask) return;
    setFormLoading(true);
    try {
      await taskAPI.updateTask(editingTask._id, payload);
      toast.success('Task updated');
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    setDeleteLoadingId(id);
    try {
      await taskAPI.deleteTask(id);
      toast.success('Task deleted');
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete task');
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-8 animate-fade-in">
          <Card title="Your profile">
            {profileLoading ? (
              <Loader />
            ) : profile ? (
              <div className="text-slate-600 dark:text-slate-400">
                <p>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    Name:
                  </span>{' '}
                  {profile.name}
                </p>
                <p className="mt-1">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    Email:
                  </span>{' '}
                  {profile.email}
                </p>
              </div>
            ) : (
              <p className="text-slate-500 dark:text-slate-400">
                Could not load profile.
              </p>
            )}
          </Card>
        </section>

        <section className="animate-slide-up" style={{ animationDelay: '50ms' }}>
          <Card padding={false}>
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Tasks
                </h2>
                <Button
                  onClick={() => {
                    setEditingTask(null);
                    setShowForm(true);
                  }}
                  size="md"
                >
                  New task
                </Button>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title..."
                  className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
                <Select
                  options={STATUS_OPTIONS}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="sm:w-40"
                />
              </div>
            </div>

            {(showForm || editingTask) && (
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  {editingTask ? 'Edit task' : 'New task'}
                </h3>
                <TaskForm
                  task={editingTask}
                  onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingTask(null);
                  }}
                  loading={formLoading}
                />
              </div>
            )}

            <div className="p-6">
              <TaskList
                tasks={tasks}
                loading={tasksLoading}
                onEdit={(task) => {
                  setShowForm(false);
                  setEditingTask(task);
                }}
                onDelete={handleDeleteTask}
                deleteLoadingId={deleteLoadingId}
              />
            </div>

            {pagination.pages > 1 && (
              <div className="px-6 pb-6 flex items-center justify-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                >
                  Next
                </Button>
              </div>
            )}
          </Card>
        </section>
      </main>
    </div>
  );
}
