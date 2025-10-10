import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'ton-secret-temporaire';

export interface AuthRequest extends Request {
  userId?: number;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as { userId: number };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Erreur vérification token:', error);
    return res.status(403).json({ error: 'Token invalide' });
  }
};