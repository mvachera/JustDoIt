import { query, queryOne } from '../config/database';
import { User } from '../types';

export const findUserByEmail = async (email: string): Promise<User | undefined> => {
  return await queryOne('SELECT * FROM users WHERE email = $1', [email]) as User;
};

export const findUserById = async (id: number): Promise<{ id: number, refreshToken: string | null } | undefined> => {
  return await queryOne('SELECT id, refreshToken FROM users WHERE id = $1', [id]) as { id: number, refreshToken: string | null };
};

export const createUser = async (email: string, hashedPassword: string, name: string): Promise<void> => {
  await query(
    'INSERT INTO users (email, password, name) VALUES ($1, $2, $3)',
    [email, hashedPassword, name]
  );
};

export const updateRefreshToken = async (userId: number, refreshToken: string): Promise<void> => {
  await query('UPDATE users SET refreshToken = $1 WHERE id = $2', [refreshToken, userId]);
};

export const updateResetToken = async (userId: number, token: string, expires: number): Promise<void> => {
  await query(
    'UPDATE users SET resetPasswordToken = $1, resetPasswordExpires = $2 WHERE id = $3',
    [token, expires, userId]
  );
};

export const findUserByResetToken = async (token: string): Promise<User | undefined> => {
  return await queryOne(
    'SELECT * FROM users WHERE resetPasswordToken = $1 AND resetPasswordExpires > $2',
    [token, Date.now()]
  ) as User;
};

export const updatePassword = async (userId: number, hashedPassword: string): Promise<void> => {
  await query(
    'UPDATE users SET password = $1, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE id = $2',
    [hashedPassword, userId]
  );
};