import { dbAll, dbGet, dbRun } from '../config/database';
import { Habit, HabitEntry } from '../types/habit.types';

export class HabitRepository {
  async getHabitIdsByUser(userId: number): Promise<number[]> {
    const results = await dbAll(
      'SELECT id FROM habits WHERE user_id = ?',
      [userId]
    ) as { id: number }[];
    
    return results.map(h => h.id);
  }

  async getHabitsWithDetails(userId: number) {
    return await dbAll(
      'SELECT id, name, category FROM habits WHERE user_id = ?',
      [userId]
    ) as { id: number; name: string; category: string }[];
  }

  async getEntriesByDateRange(habitIds: number[], start: string, end: string) {
    if (habitIds.length === 0) return [];
    
    const placeholders = habitIds.map(() => '?').join(',');
    
    return await dbAll(
      `SELECT habit_id, date, completed 
       FROM habit_entries 
       WHERE habit_id IN (${placeholders}) 
       AND date BETWEEN ? AND ?`,
      [...habitIds, start, end]
    ) as { habit_id: number; date: string; completed: number }[];
  }

  async getHabitsWithTodayStatus(userId: number, today: string) {
    return await dbAll(
      `SELECT 
        h.*,
        COALESCE(he.completed, 0) as completed_today
       FROM habits h
       LEFT JOIN habit_entries he ON h.id = he.habit_id AND he.date = ?
       WHERE h.user_id = ?
       ORDER BY h.created_at DESC`,
      [today, userId]
    ) as Habit[];
  }

  async getEntriesForDates(habitId: number, dates: string[]) {
    if (dates.length === 0) return [];
    
    return await dbAll(
      `SELECT date, completed 
       FROM habit_entries 
       WHERE habit_id = ? AND date IN (${dates.map(() => '?').join(',')})`,
      [habitId, ...dates]
    ) as { date: string; completed: number }[];
  }

  async countHabitsByUser(userId: number): Promise<number> {
    const result = await dbGet(
      'SELECT COUNT(*) as count FROM habits WHERE user_id = ?',
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
    await dbRun(
      'INSERT INTO habits (user_id, name, description, category, difficulty) VALUES (?, ?, ?, ?, ?)',
      [userId, name, description, category, difficulty]
    );

    return await dbGet(
      'SELECT * FROM habits WHERE user_id = ? ORDER BY id DESC LIMIT 1',
      [userId]
    ) as Habit;
  }

  async getHabitById(habitId: number, userId: number) {
    return await dbGet(
      'SELECT * FROM habits WHERE id = ? AND user_id = ?',
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
    await dbRun(
      `UPDATE habits 
       SET name = ?, description = ?, category = ?, difficulty = ?
       WHERE id = ?`,
      [name, description, category, difficulty, habitId]
    );

    return await dbGet('SELECT * FROM habits WHERE id = ?', [habitId]) as Habit;
  }

  async deleteHabit(habitId: number) {
    await dbRun('DELETE FROM habits WHERE id = ?', [habitId]);
  }

  async getEntryForDate(habitId: number, date: string) {
    return await dbGet(
      'SELECT * FROM habit_entries WHERE habit_id = ? AND date = ?',
      [habitId, date]
    ) as HabitEntry | undefined;
  }

  async updateEntry(entryId: number, completed: number) {
    await dbRun(
      'UPDATE habit_entries SET completed = ? WHERE id = ?',
      [completed, entryId]
    );
  }

  async createEntry(habitId: number, date: string, completed: number) {
    await dbRun(
      'INSERT INTO habit_entries (habit_id, date, completed) VALUES (?, ?, ?)',
      [habitId, date, completed]
    );
  }

  async updateBestStreak(habitId: number, streak: number) {
    await dbRun(
      'UPDATE habits SET best_streak = ? WHERE id = ?',
      [streak, habitId]
    );
  }

  // Fonction helper pour calculer la série (streak) d'une habitude
  async calculateStreak(habitId: number): Promise<number> {
    const entries = (await dbAll(
      'SELECT date FROM habit_entries WHERE habit_id = ? AND completed = 1 ORDER BY date DESC',
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