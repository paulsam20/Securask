import { z } from 'zod';

/**
 * Zod Schemas for Authentication
 * These schemas define the required structure and constraints for incoming requests.
 */

// Registration Schema: Requires unique username, valid email, and secure password
export const registerSchema = z.object({
    body: z.object({
        username: z.string().min(3, 'Username must be at least 3 characters long'),
        email: z.string().email('Invalid email address'),
        password: z.string().min(6, 'Password must be at least 6 characters long'),
    }),
});

// Login Schema: Basic verification of email format and presence of password
export const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(1, 'Password is required'),
    }),
});
