import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { dbGet, dbAll } from '../config/database';
import { calculateStreak, getLast7Days, getWeekDaysUntilToday } from '../utils/dateHelpers';

const router = express.Router();

// GET /api/stats - Récupère les statistiques de l'utilisateur
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const today = new Date().toISOString().split('T')[0] || '';

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
      'SELECT id, name FROM habits WHERE user_id = ?',
      [userId]
    ) as { id: number, name:string }[];

    let longestStreak = 0;
    let longestStreakName = "";

    for (const habit of habits) {
      const streak = await calculateStreak(habit.id);
      if (streak > longestStreak) {
        longestStreak = streak;
        longestStreakName = habit.name;
      }
    }

    // 4. Taux de réussite pour aujourd'hui uniquement
    const successRate = totalHabits > 0 
      ? (completedToday / totalHabits) * 100 
      : 0;

    // 5. NOUVEAU : Données hebdomadaires (nombre d'habitudes complétées par jour)
    const weekDates = getLast7Days();
    
    const weeklyData = await Promise.all(
      weekDates.map(async (date: string) => {
        const result = await dbGet(
          `SELECT COUNT(*) as count 
           FROM habit_entries he
           JOIN habits h ON he.habit_id = h.id
           WHERE h.user_id = ? AND he.date = ? AND he.completed = 1`,
          [userId, date]
        ) as { count: number };
        
        return {
          date,
          completed: result.count,
          total: totalHabits
        };
      })
    );

    // 6. Habitude la plus régulière / la moins régulière (cette semaine)
    const weekDatesUntilToday = getWeekDaysUntilToday();
    const totalDaysElapsed = weekDatesUntilToday.length;
    
    const habitRates = await Promise.all(
      habits.map(async (habit) => {
        const completedEntries = await dbGet(
          `SELECT COUNT(*) as count 
           FROM habit_entries 
           WHERE habit_id = ? AND date IN (${weekDatesUntilToday.map(() => '?').join(',')}) AND completed = 1`,
          [habit.id, ...weekDatesUntilToday]
        ) as { count: number };
      
        // Calcul sur les jours écoulés uniquement
        const rate = totalDaysElapsed > 0 
          ? Math.round((completedEntries.count / totalDaysElapsed) * 100) 
          : 0;
      
        return { name: habit.name, rate };
      })
    );

    let bestHabit: { name: string; rate: number } | null = null;
    let worstHabit: { name: string; rate: number } | null = null;

    if (habitRates.length > 0) {
      habitRates.sort((a, b) => b.rate - a.rate);

      bestHabit = habitRates[0] ?? null;
      worstHabit = habitRates[habitRates.length - 1] ?? null;

      if (habitRates.every(h => h.rate === habitRates[0]?.rate)) {
        if (habitRates[0]?.rate === 0) {
          bestHabit = null;
          worstHabit = null;
        } else if (habitRates[0]?.rate === 100) {
          worstHabit = null;
        } else {
          bestHabit = null;
          worstHabit = null;
        }
      }
    }

    // 7️⃣ Nombre total d'habitudes complétées cette semaine et moyenne par jour
    const totalCompletedThisWeek = weeklyData.reduce(
      (sum, day) => sum + day.completed,
      0
    );

    const passedDays = weeklyData?.filter(day => day.date <= today) || [];

    const averagePerDay =
      passedDays.length > 0
        ? (
            passedDays.reduce((sum, day) => sum + day.completed, 0) /
            passedDays.length
          ).toFixed(1)
        : '0';

    res.json({
      totalHabits,
      completedToday,
      totalCompletedThisWeek,
      averagePerDay,
      longestStreak,
      longestStreakName,
      successRate: Math.round(successRate),
      weeklyData,
      bestHabit,
      worstHabit,
    });

  } catch (error) {
    console.error('Erreur récupération stats:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;