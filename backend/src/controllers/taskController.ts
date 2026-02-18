import { Response } from 'express';
import Task from '../models/Task';

// GET all tasks for logged-in user
export const getTasks = async (req: any, res: Response) => {
  try {
    // const tasks = await Task.find({ user: req.user._id });
    res.json([]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

// GET single task
export const getTaskById = async (req: any, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task' });
  }
};

// CREATE task
export const createTask = async (req: any, res: Response) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    
    // const task = await Task.create({ title, description, user: req.user._id });
    res.status(201).json({ _id: 'fakeid', title, description, status: 'pending' });
  } catch (error) {
    res.status(400).json({ message: 'Error creating task' });
  }
};

// UPDATE task
export const updateTask = async (req: any, res: Response) => {
  try {
    // const task = await Task.findById(req.params.id);
    // if (!task) return res.status(404).json({ message: 'Task not found' });

    // if (task.user.toString() !== req.user._id.toString()) {
    //   return res.status(401).json({ message: 'Not authorized' });
    // }

    // const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ _id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ message: 'Server error during update' });
  }
};

// DELETE task
export const deleteTask = async (req: any, res: Response) => {
  try {
    // const task = await Task.findById(req.params.id);
    // if (!task) return res.status(404).json({ message: 'Task not found' });

    // if (task.user.toString() !== req.user._id.toString()) {
    //   return res.status(401).json({ message: 'Not authorized' });
    // }

    // await task.deleteOne();
    res.json({ message: 'Task successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during deletion' });
  }
};