import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Response } from 'express';
import { findUserByEmail, findUserById, createUser,
	updateResetToken, findUserByResetToken,
	updatePassword } from '../repositories/auth.repository';
import { User } from '../types';

if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
  throw new Error('Les variables ACCESS_TOKEN_SECRET et REFRESH_TOKEN_SECRET doivent être définies');
}

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRATION = "1h";
const REFRESH_TOKEN_EXPIRATION = "7d";

export const authenticateUser = async (email: string, password: string) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('Utilisateur non trouvé.');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error('Mot de passe incorrect.');
  }

  return user;
};

export const registerUser = async (email: string, password: string, confirmPassword: string, name: string) => {
  if (password !== confirmPassword) {
    throw new Error('Les mots de passe ne correspondent pas.');
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error('Utilisateur déjà existant.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await createUser(email, hashedPassword, name);

  const newUser = await findUserByEmail(email);
  if (!newUser) {
    throw new Error('Erreur lors de la création de l\'utilisateur.');
  }

  return newUser;
};

export const generateTokens = (userId: number) => {
  const accessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION });
  const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });

  return { accessToken, refreshToken };
};

export const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

export const verifyRefreshToken = async (refreshToken: string) => {
  const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as any;
  const user = await findUserById(decoded.userId);

  if (!user || user.refreshToken !== refreshToken) {
    throw new Error('Refresh token invalide');
  }

  return user.id;
};

export const removeUserPassword = (user: User) => {
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const generateResetToken = async (email: string) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('Aucun compte associé à cet email.');
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpires = Date.now() + 3600000; // 1 heure

  await updateResetToken(user.id, resetToken, resetTokenExpires);

  return { resetToken, email: user.email, name: user.name };
};

export const resetPassword = async (token: string, newPassword: string) => {
  const user = await findUserByResetToken(token);
  
  if (!user) {
    throw new Error('Token invalide ou expiré.');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await updatePassword(user.id, hashedPassword);

  return user;
};