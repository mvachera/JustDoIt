import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { dbGet, dbAll } from '../config/database';

const router = express.Router();

// GET /api/stats - Récupère les statistiques de l'utilisateur
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

    // 1. Nombre total d'habitudes actives
    const totalHabitsResult = await dbGet(
      'SELECT COUNT(*) as count FROM habits WHERE user_id = ?',
      [userId]
    ) as { count: number };
    const totalHabits = totalHabitsResult.count;

    // 2. Habitudes complétées aujourd'hui
    const completedTodayResult = await dbGet(
      `SELECT COUNT(*) as count 
       FROM habit_entries he
       JOIN habits h ON he.habit_id = h.id
       WHERE h.user_id = ? AND he.date = ? AND he.completed = 1`,
      [userId, today]
    ) as { count: number };
    const completedToday = completedTodayResult.count;

    // 3. Plus longue série (streak)
    const habits = await dbAll(
      'SELECT id FROM habits WHERE user_id = ?',
      [userId]
    ) as { id: number }[];

    let longestStreak = 0;

    for (const habit of habits) {
      const streak = await calculateStreak(habit.id);
      if (streak > longestStreak) {
        longestStreak = streak;
      }
    }

    // 4. Taux de réussite pour aujourd'hui uniquement
    const successRate = totalHabits > 0 
      ? (completedToday / totalHabits) * 100 
      : 0;

    res.json({
      totalHabits,
      completedToday,
      longestStreak,
      successRate: Math.round(successRate),
    });

  } catch (error) {
    console.error('Erreur récupération stats:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Fonction helper pour calculer la série (streak) d'une habitude
async function calculateStreak(habitId: number): Promise<number> {
  const entries = (await dbAll(
    'SELECT date FROM habit_entries WHERE habit_id = ? AND completed = 1 ORDER BY date DESC',
    [habitId]
  ) ?? []) as { date: string }[];

  if (!entries.length) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < entries.length; i++) {
    const entryDateStr = entries[i]?.date;
    if (!entryDateStr) break;

    const entryDate = new Date(entryDateStr);
    entryDate.setHours(0, 0, 0, 0);

    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);

    if (entryDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export default router;