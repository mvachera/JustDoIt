import { dbRun, dbGet } from '../config/database';
import { User } from '../types';

export const findUserByEmail = async (email: string): Promise<User | undefined> => {
  return await dbGet('SELECT * FROM users WHERE email = ?', [email]) as User;
};

export const findUserById = async (id: number): Promise<{ id: number, refreshToken: string | null } | undefined> => {
  return await dbGet('SELECT id, refreshToken FROM users WHERE id = ?', [id]) as { id: number, refreshToken: string | null };
};

export const createUser = async (email: string, hashedPassword: string, name: string): Promise<void> => {
  await dbRun(
    'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
    [email, hashedPassword, name]
  );
};

export const updateRefreshToken = async (userId: number, refreshToken: string): Promise<void> => {
  await dbRun('UPDATE users SET refreshToken = ? WHERE id = ?', [refreshToken, userId]);
};

export const updateResetToken = async (userId: number, token: string, expires: number): Promise<void> => {
  await dbRun(
    'UPDATE users SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE id = ?',
    [token, expires, userId]
  );
};

export const findUserByResetToken = async (token: string): Promise<User | undefined> => {
  return await dbGet(
    'SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires > ?',
    [token, Date.now()]
  ) as User;
};

export const updatePassword = async (userId: number, hashedPassword: string): Promise<void> => {
  await dbRun(
    'UPDATE users SET password = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE id = ?',
    [hashedPassword, userId]
  );
};