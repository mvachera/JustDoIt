import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendDailyReminder(email: string, name: string) {
  await resend.emails.send({
    from: 'JustDoIt <onboarding@resend.dev>',
    to: email,
    subject: `${name}, n'oublie pas tes habitudes ! 💪`,
    html: `
      <h2>Salut ${name} ! 👋</h2>
      <p>C'est l'heure de valider tes habitudes du jour.</p>
      <a href="http://localhost:5173/habits">Voir mes habitudes →</a>
    `
  });
}