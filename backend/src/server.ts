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
import cron from 'node-cron';
import { sendDailyReminder } from './services/emailService';
import { dbAll } from './config/database';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 5000;

// Crée les tables au démarrage
initDatabase();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

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

app.listen(PORT, () => {
  // Envoie un email à 15h chaque jour
  cron.schedule('0 15 * * *', async () => {
    console.log('📧 Envoi des rappels...');
    
    const users = await dbAll('SELECT email, name FROM users') as any[];
    
    for (const user of users) {
      await sendDailyReminder(user.email, user.name);
    }
    
    console.log('✅ Rappels envoyés !');
  });
});