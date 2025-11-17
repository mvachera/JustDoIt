import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
});

pool.on('connect', () => {
  console.log('✅ Connecté à PostgreSQL');
});

pool.on('error', (err: Error) => {
  console.error('❌ Erreur PostgreSQL:', err);
});

export const query = async (text: string, params?: any[]): Promise<any> => {
  const result = await pool.query(text, params);
  return result.rows;
};

export const queryOne = async (text: string, params?: any[]): Promise<any> => {
  const result = await pool.query(text, params);
  return result.rows[0];
};

export default pool;