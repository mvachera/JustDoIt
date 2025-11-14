import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { getUserNotifications, updateUserNotifications } from '../repositories/notifs.repository';

const router = express.Router();

router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'User non authentifié' });
    }
    
    const notifications = await getUserNotifications(userId);
    res.json(notifications);
  } catch (error) {
    console.error('Erreur get notifications:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.put('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'User non authentifié' });
    }
    
    await updateUserNotifications(userId, req.body);
    res.json({ message: 'Notifications mises à jour' });
  } catch (error) {
    console.error('Erreur update notifications:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;