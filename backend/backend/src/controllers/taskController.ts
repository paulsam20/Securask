import { Response } from 'express';
import Task from '../models/Task';

export const getTasks = async (req: any, res: Response) => {
  const tasks = await Task.find({ user: req.user._id });
  res.json(tasks);
};

export const createTask = async (req: any, res: Response) => {
  const { title, description } = req.body;
  const task = await Task.create({ title, description, user: req.user._id });
  res.status(201).json(task);
};