import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { validate } from '../middleware/validation';
import { registerSchema, loginSchema } from '../validations/authValidation';

const router = Router();

// authentication routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

export default router;