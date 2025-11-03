import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { dbGet, dbAll } from '../config/database';
import { calculateStreak, getLast7Days } from '../utils/dateHelpers';

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
    const habitRates = await Promise.all(
      habits.map(async (habit) => {
        const totalEntries = await dbGet(
          `SELECT COUNT(*) as count 
           FROM habit_entries 
           WHERE habit_id = ? AND date IN (${weekDates.map(() => '?').join(',')})`,
          [habit.id, ...weekDates]
        ) as { count: number };
      
        const completedEntries = await dbGet(
          `SELECT COUNT(*) as count 
           FROM habit_entries 
           WHERE habit_id = ? AND date IN (${weekDates.map(() => '?').join(',')}) AND completed = 1`,
          [habit.id, ...weekDates]
        ) as { count: number };
      
        const rate = totalEntries.count > 0
          ? Math.round((completedEntries.count / totalEntries.count) * 100)
          : 0;
      
        return { name: habit.name, rate };
      })
    );

    let bestHabit: { name: string; rate: number } = { name: "Aucune", rate: 0 };
    let worstHabit: { name: string; rate: number } = { name: "Aucune", rate: 0 };

    if (habitRates.length > 0) {
      // Tri du plus régulier au moins régulier
      habitRates.sort((a, b) => b.rate - a.rate);

      bestHabit = habitRates[0] ?? { name: "Aucune", rate: 0 };
      worstHabit = habitRates[habitRates.length - 1] ?? { name: "Aucune", rate: 0 };

      // 🧠 Cas particulier : toutes les habitudes ont le même taux
      const firstRate = habitRates[0]?.rate ?? 0;
      const allSameRate = habitRates.every(h => h.rate === firstRate);
        
      if (allSameRate) {
        if (firstRate === 0) {
          // Tout est à 0 → aucune habitude régulière
          bestHabit = { name: "Aucune", rate: 0 };
          worstHabit = { name: "Aucune", rate: 0 };
        } else {
          // Tout est égal mais non nul → aucune "pire"
          worstHabit = { name: "Aucune", rate: 0 };
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