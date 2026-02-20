import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';
import logger from '../utils/logger';

/**
 * validate
 * Higher-order middleware factory that uses Zod schemas to validate incoming requests.
 * Checks request body, query parameters, and URL parameters.
 */
export const validate = (schema: ZodObject<any>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Validate the request object against the provided Zod schema
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            // If validation passes, move to the next handler
            next();
        } catch (error) {
            // Handle Zod-specific validation errors
            if (error instanceof ZodError) {
                logger.warn(`Validation failed: ${JSON.stringify(error.issues)}`);
                return res.status(400).json({
                    status: 'fail',
                    message: 'Validation failed',
                    // Map issues to a cleaner format for the frontend
                    errors: error.issues.map((err: any) => ({
                        path: err.path.join('.'), // e.g., "body.email"
                        message: err.message,
                    })),
                });
            }
            // Pass non-Zod errors (like server issues) to the global error handler
            next(error);
        }
    };
};
