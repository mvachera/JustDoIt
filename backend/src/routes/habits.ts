import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { HabitService } from '../services/habitService';
import { HabitRepository } from '../repositories/habit.repository';

const router = express.Router();
const habitRepo = new HabitRepository();
const habitService = new HabitService(habitRepo);

router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { userId } = req;

    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const habits = await habitService.getHabitsWithWeekData(userId);
    res.json(habits);
  } catch (error) {
    console.error('Erreur récupération habitudes:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { userId } = req;

    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const newHabit = await habitService.createHabit(userId, req.body);
    res.status(201).json(newHabit);
  } catch (error: any) {
    console.error('Erreur création habitude:', error);
    
    if (error.message.includes('Limite atteinte')) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.patch('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { userId } = req;
    const habitId = parseInt(req.params.id as string, 10);

    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const updatedHabit = await habitService.updateHabit(habitId, userId, req.body);
    res.json(updatedHabit);
  } catch (error: any) {
    console.error('Erreur modification habitude:', error);
    
    if (error.message === 'Habitude non trouvée') {
      return res.status(404).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { userId } = req;
    const habitId = parseInt(req.params.id as string, 10);

    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    if (isNaN(habitId)) {
      return res.status(400).json({ error: 'ID invalide' });
    }

    await habitService.deleteHabit(habitId, userId);
    res.json({ message: 'Habitude supprimée avec succès' });
  } catch (error: any) {
    console.error('Erreur suppression habitude:', error);
    
    if (error.message === 'Habitude non trouvée') {
      return res.status(404).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/:id/toggle', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { userId } = req;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    if (!id) {
      return res.status(400).json({ error: "ID d'habitude manquant" });
    }

    const habitId = parseInt(id, 10);
    const result = await habitService.toggleHabit(habitId, userId);
    
    res.json({ success: true, ...result });
  } catch (error: any) {
    console.error('Erreur toggle habitude:', error);
    
    if (error.message === 'Habitude non trouvée') {
      return res.status(404).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;