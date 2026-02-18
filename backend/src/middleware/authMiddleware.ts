import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';

export const protect = async (req: any, res: Response, next: NextFunction) => {
  let token;

  // 1. Check if the header exists and starts with Bearer
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Extract the token
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify token
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');

      // 4. Get user from the token and attach to request
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }
      
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};