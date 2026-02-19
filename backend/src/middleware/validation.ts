import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';
import logger from '../utils/logger';

export const validate = (schema: ZodObject<any>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                logger.warn(`Validation failed: ${JSON.stringify(error.issues)}`);
                return res.status(400).json({
                    status: 'fail',
                    message: 'Validation failed',
                    errors: error.issues.map((err: any) => ({
                        path: err.path.join('.'),
                        message: err.message,
                    })),
                });
            }
            next(error);
        }
    };
};
