import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbRun, dbGet } from '../config/database';
import { CreateUserRequest, LoginRequest, AuthResponse, User } from '../types';

const router = express.Router();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'ton-secret-temporaire';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'ton-secret-temporaire';
const ACCESS_TOKEN_EXPIRATION = "1h";
const REFRESH_TOKEN_EXPIRATION = "7d";

// Connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Trouve l'utilisateur
    const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]) as User;
    if (!user) {
      return res.status(400).json({ error: 'Utilisateur non trouvé.' });
    }

    // Vérifie le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Mot de passe incorrect.' });
    }

    // Crée le token JWT
    const accessToken = jwt.sign({ userId: user.id }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION });
    const refreshToken = jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });

    // Retourne sans le password
    const { password: _, ...userWithoutPassword } = user;
    res.json({ accessToken, refreshToken, user: userWithoutPassword } as AuthResponse);

  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Inscription
router.post('/register', async (req, res) => {
  try {
    const { email, password, confirmPassword, name }: CreateUserRequest = req.body;

    // Vérifie que les mots de passe correspondent
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Les mots de passe ne correspondent pas.' });
    }
    
    // Vérifie si l'utilisateur existe déjà
    const existingUser = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ error: 'Utilisateur déjà existant.' });
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
    const accessToken = jwt.sign({ userId: newUser.id }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION });
    const refreshToken = jwt.sign({ userId: newUser.id }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });

    // Retourne sans le password
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ accessToken, refreshToken, user: userWithoutPassword } as AuthResponse);

  } catch (error) {
    console.error('Erreur register:', error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: "Refresh token manquant" });

  try {
    // Vérifie que le token est valide
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET!) as any;

    // Vérifie que ce refresh token correspond à celui en DB
    const user = await dbGet('SELECT id, refreshToken FROM users WHERE id = ?',
      [decoded.userId]) as { id: number, refreshToken: string | null };

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ error: "Refresh token invalide" });
    }

    // Génère un nouvel access token
    const newAccessToken = jwt.sign(
      { userId: user.id },
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRATION }
    );

    res.json({ accessToken: newAccessToken });

  } catch (err) {
    console.error(err);
    res.status(403).json({ error: "Refresh token invalide ou expiré" });
  }
});


export default router;