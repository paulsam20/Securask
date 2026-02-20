import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { validate } from '../middleware/validation';
import { registerSchema, loginSchema } from '../validations/authValidation';

const router = Router();

/**
 * Authentication Routes
 * POST /api/auth/register - Create a new account
 * POST /api/auth/login    - Authenticate and get token
 */

// User Registration: Includes schema validation middleware
router.post('/register', validate(registerSchema), register);

// User Login: Includes schema validation middleware
router.post('/login', validate(loginSchema), login);

export default router;