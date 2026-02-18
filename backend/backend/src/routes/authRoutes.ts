import express from 'express';
import { registerUser, loginUser } from '../controllers/authController';

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 * post:
 * summary: Register User
 * tags: [Auth]
 * requestBody:
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * username: {type: string}
 * password: {type: string}
 * responses:
 * 201:
 * description: Success
 */
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;