import { StatsRepository } from '../repositories/stats.repository';
import { HabitRepository } from '../repositories/habit.repository';
import { Stats, WeeklyData, HabitRate } from '../types/stats.types';
import { getLast7Days, getWeekDaysUntilToday } from '../utils/dateHelpers';

export class StatsService {
  private statsRepo: StatsRepository;

  constructor() {
    this.statsRepo = new StatsRepository();
  }

  async getUserStats(userId: number): Promise<Stats> {
    const today = new Date().toISOString().split('T')[0] || '';

    // 1. Habitudes totales et complétées aujourd'hui
    const totalHabits = await this.statsRepo.countTotalHabits(userId);
    const completedToday = await this.statsRepo.countCompletedToday(userId, today);

    // 2. Plus longue série
    const { longestStreak, longestStreakName } = await this.calculateLongestStreak(userId);

    // 3. Taux de réussite
    const successRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

    // 4. Données hebdomadaires
    const weeklyData = await this.getWeeklyData(userId, totalHabits);

    // 5. Meilleure/Pire habitude
    const { bestHabit, worstHabit } = await this.getHabitRates(userId);

    // 6. Total et moyenne de la semaine
    const totalCompletedThisWeek = weeklyData.reduce((sum, day) => sum + day.completed, 0);
    const passedDays = weeklyData.filter(day => day.date <= today);
    const averagePerDay = passedDays.length > 0
      ? (passedDays.reduce((sum, day) => sum + day.completed, 0) / passedDays.length).toFixed(1)
      : '0';

    return {
      totalHabits,
      completedToday,
      totalCompletedThisWeek,
      averagePerDay,
      longestStreak,
      longestStreakName,
      successRate,
      weeklyData,
      bestHabit,
      worstHabit,
    };
  }

  private async calculateLongestStreak(userId: number): Promise<{ longestStreak: number; longestStreakName: string }> {
    const habits = await this.statsRepo.getHabitsForStreak(userId);
    const habitRepo = new HabitRepository();

	let longestStreak = 0;
    let longestStreakName = '';

    for (const habit of habits) {
      const streak = await habitRepo.calculateStreak(habit.id);
      if (streak > longestStreak) {
        longestStreak = streak;
        longestStreakName = habit.name;
      }
    }

    return { longestStreak, longestStreakName };
  }

  private async getWeeklyData(userId: number, totalHabits: number): Promise<WeeklyData[]> {
    const weekDates = getLast7Days();
    
    return await Promise.all(
      weekDates.map(async (date: string) => {
        const completed = await this.statsRepo.countCompletedForDate(userId, date);
        return { date, completed, total: totalHabits };
      })
    );
  }

  private async getHabitRates(userId: number): Promise<{ bestHabit: HabitRate | null; worstHabit: HabitRate | null }> {
    const habits = await this.statsRepo.getHabitsForStreak(userId);
    const weekDatesUntilToday = getWeekDaysUntilToday();
    const totalDaysElapsed = weekDatesUntilToday.length;

    const habitRates = await Promise.all(
      habits.map(async (habit) => {
        const completedCount = await this.statsRepo.countCompletedEntriesForDates(habit.id, weekDatesUntilToday);
        const rate = totalDaysElapsed > 0 ? Math.round((completedCount / totalDaysElapsed) * 100) : 0;
        return { name: habit.name, rate };
      })
    );

    if (habitRates.length === 0) {
      return { bestHabit: null, worstHabit: null };
    }

    habitRates.sort((a, b) => b.rate - a.rate);

    let bestHabit: HabitRate | null = habitRates[0] ?? null;
    let worstHabit: HabitRate | null = habitRates[habitRates.length - 1] ?? null;

    // Si tous les taux sont égaux
    if (habitRates.every(h => h.rate === habitRates[0]?.rate)) {
      if (habitRates[0]?.rate === 0) {
        bestHabit = null;
        worstHabit = null;
      } else if (habitRates[0]?.rate === 100) {
        worstHabit = null;
      } else {
        bestHabit = null;
        worstHabit = null;
      }
    }

    return { bestHabit, worstHabit };
  }
}