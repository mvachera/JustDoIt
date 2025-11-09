// calendar.ts
import express from 'express';
import { dbAll } from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;
    const { start, end } = req.query as { start?: string; end?: string };

    if (!userId) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    if (!start || !end) {
      return res.status(400).json({ error: 'Les paramètres start et end sont requis' });
    }

    const habitIdsResult = await dbAll(
      'SELECT id FROM habits WHERE user_id = ?',
      [userId]
    ) as { id: number }[];

    const habitIds = habitIdsResult.map(h => h.id);

    if (habitIds.length === 0) {
      return res.json({ activityData: {} });
    }

    const entries = await dbAll(
      `SELECT habit_id, date, completed 
       FROM habit_entries 
       WHERE habit_id IN (${habitIds.map(() => '?').join(',')}) 
       AND date BETWEEN ? AND ?`,
      [...habitIds, start, end]
    ) as { habit_id: number; date: string; completed: number }[];

    const activityData: { [date: string]: { [habitId: number]: boolean } } = {};

    const startDate = new Date(start);
    const endDate = new Date(end);
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0]!;
      activityData[dateStr] = {};
      
      habitIds.forEach(habitId => {
        activityData[dateStr]![habitId] = false;
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    entries.forEach(entry => {
      if (activityData[entry.date] && entry.completed === 1) {
        activityData[entry.date]![entry.habit_id] = true;
      }
    });

    res.json({ activityData });
  } catch (error) {
    console.error('Erreur récupération données calendrier:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Endpoint pour les statistiques
router.get('/stats', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;
    const { start, end } = req.query as { start?: string; end?: string };

    if (!userId) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    if (!start || !end) {
      return res.status(400).json({ error: 'Les paramètres start et end sont requis' });
    }

    const habits = await dbAll(
      'SELECT id, name, category FROM habits WHERE user_id = ?',
      [userId]
    ) as { id: number; name: string; category: string }[];

    const habitIds = habits.map(h => h.id);

    if (habitIds.length === 0) {
      return res.json({
        totalDays: 0,
        totalPossibleCompletions: 0,
        totalCompletions: 0,
        habitStats: {},
        bestHabit: null
      });
    }

    const entries = await dbAll(
      `SELECT habit_id, date, completed 
       FROM habit_entries 
       WHERE habit_id IN (${habitIds.map(() => '?').join(',')}) 
       AND date BETWEEN ? AND ?`,
      [...habitIds, start, end]
    ) as { habit_id: number; date: string; completed: number }[];

    // Calculer les stats
    const habitStats: { 
      [habitId: number]: { 
        completed: number; 
        total: number;
        name: string;
        category: string;
      } 
    } = {};

    // Initialiser les stats pour chaque habitude
    habits.forEach(habit => {
      habitStats[habit.id] = {
        completed: 0,
        total: 0,
        name: habit.name,
        category: habit.category
      };
    });

    // Compter les jours
    const startDate = new Date(start);
    const endDate = new Date(end);
    const today = new Date();
    
    today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    let totalDays = 0;
    const currentDate = new Date(startDate);

    while (currentDate <= today && currentDate <= endDate) {
      totalDays++;
      
      // Chaque habitude compte pour chaque jour
      habitIds.forEach(habitId => {
        habitStats[habitId]!.total++;
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // ✅ Nombre total d'habitudes possibles = nombre d'habitudes × jours passés
    const totalPossibleCompletions = habitIds.length * totalDays;

    // Compter les complétions réelles
    let totalCompletions = 0;
    entries.forEach(entry => {
      if (entry.completed === 1) {
        habitStats[entry.habit_id]!.completed++;
        totalCompletions++;
      }
    });

    // Trouver la meilleure habitude
    let bestHabit = null;
    let bestPercentage = 0;

    Object.entries(habitStats).forEach(([id, stat]) => {
      const percentage = stat.total > 0 ? (stat.completed / stat.total) * 100 : 0;
      if (percentage > bestPercentage) {
        bestPercentage = percentage;
        bestHabit = {
          id: parseInt(id),
          name: stat.name,
          category: stat.category,
          percentage: Math.round(percentage)
        };
      }
    });

    res.json({
      totalDays,
      totalPossibleCompletions,
      totalCompletions,
      habitStats,
      bestHabit
    });
  } catch (error) {
    console.error('Erreur récupération stats calendrier:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;