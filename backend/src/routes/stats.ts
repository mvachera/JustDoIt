// routes/stats.ts
import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { StatsService } from '../services/statsService';

const router = express.Router();
const statsService = new StatsService();

router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const stats = await statsService.getUserStats(userId);
    res.json(stats);

  } catch (error) {
    console.error('Erreur récupération stats:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;