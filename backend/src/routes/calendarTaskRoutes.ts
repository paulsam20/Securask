import express from 'express';
import {
    getCalendarTasks,
    createCalendarTask,
    updateCalendarTask,
    deleteCalendarTask,
} from '../controllers/calendarTaskController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
    .get(protect, getCalendarTasks)
    .post(protect, createCalendarTask);

router.route('/:id')
    .put(protect, updateCalendarTask)
    .delete(protect, deleteCalendarTask);

export default router;
