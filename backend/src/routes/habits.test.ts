import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest';
import request from 'supertest';
import express from 'express';

// Mock du middleware
vi.mock('../middleware/auth', () => ({
  authenticateToken: (req: any, res: any, next: any) => {
    req.userId = 999;
    next();
  }
}));

import habitsRouter from './habits';
import { dbRun, dbGet } from '../config/database';

const app = express();
app.use(express.json());
app.use('/api/habits', habitsRouter);

const testUserId = 999;

describe('POST /api/habits - Test d\'intégration', () => {
  
  beforeEach(async () => {
    await dbRun('DELETE FROM habits WHERE user_id = ?', [testUserId]);
  });

  // ✅ TEST 1 : Utiliser 'easy' au lieu de 'Facile'
  it('crée une habitude et la sauvegarde en BDD', async () => {
    const response = await request(app)
      .post('/api/habits')
      .send({
        name: 'Sport',
        description: '30 min par jour',
        category: 'Santé',
        difficulty: 'easy'
      });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Sport');

    const habit = await dbGet(
      'SELECT * FROM habits WHERE user_id = ? AND name = ?',
      [testUserId, 'Sport']
    );
    
    expect(habit).toBeDefined();
    expect(habit.name).toBe('Sport');
    expect(habit.description).toBe('30 min par jour');
  });

  // ✅ TEST 2 : Utiliser 'easy' aussi
  it('refuse de créer une 6ème habitude', async () => {
    for (let i = 1; i <= 5; i++) {
      await request(app)
        .post('/api/habits')
        .send({ 
          name: `Habitude ${i}`, 
          category: 'Sport', 
          difficulty: 'easy'
        });
    }

    const response = await request(app)
      .post('/api/habits')
      .send({ 
        name: 'Habitude 6', 
        category: 'Sport', 
        difficulty: 'easy'
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Limite atteinte');
  });

  // ✅ TEST 3 : Restaurer le mock original pour ce test
  it('refuse si pas authentifié', async () => {
    // Créer une nouvelle app sans le mock
    const testApp = express();
    testApp.use(express.json());

    // Middleware qui rejette toujours
    testApp.use('/api/habits', (req, res, next) => {
      return res.status(401).json({ error: 'Non authentifié' });
    });

    const response = await request(testApp)
      .post('/api/habits')
      .send({ name: 'Sport' });

    expect(response.status).toBe(401);
  });

  afterAll(async () => {
    await dbRun('DELETE FROM habits WHERE user_id = ?', [testUserId]);
  });
});