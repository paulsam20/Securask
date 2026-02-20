import winston from 'winston';

/**
 * Winston Logger Configuration
 * Handles application logging with different levels and formats.
 * - colorized output for console
 * - timestamps on every log line
 * - environment-based log levels (debug in dev, info in prod)
 */

const { combine, timestamp, printf, colorize } = winston.format;

// Custom layout for log messages
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

const logger = winston.createLogger({
    // Set priority: 'debug' logs everything, 'info' skips debug messages
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [
        // Log to the standard output (terminal)
        new winston.transports.Console({
            format: combine(
                colorize(), // Visual distinction for error/warn/info
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                logFormat
            ),
        }),
        /**
         * Optional: Persist logs to files for auditing
         * new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
         * new winston.transports.File({ filename: 'logs/combined.log' }),
         */
    ],
});

export default logger;
