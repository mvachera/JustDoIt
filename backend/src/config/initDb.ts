import pool from './database';

export async function initDatabase(): Promise<void> {
  try {
    // Table des utilisateurs
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        refreshToken TEXT,
        resetPasswordToken TEXT,
        resetPasswordExpires BIGINT,
        daily_reminder_enabled INTEGER DEFAULT 1,
        weekly_stats_enabled INTEGER DEFAULT 1,
        monthly_stats_enabled INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Table des habitudes
    await pool.query(`
      CREATE TABLE IF NOT EXISTS habits (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(50) NOT NULL CHECK(category IN ('Sport', 'Détente', 'Apprentissage', 'Santé', 'Travail', 'Social')),
        difficulty VARCHAR(20) NOT NULL CHECK(difficulty IN ('easy', 'medium', 'hard')),
        streak INTEGER DEFAULT 0,
        best_streak INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Table des entrées
    await pool.query(`
      CREATE TABLE IF NOT EXISTS habit_entries (
        id SERIAL PRIMARY KEY,
        habit_id INTEGER NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        completed BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(habit_id, date)
      )
    `);

    console.log('✅ Tables créées/vérifiées');
  } catch (error) {
    console.error('❌ Erreur init DB:', error);
    throw error;
  }
}