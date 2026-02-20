import express from 'express';
import { getTasks, getTaskById, createTask, updateTask, deleteTask } from '../controllers/taskController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * Task Routes
 * All routes are protected and require a valid JWT Bearer token.
 */

// Collection routes: List and Create
router.route('/')
  .get(protect, getTasks)
  .post(protect, createTask);

// Instance routes: Retrieve, Update, and Delete by ID
router.route('/:id')
  .get(protect, getTaskById)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

export default router;