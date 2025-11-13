import { HabitRepository } from '../repositories/habit.repository';
import { getLast7Days } from '../utils/dateHelpers';
import { CreateHabitDto, UpdateHabitDto } from '../types/habit.types';

export class HabitService {
  constructor(private habitRepo: HabitRepository) {}

  async getHabitsWithWeekData(userId: number) {
    const today = new Date().toISOString().split('T')[0]!;
    const habits = await this.habitRepo.getHabitsWithTodayStatus(userId, today);

    return await Promise.all(
      habits.map(async (habit) => {
        const weekDates = getLast7Days();
        const entries = await this.habitRepo.getEntriesForDates(habit.id, weekDates);

        const entriesMap = new Map(
          entries.map(e => [e.date, e.completed === 1])
        );

        const weekData = weekDates.map(date => entriesMap.get(date) || false);
        const streak = await this.habitRepo.calculateStreak(habit.id);

        return {
          ...habit,
          weekData,
          streak
        };
      })
    );
  }

  async createHabit(userId: number, dto: CreateHabitDto) {
    const count = await this.habitRepo.countHabitsByUser(userId);

    if (count >= 5) {
      throw new Error('Limite atteinte. Vous avez déjà 5 habitudes.');
    }

    return await this.habitRepo.createHabit(
      userId,
      dto.name,
      dto.description || '',
      dto.category || 'Sport',
      dto.difficulty || 'easy'
    );
  }

  async updateHabit(habitId: number, userId: number, dto: UpdateHabitDto) {
    const habit = await this.habitRepo.getHabitById(habitId, userId);

    if (!habit) {
      throw new Error('Habitude non trouvée');
    }

    return await this.habitRepo.updateHabit(
      habitId,
      dto.name,
      dto.description || '',
      dto.category,
      dto.difficulty
    );
  }

  async deleteHabit(habitId: number, userId: number) {
    const habit = await this.habitRepo.getHabitById(habitId, userId);

    if (!habit) {
      throw new Error('Habitude non trouvée');
    }

    await this.habitRepo.deleteHabit(habitId);
  }

  async toggleHabit(habitId: number, userId: number) {
    const habit = await this.habitRepo.getHabitById(habitId, userId);

    if (!habit) {
      throw new Error('Habitude non trouvée');
    }

    const today = new Date().toISOString().split('T')[0]!;
    const existingEntry = await this.habitRepo.getEntryForDate(habitId, today);

    let newStatus: number;

    if (existingEntry) {
      newStatus = existingEntry.completed === 1 ? 0 : 1;
      await this.habitRepo.updateEntry(existingEntry.id, newStatus);
    } else {
      await this.habitRepo.createEntry(habitId, today, 1);
      newStatus = 1;
    }

    if (newStatus === 1) {
      const currentStreak = await this.habitRepo.calculateStreak(habitId);
      
      if (currentStreak > habit.best_streak) {
        await this.habitRepo.updateBestStreak(habitId, currentStreak);
      }
    }

    return {
      completed: newStatus === 1,
      message: newStatus === 1 
        ? 'Habitude marquée comme complétée' 
        : 'Habitude marquée comme non complétée'
    };
  }
}