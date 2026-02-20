import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

/**
 * AppError Interface
 * Extends the standard Error to include an optional HTTP status code.
 */
export interface AppError extends Error {
    statusCode?: number;
}

/**
 * Global Error Handler Middleware
 * Catch-all for any errors thrown in the application.
 * Logs the error and returns a formatted JSON response to the client.
 */
export const errorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Default to 500 (Internal Server Error) if no status code is set
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Log the error details with request context
    logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    // In development mode, also log the full error stack to the console
    if (process.env.NODE_ENV === 'development') {
        logger.error(err.stack);
    }

    // Standardized error response
    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
        // Include the stack trace only in development mode for easier debugging
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};
