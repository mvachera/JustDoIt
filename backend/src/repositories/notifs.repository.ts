import { queryOne, query } from '../config/database';

export const getUserNotifications = async (userId: number) => {
  return await queryOne(
    `SELECT daily_reminder_enabled, weekly_stats_enabled, monthly_stats_enabled 
     FROM users WHERE id = $1`,
    [userId]
  );
};

export const updateUserNotifications = async (userId: number, notifications: any) => {
  const fields = [];
  const values = [];
  let paramIndex = 1;

  if (notifications.daily_reminder_enabled !== undefined) {
    fields.push(`daily_reminder_enabled = $${paramIndex++}`);
    values.push(notifications.daily_reminder_enabled);
  }
  if (notifications.weekly_stats_enabled !== undefined) {
    fields.push(`weekly_stats_enabled = $${paramIndex++}`);
    values.push(notifications.weekly_stats_enabled);
  }
  if (notifications.monthly_stats_enabled !== undefined) {
    fields.push(`monthly_stats_enabled = $${paramIndex++}`);
    values.push(notifications.monthly_stats_enabled);
  }

  values.push(userId);

  await query(
    `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramIndex}`,
    values
  );
};