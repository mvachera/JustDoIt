import express from 'express';
import { dbRun, dbGet, dbAll } from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const habits = await dbAll(
      'SELECT * FROM habits WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    res.json(habits);
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

export default router;