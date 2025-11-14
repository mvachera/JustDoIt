import db from './database';

export function initDatabase(): void {
  // Table des utilisateurs
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      refreshToken TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`ALTER TABLE habits ADD COLUMN streak INTEGER DEFAULT 0`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Erreur ajout colonne streak:', err);
    }
  });

  db.run(`ALTER TABLE habits ADD COLUMN best_streak INTEGER DEFAULT 0`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Erreur ajout colonne best_streak:', err);
    }
  });

  db.run(`ALTER TABLE users ADD COLUMN resetPasswordToken TEXT`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Erreur ajout colonne resetPasswordToken:', err);
    }
  });

  db.run(`ALTER TABLE users ADD COLUMN resetPasswordExpires INTEGER`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Erreur ajout colonne resetPasswordExpires:', err);
    }
  });

  db.run(`ALTER TABLE users ADD COLUMN daily_reminder_enabled INTEGER DEFAULT 1`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Erreur ajout colonne daily_reminder_enabled:', err);
    }
  });

  db.run(`ALTER TABLE users ADD COLUMN weekly_stats_enabled INTEGER DEFAULT 1`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Erreur ajout colonne weekly_stats_enabled:', err);
    }
  });

  db.run(`ALTER TABLE users ADD COLUMN monthly_stats_enabled INTEGER DEFAULT 1`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Erreur ajout colonne monthly_stats_enabled:', err);
    }
  });

  // Table des habitudes
  db.run(`
    CREATE TABLE IF NOT EXISTS habits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL CHECK(category IN
      ('Sport', 'Détente', 'Apprentissage', 'Santé',
      'Travail', 'Social')),
      difficulty TEXT NOT NULL CHECK(difficulty IN
      ('easy', 'medium', 'hard')),
      best_streak INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // Table des entrées quotidiennes (fait/pas fait)
  db.run(`
    CREATE TABLE IF NOT EXISTS habit_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      habit_id INTEGER NOT NULL,
      date DATE NOT NULL,
      completed BOOLEAN NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (habit_id) REFERENCES habits (id),
      UNIQUE(habit_id, date)
    )
  `)

  console.log('✅ Tables créées/vérifiées');
}
