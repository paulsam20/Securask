import { Request, Response } from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

/**
 * Register Controller
 * Handles new user registration, password hashing (via Mongoose hooks), and token generation.
 */
export const register = async (req: Request, res: Response) => {
  console.log('Register request:', req.body);
  try {
    const { username, email, password } = req.body;

    // Validate uniqueness of email and username
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email or username' });
    }

    const user = new User({ username, email, password });
    await user.save();

    // Generate an authentication token valid for 24 hours
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
      message: 'User created successfully'
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    // Handle MongoDB duplicate key errors (11000)
    if (error.code === 11000) {
      return res.status(400).json({ message: 'User already exists with this email or username' });
    }
    res.status(400).json({ message: error.message || 'Registration failed' });
  }
};

/**
 * Login Controller
 * Authenticates user credentials and returns a secure JWT token.
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare provided password with hashed password in database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate session token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};