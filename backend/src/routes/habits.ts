import express from 'express';
import { dbRun, dbGet } from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

router.post('/habits', authenticateToken, async (req: AuthRequest, res) => {
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

export default router;