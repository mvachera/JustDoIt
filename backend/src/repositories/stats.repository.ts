import { queryOne, query } from '../config/database';

export class StatsRepository {
  async countTotalHabits(userId: number): Promise<number> {
    const result = await queryOne(
      'SELECT COUNT(*)::int as count FROM habits WHERE user_id = $1',
      [userId]
    ) as { count: number };
    return result.count;
  }

  async countCompletedToday(userId: number, today: string): Promise<number> {
    const result = await queryOne(
      `SELECT COUNT(*)::int as count 
       FROM habit_entries he
       JOIN habits h ON he.habit_id = h.id
       WHERE h.user_id = $1 AND he.date = $2 AND he.completed = true`,
      [userId, today]
    ) as { count: number };
    return result.count;
  }

  async getHabitsForStreak(userId: number) {
    return await query(
      'SELECT id, name FROM habits WHERE user_id = $1',
      [userId]
    ) as { id: number; name: string }[];
  }

  async countCompletedForDate(userId: number, date: string): Promise<number> {
    const result = await queryOne(
      `SELECT COUNT(*)::int as count 
       FROM habit_entries he
       JOIN habits h ON he.habit_id = h.id
       WHERE h.user_id = $1 AND he.date = $2 AND he.completed = true`,
      [userId, date]
    ) as { count: number };
    return result.count;
  }

  async countCompletedEntriesForDates(habitId: number, dates: string[]): Promise<number> {
    const placeholders = dates.map((_, i) => `$${i + 2}`).join(',');
    
    const result = await queryOne(
      `SELECT COUNT(*)::int as count 
       FROM habit_entries 
       WHERE habit_id = $1 AND date IN (${placeholders}) AND completed = true`,
      [habitId, ...dates]
    ) as { count: number };
    return result.count;
  }
}