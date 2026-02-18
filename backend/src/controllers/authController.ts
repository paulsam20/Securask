import { Request, Response } from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const register = async (req: Request, res: Response) => {
  console.log('Register request:', req.body);
  try {
    const { username, email, password } = req.body;
    // const user = new User({ username, email, password });
    // await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ message: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  // const user = await User.findOne({ email });

  // if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ id: 'fakeid' }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: 'fakeid', username: 'fakeuser' } });
  // } else {
  //   res.status(401).json({ message: 'Invalid credentials' });
  // }
};