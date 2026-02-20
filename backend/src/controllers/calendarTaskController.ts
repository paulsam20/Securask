import { Response } from 'express';
import CalendarTask from '../models/CalendarTask';

/**
 * Retrieve all calendar events/tasks for the user.
 * Sorted chronologically by date and then time.
 */
export const getCalendarTasks = async (req: any, res: Response) => {
    try {
        const tasks = await CalendarTask.find({ user: req.user._id }).sort({ date: 1, time: 1 });
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching calendar tasks:', error);
        res.status(500).json({ message: 'Error fetching calendar tasks' });
    }
};

/**
 * Create a new calendar entry.
 * Validates that title, time, and date are present.
 */
export const createCalendarTask = async (req: any, res: Response) => {
    try {
        const { title, time, date, description } = req.body;
        if (!title || !time || !date) {
            return res.status(400).json({ message: 'Title, time and date are required' });
        }

        const task = await CalendarTask.create({
            user: req.user._id,
            title,
            time,
            date,
            description: description || '',
            completed: false,
        });

        res.status(201).json(task);
    } catch (error) {
        console.error('Error creating calendar task:', error);
        res.status(400).json({ message: 'Error creating calendar task' });
    }
};

/**
 * Update various properties of a calendar task.
 * Includes ownership verification.
 */
export const updateCalendarTask = async (req: any, res: Response) => {
    try {
        const task = await CalendarTask.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Calendar task not found' });

        // Security check
        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const { title, time, date, description, completed } = req.body;
        if (title !== undefined) task.title = title;
        if (time !== undefined) task.time = time;
        if (date !== undefined) task.date = date;
        if (description !== undefined) task.description = description;
        if (completed !== undefined) task.completed = completed;

        const updated = await task.save();
        res.json(updated);
    } catch (error) {
        console.error('Error updating calendar task:', error);
        res.status(500).json({ message: 'Server error during update' });
    }
};

/**
 * Permanently remove a calendar task.
 * Includes ownership verification.
 */
export const deleteCalendarTask = async (req: any, res: Response) => {
    try {
        const task = await CalendarTask.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Calendar task not found' });

        // Security check
        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await task.deleteOne();
        res.json({ message: 'Calendar task successfully deleted' });
    } catch (error) {
        console.error('Error deleting calendar task:', error);
        res.status(500).json({ message: 'Server error during deletion' });
    }
};
