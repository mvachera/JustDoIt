import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// URL dynamique selon l'environnement
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// === HELPERS POUR LES TEMPLATES === 

const getEmailStyle = () => `
  font-family: Arial, sans-serif; 
  max-width: 600px; 
  margin: 0 auto;
`;

const getButtonStyle = () => `
  display: inline-block; 
  background: #2563eb; 
  color: white; 
  padding: 12px 24px; 
  text-decoration: none; 
  border-radius: 6px; 
  margin-top: 20px;
`;

// === TEMPLATES HTML ===

const resetPasswordTemplate = (name: string, resetUrl: string) => `
  <div style="${getEmailStyle()}">
    <h2>Bonjour ${name},</h2>
    <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
    <p>Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>Ce lien expire dans 5 minutes.</p>
    <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
  </div>
`;

const dailyReminderTemplate = (name: string) => `
  <div style="${getEmailStyle()}">
    <h2>Salut ${name} ! 👋</h2>
    <p>C'est l'heure de valider tes habitudes du jour.</p>
    <a href="${FRONTEND_URL}/habits" style="${getButtonStyle()}">
      Voir mes habitudes
    </a>
  </div>
`;

interface WeeklyStats {
  completionRate: number;
  completedDays: number;
  bestStreak: number;
  topHabits: { name: string; completionRate: number }[];
}

const weeklyStatsTemplate = (name: string, stats: WeeklyStats) => {
  const emoji = stats.completionRate >= 80 ? '🔥' : stats.completionRate >= 60 ? '💪' : '📈';
  const message = stats.completionRate >= 80 
    ? 'Incroyable semaine ! Continue comme ça ! 🚀' 
    : stats.completionRate >= 60 
    ? 'Belle semaine ! Encore un petit effort ! 💪'
    : 'Cette semaine était difficile, mais la prochaine sera meilleure ! 📈';

  return `
    <div style="${getEmailStyle()}">
      <h2>📊 Tes stats de la semaine</h2>
      
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Vue d'ensemble ${emoji}</h3>
        <p><strong>${stats.completionRate}%</strong> de taux de complétion</p>
        <p><strong>${stats.completedDays}</strong> jours validés sur 7</p>
        <p>Meilleur streak : <strong>${stats.bestStreak} jours</strong> 🔥</p>
      </div>

      ${stats.topHabits.length > 0 ? `
        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px;">
          <h3 style="margin-top: 0; color: #059669;">🏆 Top habitudes</h3>
          ${stats.topHabits.map((h, i) => `
            <p>${i + 1}. <strong>${h.name}</strong> - ${h.completionRate}%</p>
          `).join('')}
        </div>
      ` : ''}

      <div style="margin-top: 30px; text-align: center;">
        <p style="font-size: 18px;">${message}</p>
        <a href="${FRONTEND_URL}/habits" style="${getButtonStyle()}">
          Voir mes habitudes
        </a>
      </div>
    </div>
  `;
};

interface MonthlyStats extends WeeklyStats {
  totalHabits: number;
  totalDaysInMonth: number;
  improvementFromLastMonth: number;
  monthName: string;
}

const monthlyStatsTemplate = (name: string, stats: MonthlyStats) => {
  const emoji = stats.completionRate >= 80 ? '🏆' : stats.completionRate >= 60 ? '⭐' : '🌟';
  const trend = stats.improvementFromLastMonth > 0 ? '📈' : stats.improvementFromLastMonth < 0 ? '📉' : '➡️';
  const trendColor = stats.improvementFromLastMonth > 0 ? '#059669' : stats.improvementFromLastMonth < 0 ? '#dc2626' : '#6b7280';
  
  return `
    <div style="${getEmailStyle()}">
      <h2>📅 Bilan de ${stats.monthName}</h2>
      
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px; text-align: center;">
        <h3 style="font-size: 24px; margin: 0 0 20px 0;">Taux de complétion ${emoji}</h3>
        <p style="font-size: 48px; margin: 0; font-weight: bold;">${stats.completionRate}%</p>
        <p style="margin: 20px 0 0 0;">${stats.completedDays} jours sur ${stats.totalDaysInMonth}</p>
      </div>

      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>📊 Statistiques</h3>
        <p>Habitudes : <strong>${stats.totalHabits}</strong></p>
        <p>Meilleur streak : <strong>${stats.bestStreak} jours</strong> 🔥</p>
        <p>Évolution : <strong style="color: ${trendColor};">
          ${stats.improvementFromLastMonth > 0 ? '+' : ''}${stats.improvementFromLastMonth}%
        </strong> ${trend}</p>
      </div>

      ${stats.topHabits.length > 0 ? `
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px;">
          <h3 style="color: #d97706;">🥇 Top habitudes</h3>
          ${stats.topHabits.slice(0, 5).map((h, i) => `
            <div style="background: white; padding: 12px; margin: 10px 0; border-radius: 6px;">
              ${['🥇', '🥈', '🥉', '🏅', '🏅'][i]} <strong>${h.name}</strong> - ${h.completionRate}%
            </div>
          `).join('')}
        </div>
      ` : ''}

      <div style="text-align: center; margin-top: 30px;">
        <a href="${FRONTEND_URL}/stats" style="${getButtonStyle()}">
          Voir toutes mes stats
        </a>
      </div>
    </div>
  `;
};

// === FONCTIONS D'ENVOI ===

export const sendResetEmail = async (email: string, name: string, resetToken: string) => {
  const resetUrl = `${FRONTEND_URL}/reset-password?token=${resetToken}`;
  
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Réinitialisation de votre mot de passe',
    html: resetPasswordTemplate(name, resetUrl),
  });
};

export const sendDailyReminder = async (email: string, name: string) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: `${name}, n'oublie pas tes habitudes ! 💪`,
    html: dailyReminderTemplate(name),
  });
};

export const sendWeeklyStats = async (email: string, name: string, stats: WeeklyStats) => {
  const emoji = stats.completionRate >= 80 ? '🔥' : stats.completionRate >= 60 ? '💪' : '📈';
  
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: `${name}, ton récap hebdo est là ! ${emoji}`,
    html: weeklyStatsTemplate(name, stats),
  });
};

export const sendMonthlyStats = async (email: string, name: string, stats: MonthlyStats) => {
  const emoji = stats.completionRate >= 80 ? '🏆' : stats.completionRate >= 60 ? '⭐' : '🌟';
  
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: `${name}, ton bilan de ${stats.monthName} ${emoji}`,
    html: monthlyStatsTemplate(name, stats),
  });
};