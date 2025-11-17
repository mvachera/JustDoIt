import { HabitRepository } from '../repositories/habit.repository';
import { ActivityData, CalendarStats, HabitStats } from '../types/calendar.types';

export class CalendarService {
  constructor(private habitRepo: HabitRepository) {}

  async getActivityData(
    userId: number, 
    start: string, 
    end: string
  ): Promise<ActivityData> {
    const habitIds = await this.habitRepo.getHabitIdsByUser(userId);
    
    if (habitIds.length === 0) {
      return {};
    }

    const entries = await this.habitRepo.getEntriesByDateRange(habitIds, start, end);
    
    return this.buildActivityMatrix(habitIds, start, end, entries);
  }

  async getStats(
    userId: number, 
    start: string, 
    end: string
  ): Promise<CalendarStats> {
    const habits = await this.habitRepo.getHabitsWithDetails(userId);
    const habitIds = habits.map(h => h.id);

    if (habitIds.length === 0) {
      return this.getEmptyStats();
    }

    const entries = await this.habitRepo.getEntriesByDateRange(habitIds, start, end);
    
    return this.calculateStats(habits, entries, start, end);
  }

  private buildActivityMatrix(
    habitIds: number[],
    start: string,
    end: string,
    entries: { habit_id: number; date: string; completed: number }[]
  ): ActivityData {
    const activityData: ActivityData = {};
    const startDate = new Date(start);
    const endDate = new Date(end);
    const currentDate = new Date(startDate);

    // Initialiser toutes les dates
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0]!;
      activityData[dateStr] = {};
      
      habitIds.forEach(habitId => {
        activityData[dateStr]![habitId] = false;
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Remplir avec les vraies données
    entries.forEach(entry => {
      if (activityData[entry.date] && !!entry.completed) {
        activityData[entry.date]![entry.habit_id] = true;
      }
    });

    return activityData;
  }

  private calculateStats(
    habits: { id: number; name: string; category: string }[],
    entries: { habit_id: number; date: string; completed: number }[],
    start: string,
    end: string
  ): CalendarStats {
    const habitStats: { [habitId: number]: HabitStats } = {};

    // Initialiser
    habits.forEach(habit => {
      habitStats[habit.id] = {
        completed: 0,
        total: 0,
        name: habit.name,
        category: habit.category
      };
    });

    // Compter les jours
    const totalDays = this.countDaysUntilToday(start, end);
    
    habits.forEach(habit => {
      habitStats[habit.id]!.total = totalDays;
    });

    // Compter les complétions
    let totalCompletions = 0;
    entries.forEach(entry => {
      if (!!entry.completed) {
        habitStats[entry.habit_id]!.completed++;
        totalCompletions++;
      }
    });

    return {
      totalDays,
      totalPossibleCompletions: habits.length * totalDays,
      totalCompletions,
      habitStats,
      bestHabit: this.findBestHabit(habitStats)
    };
  }

  private countDaysUntilToday(start: string, end: string): number {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const today = new Date();
    
    today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    let totalDays = 0;
    const currentDate = new Date(startDate);

    while (currentDate <= today && currentDate <= endDate) {
      totalDays++;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return totalDays;
  }

  private findBestHabit(habitStats: { [habitId: number]: HabitStats }) {
    let bestHabit = null;
    let bestPercentage = 0;

    Object.entries(habitStats).forEach(([id, stat]) => {
      const percentage = stat.total > 0 ? (stat.completed / stat.total) * 100 : 0;
      if (percentage > bestPercentage) {
        bestPercentage = percentage;
        bestHabit = {
          id: parseInt(id),
          name: stat.name,
          category: stat.category,
          percentage: Math.round(percentage)
        };
      }
    });

    return bestHabit;
  }

  private getEmptyStats(): CalendarStats {
    return {
      totalDays: 0,
      totalPossibleCompletions: 0,
      totalCompletions: 0,
      habitStats: {},
      bestHabit: null
    };
  }
}