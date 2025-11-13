import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendResetEmail = async (email: string, name: string, resetToken: string) => {
  const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Réinitialisation de votre mot de passe',
    html: `
      <h2>Bonjour ${name},</h2>
      <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
      <p>Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>Ce lien expire dans 1 heure.</p>
      <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
    `,
  });
};