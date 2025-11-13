import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { CalendarService } from '../services/calendarService';
import { HabitRepository } from '../repositories/habit.repository';

const router = express.Router();
const habitRepo = new HabitRepository();
const calendarService = new CalendarService(habitRepo);

// ✅ Routes ultra-légères, juste validation + délégation
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { userId } = req;
    const { start, end } = req.query as { start?: string; end?: string };

    if (!userId) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    if (!start || !end) {
      return res.status(400).json({ error: 'start et end requis' });
    }

    const activityData = await calendarService.getActivityData(userId, start, end);
    res.json({ activityData });
  } catch (error) {
    console.error('Erreur calendrier:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/stats', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { userId } = req;
    const { start, end } = req.query as { start?: string; end?: string };

    if (!userId) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    if (!start || !end) {
      return res.status(400).json({ error: 'start et end requis' });
    }

    const stats = await calendarService.getStats(userId, start, end);
    res.json(stats);
  } catch (error) {
    console.error('Erreur stats:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;