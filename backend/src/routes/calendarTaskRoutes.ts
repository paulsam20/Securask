import express from 'express';
import {
    getCalendarTasks,
    createCalendarTask,
    updateCalendarTask,
    deleteCalendarTask,
} from '../controllers/calendarTaskController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * Calendar Task Routes
 * API endpoints for managing timed events and appointments.
 * All routes require 'Bearer' token authentication.
 */

// List all events and Create a new event
router.route('/')
    .get(protect, getCalendarTasks)
    .post(protect, createCalendarTask);

// Update or Delete a specific event by ID
router.route('/:id')
    .put(protect, updateCalendarTask)
    .delete(protect, deleteCalendarTask);

export default router;
