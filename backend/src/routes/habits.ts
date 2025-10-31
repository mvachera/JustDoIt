import express from 'express';
import { dbRun, dbGet, dbAll } from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { calculateStreak, getLast7Days } from '../utils/dateHelpers';

const router = express.Router();

router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const today = new Date().toISOString().split('T')[0];

    // Récupère les habitudes
    const habits = await dbAll(
      `SELECT 
        h.*,
        COALESCE(he.completed, 0) as completed_today
       FROM habits h
       LEFT JOIN habit_entries he ON h.id = he.habit_id AND he.date = ?
       WHERE h.user_id = ?
       ORDER BY h.created_at DESC`,
      [today, userId]
    );

    // Pour chaque habitude, récupère les données de la semaine
    const habitsWithWeekData = await Promise.all(
      habits.map(async (habit) => {
        // Génère les 7 derniers jours (lundi à dimanche de cette semaine)
        const weekDates = getLast7Days();
        
        // Récupère les entrées pour ces 7 jours
        const entries = await dbAll(
          `SELECT date, completed 
           FROM habit_entries 
           WHERE habit_id = ? AND date IN (${weekDates.map(() => '?').join(',')})`,
          [habit.id, ...weekDates]
        ) as { date: string; completed: number }[];

        // Crée un map pour accès rapide
        const entriesMap = new Map(
          entries.map(e => [e.date, e.completed === 1])
        );

        // Construit le tableau de la semaine
        const weekData = weekDates.map(date => entriesMap.get(date) || false);

        // Calcule le streak
        const streak = await calculateStreak(habit.id);

        return {
          ...habit,
          weekData,
          streak
        };
      })
    );

    res.json(habitsWithWeekData);
  } catch (error) {
    console.error('Erreur récupération habitudes:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { name, description, category } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    // Vérifie la limite
    const result = await dbGet(
      'SELECT COUNT(*) as count FROM habits WHERE user_id = ?',
      [userId]
    ) as { count: number };

    if (result.count >= 5) {
      return res.status(400).json({ 
        error: 'Limite atteinte. Vous avez déjà 5 habitudes. Supprimez-en une pour en créer une nouvelle.' 
      });
    }

    await dbRun(
      'INSERT INTO habits (user_id, name, description, category) VALUES (?, ?, ?, ?)',
      [userId, name, description || '', category || 'Sport']
    );

    const newHabit = await dbGet(
      'SELECT * FROM habits WHERE user_id = ? ORDER BY id DESC LIMIT 1',
      [userId]
    );

    res.status(201).json(newHabit);
  } catch (error) {
    console.error('Erreur création habitude:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;
    const habitId = parseInt(req.params.id as string, 10);

    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    if (isNaN(habitId)) {
      return res.status(400).json({ error: 'ID invalide' });
    }

    const habit = await dbGet(
      'SELECT * FROM habits WHERE id = ? AND user_id = ?',
      [habitId, userId]
    );

    if (!habit) {
      return res.status(404).json({ error: 'Habitude non trouvée' });
    }

    await dbRun('DELETE FROM habits WHERE id = ?', [habitId]);

    res.json({ message: 'Habitude supprimée avec succès' });
  } catch (error) {
    console.error('Erreur suppression habitude:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/habits/:id/toggle - Marquer/démarquer une habitude comme complétée pour aujourd'hui
router.post('/:id/toggle', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID d'habitude manquant" });
    }

    const habitId = parseInt(id, 10);
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    // Vérifie que l'habitude appartient à l'utilisateur
    const habit = await dbGet(
      'SELECT * FROM habits WHERE id = ? AND user_id = ?',
      [habitId, userId]
    );

    if (!habit) {
      return res.status(404).json({ error: 'Habitude non trouvée' });
    }

    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

    // Vérifie si une entrée existe déjà pour aujourd'hui
    const existingEntry = await dbGet(
      'SELECT * FROM habit_entries WHERE habit_id = ? AND date = ?',
      [habitId, today]
    ) as { id: number, completed: number } | undefined;

    if (existingEntry) {
      // Si l'entrée existe, inverse le statut (toggle)
      const newStatus = existingEntry.completed === 1 ? 0 : 1;
      
      await dbRun(
        'UPDATE habit_entries SET completed = ? WHERE id = ?',
        [newStatus, existingEntry.id]
      );

      res.json({ 
        success: true, 
        completed: newStatus === 1,
        message: newStatus === 1 ? 'Habitude marquée comme complétée' : 'Habitude marquée comme non complétée'
      });
    } else {
      // Si aucune entrée n'existe, crée-la avec completed = 1
      await dbRun(
        'INSERT INTO habit_entries (habit_id, date, completed) VALUES (?, ?, 1)',
        [habitId, today]
      );

      res.json({ 
        success: true, 
        completed: true,
        message: 'Habitude marquée comme complétée'
      });
    }

  } catch (error) {
    console.error('Erreur toggle habitude:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;