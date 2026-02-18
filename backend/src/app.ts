import express from 'express';
import cors from 'cors'; // Added this
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger/swagger';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';

const app = express();

// 1. GLOBAL MIDDLEWARE
app.use(cors()); // Must be above routes to prevent "CORS Error" in browser
app.use(express.json());

// 2. DOCUMENTATION
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 3. ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// 4. BASE ROUTE (Optional)
app.get('/', (req, res) => {
  res.send('Securask API is running...');
});

export default app;