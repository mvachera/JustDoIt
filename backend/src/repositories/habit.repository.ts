import { query, queryOne } from '../config/database';
import { Habit, HabitEntry } from '../types/habit.types';

export class HabitRepository {
  async getHabitIdsByUser(userId: number): Promise<number[]> {
    const results = await query(
      'SELECT id FROM habits WHERE user_id = $1',
      [userId]
    ) as { id: number }[];
    
    return results.map(h => h.id);
  }

  async getHabitsWithDetails(userId: number) {
    return await query(
      'SELECT id, name, category FROM habits WHERE user_id = $1',
      [userId]
    ) as { id: number; name: string; category: string }[];
  }

  async getEntriesByDateRange(habitIds: number[], start: string, end: string) {
    if (habitIds.length === 0) return [];
  
    const placeholders = habitIds.map((_, i) => `$${i + 1}`).join(',');
  
    const rows = await query(
      `SELECT habit_id, date, completed::int AS completed
       FROM habit_entries 
       WHERE habit_id IN (${placeholders}) 
       AND date BETWEEN $${habitIds.length + 1} AND $${habitIds.length + 2}`,
      [...habitIds, start, end]
    );
  
    // Convertit les dates en strings
    return rows.map((row: any) => ({
      ...row,
      date: row.date instanceof Date 
        ? row.date.toISOString().split('T')[0] 
        : row.date
    })) as { habit_id: number; date: string; completed: number }[];
  }

  async getHabitsWithTodayStatus(userId: number, today: string) {
    return await query(
      `SELECT 
        h.*,
        COALESCE(he.completed::int, 0) as completed_today
       FROM habits h
       LEFT JOIN habit_entries he ON h.id = he.habit_id AND he.date = $1
       WHERE h.user_id = $2
       ORDER BY h.created_at DESC`,
      [today, userId]
    ) as Habit[];
  }

  async getEntriesForDates(habitId: number, dates: string[]) {
    if (dates.length === 0) return [];
  
    const placeholders = dates.map((_, i) => `$${i + 2}`).join(',');
  
    const rows = await query(
      `SELECT date, completed::int as completed 
       FROM habit_entries 
       WHERE habit_id = $1 AND date IN (${placeholders})`,
      [habitId, ...dates]
    );
  
    // Convertit les dates en strings
    return rows.map((row: any) => ({
      date: row.date instanceof Date ? row.date.toISOString().split('T')[0] : row.date,
      completed: row.completed
    })) as { date: string; completed: number }[];
  }

  async countHabitsByUser(userId: number): Promise<number> {
    const result = await queryOne(
      'SELECT COUNT(*)::int as count FROM habits WHERE user_id = $1',
      [userId]
    ) as { count: number };
    
    return result.count;
  }

  async createHabit(
    userId: number, 
    name: string, 
    description: string, 
    category: string, 
    difficulty: string
  ) {
    await query(
      'INSERT INTO habits (user_id, name, description, category, difficulty) VALUES ($1, $2, $3, $4, $5)',
      [userId, name, description, category, difficulty]
    );

    return await queryOne(
      'SELECT * FROM habits WHERE user_id = $1 ORDER BY id DESC LIMIT 1',
      [userId]
    ) as Habit;
  }

  async getHabitById(habitId: number, userId: number) {
    return await queryOne(
      'SELECT * FROM habits WHERE id = $1 AND user_id = $2',
      [habitId, userId]
    ) as Habit | undefined;
  }

  async updateHabit(
    habitId: number,
    name: string,
    description: string,
    category: string,
    difficulty: string
  ) {
    await query(
      `UPDATE habits 
       SET name = $1, description = $2, category = $3, difficulty = $4
       WHERE id = $5`,
      [name, description, category, difficulty, habitId]
    );

    return await queryOne('SELECT * FROM habits WHERE id = $1', [habitId]) as Habit;
  }

  async deleteHabit(habitId: number) {
    await query('DELETE FROM habits WHERE id = $1', [habitId]);
  }

  async getEntryForDate(habitId: number, date: string) {
    return await queryOne(
      'SELECT * FROM habit_entries WHERE habit_id = $1 AND date = $2',
      [habitId, date]
    ) as HabitEntry | undefined;
  }

  async updateEntry(entryId: number, completed: number) {
    await query(
      'UPDATE habit_entries SET completed = $1 WHERE id = $2',
      [completed, entryId]
    );
  }

  async createEntry(habitId: number, date: string, completed: number) {
    await query(
      'INSERT INTO habit_entries (habit_id, date, completed) VALUES ($1, $2, $3)',
      [habitId, date, completed]
    );
  }

  async updateBestStreak(habitId: number, streak: number) {
    await query(
      'UPDATE habits SET best_streak = $1 WHERE id = $2',
      [streak, habitId]
    );
  }

  async calculateStreak(habitId: number): Promise<number> {
    const entries = (await query(
      'SELECT date FROM habit_entries WHERE habit_id = $1 AND completed = true ORDER BY date DESC',
      [habitId]
    ) ?? []) as { date: string }[];

    if (!entries.length) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < entries.length; i++) {
      const entryDateStr = entries[i]?.date;
      if (!entryDateStr) break;

      const entryDate = new Date(entryDateStr);
      entryDate.setHours(0, 0, 0, 0);

      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);

      if (entryDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }
}