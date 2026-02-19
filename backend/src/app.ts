import express from 'express';
import cors from 'cors'; // lets backend communicate with frontend
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger/swagger';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import stickyNoteRoutes from './routes/stickyNoteRoutes';
import calendarTaskRoutes from './routes/calendarTaskRoutes';

const app = express();

// 1. global middleware
app.use(cors()); // Must be above routes to prevent "CORS Error" in browser
app.use(express.json());

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

export default app;