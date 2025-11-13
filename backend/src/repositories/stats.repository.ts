import { dbGet, dbAll } from '../config/database';

export class StatsRepository {
  async countTotalHabits(userId: number): Promise<number> {
    const result = await dbGet(
      'SELECT COUNT(*) as count FROM habits WHERE user_id = ?',
      [userId]
    ) as { count: number };
    return result.count;
  }

  async countCompletedToday(userId: number, today: string): Promise<number> {
    const result = await dbGet(
      `SELECT COUNT(*) as count 
       FROM habit_entries he
       JOIN habits h ON he.habit_id = h.id
       WHERE h.user_id = ? AND he.date = ? AND he.completed = 1`,
      [userId, today]
    ) as { count: number };
    return result.count;
  }

  async getHabitsForStreak(userId: number) {
    return await dbAll(
      'SELECT id, name FROM habits WHERE user_id = ?',
      [userId]
    ) as { id: number; name: string }[];
  }

  async countCompletedForDate(userId: number, date: string): Promise<number> {
    const result = await dbGet(
      `SELECT COUNT(*) as count 
       FROM habit_entries he
       JOIN habits h ON he.habit_id = h.id
       WHERE h.user_id = ? AND he.date = ? AND he.completed = 1`,
      [userId, date]
    ) as { count: number };
    return result.count;
  }

  async countCompletedEntriesForDates(habitId: number, dates: string[]): Promise<number> {
    const result = await dbGet(
      `SELECT COUNT(*) as count 
       FROM habit_entries 
       WHERE habit_id = ? AND date IN (${dates.map(() => '?').join(',')}) AND completed = 1`,
      [habitId, ...dates]
    ) as { count: number };
    return result.count;
  }
}