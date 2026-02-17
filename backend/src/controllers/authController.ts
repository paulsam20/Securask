import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
};

export const registerUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const userExists = await User.findOne({ username });
  if (userExists) return res.status(400).json({ message: 'User exists' });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.create({ username, password: hashedPassword });
  res.status(201).json({ token: generateToken(user._id.toString()) });
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({ token: generateToken(user._id.toString()) });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};