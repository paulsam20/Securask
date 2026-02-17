import express from 'express';
import { getTasks, createTask } from '../controllers/taskController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(protect, getTasks)
  .post(protect, createTask);

export default router;