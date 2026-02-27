import { useState, useEffect } from 'react';
import { Button, Input, Select } from '../ui';

const STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

export default function TaskForm({ task, onSubmit, onCancel, loading }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status || 'todo');
    }
  }, [task]);

  const validate = () => {
    const next = {};
    if (!title.trim()) next.title = 'Title is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ title: title.trim(), description: description.trim(), status });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <Input
        label="Title *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        error={errors.title}
      />
      <Input
        label="Description"
        as="textarea"
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Optional description"
      />
      <Select
        label="Status"
        options={STATUS_OPTIONS}
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      />
      <div className="flex gap-2 justify-end pt-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={loading} disabled={loading}>
          {task ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}
