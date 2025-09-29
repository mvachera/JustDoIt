import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbRun, dbGet } from '../config/database';
import { CreateUserRequest, LoginRequest, AuthResponse, User } from '../types';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'ton-secret-temporaire';

// Inscription
router.post('/register', async (req, res) => {
  try {
    const { email, password, name }: CreateUserRequest = req.body;

    // Vérifie si l'utilisateur existe déjà
    const existingUser = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ error: 'Utilisateur déjà existant' });
    }

    // Hash le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crée l'utilisateur
    await dbRun(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      [email, hashedPassword, name]
    );

    // Récupère l'utilisateur créé
    const newUser = await dbGet('SELECT * FROM users WHERE email = ?', [email]) as User;
    
    // Crée le token JWT
    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET);

    // Retourne sans le password
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ token, user: userWithoutPassword } as AuthResponse);

  } catch (error) {
    console.error('Erreur register:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Trouve l'utilisateur
    const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]) as User;
    if (!user) {
      return res.status(400).json({ error: 'Utilisateur non trouvé' });
    }

    // Vérifie le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Mot de passe incorrect' });
    }

    // Crée le token JWT
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);

    // Retourne sans le password
    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword } as AuthResponse);

  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;