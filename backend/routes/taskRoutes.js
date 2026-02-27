import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  taskValidation,
  updateTaskValidation,
} from '../controllers/taskController.js';

const router = express.Router();

router.use(protect);
router.get('/', getTasks);
router.post('/', taskValidation, createTask);
router.put('/:id', updateTaskValidation, updateTask);
router.delete('/:id', deleteTask);

export default router;
