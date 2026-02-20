import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';

/**
 * protect
 * Middleware to intercept requests and verify JWT authenticity.
 * If valid, it attaches the user document (minus password) to the request object.
 */
export const protect = async (req: any, res: Response, next: NextFunction) => {
  let token;

  // 1. Validate 'Authorization' header format (Bearer <token>)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Extract the JWT from the header
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify token using the server's secret key
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');

      // 4. Fetch the user from database and attach to the request
      // We exclude the password field for security
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Pass control to the next middleware or controller
      return next();
    } catch (error) {
      // Token verification failed (possibly expired or tampered with)
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // Fallback if no token was provided at all
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};