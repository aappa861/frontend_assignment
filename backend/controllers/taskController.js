import Task from '../models/Task.js';
import { body, validationResult } from 'express-validator';

/**
 * GET /api/tasks - List tasks for current user with filter, search, pagination
 * Query: status, search (title), page, limit
 */
export const getTasks = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const query = { user: req.user._id };

    if (status && ['todo', 'in_progress', 'done'].includes(status)) {
      query.status = status;
    }
    if (search && search.trim()) {
      query.title = { $regex: search.trim(), $options: 'i' };
    }

    const skip = (Math.max(1, parseInt(page, 10)) - 1) * Math.min(50, Math.max(1, parseInt(limit, 10)));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));

    const [tasks, total] = await Promise.all([
      Task.find(query).sort({ updatedAt: -1 }).skip(skip).limit(limitNum).lean(),
      Task.countDocuments(query),
    ]);

    res.json({
      tasks,
      pagination: {
        page: Math.max(1, parseInt(page, 10)),
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
};

/** Validation for create task (title required) */
export const taskValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').optional().trim(),
  body('status')
    .optional()
    .isIn(['todo', 'in_progress', 'done'])
    .withMessage('Status must be todo, in_progress, or done'),
];

/** Validation for update task (all fields optional) */
export const updateTaskValidation = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().trim(),
  body('status')
    .optional()
    .isIn(['todo', 'in_progress', 'done'])
    .withMessage('Status must be todo, in_progress, or done'),
];

/**
 * POST /api/tasks - Create task for current user
 */
export const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array().map((e) => e.msg).join(', '),
      });
    }
    const task = await Task.create({
      ...req.body,
      user: req.user._id,
    });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/tasks/:id - Update task (only owner). Accepts partial payload.
 */
export const updateTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array().map((e) => e.msg).join(', '),
      });
    }
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found or access denied.' });
    }
    if (req.body.title !== undefined) task.title = req.body.title;
    if (req.body.description !== undefined) task.description = req.body.description;
    if (req.body.status !== undefined) task.status = req.body.status;
    await task.save();
    res.json(task);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/tasks/:id - Delete task (only owner)
 */
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!task) {
      return res.status(404).json({ message: 'Task not found or access denied.' });
    }
    res.json({ message: 'Task deleted.' });
  } catch (err) {
    next(err);
  }
};
