import express from 'express';
import cors from 'cors'; // lets backend communicate with frontend
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger/swagger';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import stickyNoteRoutes from './routes/stickyNoteRoutes';
import calendarTaskRoutes from './routes/calendarTaskRoutes';
import { errorHandler } from './middleware/errorHandler';
import logger from './utils/logger';

const app = express();

// 1. global middleware
app.use(cors({
  origin: true, // Reflects the request origin, allowing any domain to access
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// 2. documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 3. routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/sticky-notes', stickyNoteRoutes);
app.use('/api/calendar-tasks', calendarTaskRoutes);

// 4. base route (optional)
app.get('/', (req, res) => {
  res.send('Securask API is running...');
});

// 5. error handling
app.use(errorHandler);

export default app;