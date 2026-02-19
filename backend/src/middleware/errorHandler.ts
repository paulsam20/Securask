import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export interface AppError extends Error {
    statusCode?: number;
}

export const errorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    if (process.env.NODE_ENV === 'development') {
        logger.error(err.stack);
    }

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};
