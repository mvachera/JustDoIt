import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { initDatabase } from './config/initDb';
import authRoutes from './routes/auth';
import habitsRoutes from './routes/habits';
import statsRoutes from './routes/stats';
import calendarRoutes from './routes/calendar';
import notifsRoutes from './routes/notifs';
import aiRouter from './routes/ai';
import cron from 'node-cron';
import { sendDailyReminder, sendWeeklyStats, sendMonthlyStats } from './services/emailService';
import { StatsService,  } from './services/statsService'
import { query } from './config/database';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 5000;

// Crée les tables au démarrage
initDatabase();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:8080',
    'https://mvachera.github.io'
  ],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/notifs', notifsRoutes);
app.use('/api/ai', aiRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Habit Tracker API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // 📧 Rappel quotidien à 10h
  cron.schedule('0 10 * * *', async () => {
    console.log('📧 Envoi des rappels quotidiens...');
    const users = await query(
      'SELECT email, name FROM users WHERE daily_reminder_enabled = 1'
    ) as any[];
    
    for (const user of users) {
      try {
        await sendDailyReminder(user.email, user.name);
      } catch (error) {
        console.error(`Erreur rappel pour ${user.email}:`, error);
      }
    }
    console.log(`✅ ${users.length} rappels quotidiens envoyés !`);
  });

  // 📊 Stats hebdo tous les lundis à 10h
  cron.schedule('0 10 * * 1', async () => {
    console.log('📊 Envoi des stats hebdomadaires...');
    const users = await query(
      'SELECT id, email, name FROM users WHERE weekly_stats_enabled = 1'
    ) as any[];
    const statsService = new StatsService();
    
    for (const user of users) {
      try {
        const stats = await statsService.getWeeklyStatsForEmail(user.id);
        await sendWeeklyStats(user.email, user.name, stats);
      } catch (error) {
        console.error(`Erreur stats hebdo pour ${user.email}:`, error);
      }
    }
    console.log(`✅ ${users.length} stats hebdo envoyées !`);
  });

  // 📅 Stats mensuelles le 1er du mois à 11h
  cron.schedule('0 11 1 * *', async () => {
    console.log('📅 Envoi des stats mensuelles...');
    const users = await query(
      'SELECT id, email, name FROM users WHERE monthly_stats_enabled = 1'
    ) as any[];
    const statsService = new StatsService();
    
    for (const user of users) {
      try {
        const stats = await statsService.getMonthlyStatsForEmail(user.id);
        await sendMonthlyStats(user.email, user.name, stats);
      } catch (error) {
        console.error(`Erreur stats mensuelles pour ${user.email}:`, error);
      }
    }
    console.log(`✅ ${users.length} stats mensuelles envoyées !`);
  });
});