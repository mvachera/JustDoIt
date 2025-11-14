import { StatsRepository } from '../repositories/stats.repository';
import { HabitRepository } from '../repositories/habit.repository';
import { Stats, WeeklyData, HabitRate } from '../types/stats.types';
import { WeeklyEmailStats, MonthlyEmailStats } from '../types/notifs.type'
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

  async getWeeklyStatsForEmail(userId: number): Promise<WeeklyEmailStats> {
    const today = new Date();
    const lastMonday = new Date(today);
    lastMonday.setDate(today.getDate() - ((today.getDay() + 6) % 7) - 7);
    const lastSunday = new Date(lastMonday);
    lastSunday.setDate(lastMonday.getDate() + 6);

    const startDate = lastMonday.toISOString().split('T')[0];
    const endDate = lastSunday.toISOString().split('T')[0];

    // Récupère les habitudes
    const habits = await this.statsRepo.getHabitsForStreak(userId);

    // Calcule les complétions pour chaque jour de la semaine dernière
    const weekDates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(lastMonday);
      date.setDate(lastMonday.getDate() + i);
      weekDates.push(date.toISOString().split('T')[0]!);
    }

    // Pour chaque habitude, calcule son taux de complétion
    const habitRates = await Promise.all(
      habits.map(async (habit) => {
        const completedCount = await this.statsRepo.countCompletedEntriesForDates(habit.id, weekDates);
        const completionRate = Math.round((completedCount / 7) * 100);
        return { name: habit.name, completionRate };
      })
    );

    // Top 3 habitudes
    const topHabits = habitRates
      .sort((a, b) => b.completionRate - a.completionRate)
      .slice(0, 3);

    // Jours où au moins une habitude a été complétée
    let completedDays = 0;
    for (const date of weekDates) {
      const completed = await this.statsRepo.countCompletedForDate(userId, date);
      if (completed > 0) completedDays++;
    }

    // Taux de complétion global
    const totalPossible = habits.length * 7;
    const totalCompleted = habitRates.reduce((sum, h) => sum + (h.completionRate * 7 / 100), 0);
    const completionRate = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

    // Meilleur streak
    const { longestStreak } = await this.calculateLongestStreak(userId);

    return {
      completionRate,
      completedDays,
      bestStreak: longestStreak,
      topHabits
    };
  } 

  async getMonthlyStatsForEmail(userId: number): Promise<MonthlyEmailStats> {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    const monthName = lastMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    const totalDaysInMonth = lastMonthEnd.getDate();

    // Crée un tableau de toutes les dates du mois dernier
    const monthDates: string[] = [];
    for (let i = 0; i < totalDaysInMonth; i++) {
      const date = new Date(lastMonth);
      date.setDate(lastMonth.getDate() + i);
      monthDates.push(date.toISOString().split('T')[0]!);
    }

    // Récupère les habitudes
    const habits = await this.statsRepo.getHabitsForStreak(userId);

    // Stats par habitude
    const habitStats = await Promise.all(
      habits.map(async (habit) => {
        const completedCount = await this.statsRepo.countCompletedEntriesForDates(habit.id, monthDates);
        const completionRate = Math.round((completedCount / totalDaysInMonth) * 100);
        return { name: habit.name, completionRate };
      })
    );

    const topHabits = habitStats
      .sort((a, b) => b.completionRate - a.completionRate)
      .slice(0, 5);

    // Jours complétés
    let completedDays = 0;
    for (const date of monthDates) {
      const completed = await this.statsRepo.countCompletedForDate(userId, date);
      if (completed > 0) completedDays++;
    }

    // Taux de complétion global
    const totalPossible = habits.length * totalDaysInMonth;
    const totalCompleted = habitStats.reduce((sum, h) => sum + (h.completionRate * totalDaysInMonth / 100), 0);
    const completionRate = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

    // Calcul amélioration vs mois précédent
    const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, 1);
    const twoMonthsAgoEnd = new Date(today.getFullYear(), today.getMonth() - 1, 0);
    const prevTotalDays = twoMonthsAgoEnd.getDate();

    const prevMonthDates: string[] = [];
    for (let i = 0; i < prevTotalDays; i++) {
      const date = new Date(twoMonthsAgo);
      date.setDate(twoMonthsAgo.getDate() + i);
      prevMonthDates.push(date.toISOString().split('T')[0]!);
    }

    const prevHabitStats = await Promise.all(
      habits.map(async (habit) => {
        const completedCount = await this.statsRepo.countCompletedEntriesForDates(habit.id, prevMonthDates);
        return (completedCount / prevTotalDays) * 100;
      })
    );

    const prevCompletionRate = prevHabitStats.length > 0
      ? Math.round(prevHabitStats.reduce((a, b) => a + b, 0) / prevHabitStats.length)
      : 0;

    const improvementFromLastMonth = completionRate - prevCompletionRate;

    const { longestStreak } = await this.calculateLongestStreak(userId);

    return {
      totalHabits: habits.length,
      completionRate,
      completedDays,
      totalDaysInMonth,
      bestStreak: longestStreak,
      topHabits,
      monthName,
      improvementFromLastMonth
    };
  }
}