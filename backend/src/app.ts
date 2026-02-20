/**
 * app.ts
 * Configures the Express application, middleware, and routes.
 * Serves as the central hub for the application logic.
 */
import express from 'express';
import cors from 'cors'; // Enables Cross-Origin Resource Sharing
import swaggerUi from 'swagger-ui-express'; // API documentation UI
import swaggerSpec from './swagger/swagger'; // Swagger configuration
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import stickyNoteRoutes from './routes/stickyNoteRoutes';
import calendarTaskRoutes from './routes/calendarTaskRoutes';
import { errorHandler } from './middleware/errorHandler';
import logger from './utils/logger';

const app = express();

// 1. Global Middleware Configuration
app.use(cors({
  origin: true, // Allow any domain to access (reflects request origin)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
}));
app.use(express.json()); // Parse incoming JSON requests

// Middleware to log all incoming requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// 2. API Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 3. API Routes Integration
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/sticky-notes', stickyNoteRoutes);
app.use('/api/calendar-tasks', calendarTaskRoutes);

// 4. Base Health-Check Route
app.get('/', (req, res) => {
  res.send('Securask API is running...');
});

// 5. Global Error Handling Middleware
app.use(errorHandler);

export default app;