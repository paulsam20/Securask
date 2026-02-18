import express from 'express';
import { getTasks, createTask, deleteTask, updateTask } from '../controllers/taskController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();
//routes for /api/tasks
router.route('/')
  .get(protect, getTasks)
  .post(protect, createTask);
// routes for /api/tasks/:id
router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, deleteTask);

export default router;