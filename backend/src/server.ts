import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { initDatabase } from './config/initDb';
import authRoutes from './routes/auth';
import habitsRoutes from './routes/habits';
import statsRoutes from './routes/stats';
import calendarRoutes from './routes/calendar';
import aiRouter from './routes/ai';

const app = express();
const PORT = process.env.PORT || 5000;

// Crée les tables au démarrage
initDatabase();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/ai', aiRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Habit Tracker API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});