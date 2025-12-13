import express from 'express';
import { 
  authenticateUser, 
  registerUser, 
  generateTokens, 
  setRefreshTokenCookie, 
  verifyRefreshToken,
  removeUserPassword 
} from '../services/authService';
import { updateRefreshToken } from '../repositories/auth.repository';
import { sendResetEmail } from '../services/emailService';
import { generateResetToken, resetPassword } from '../services/authService';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await authenticateUser(email, password);
    const { accessToken, refreshToken } = generateTokens(user.id);

    await updateRefreshToken(user.id, refreshToken);
    setRefreshTokenCookie(res, refreshToken);

    res.json({ accessToken, user: removeUserPassword(user) });

  } catch (error: any) {
    console.error('Erreur login:', error);
    res.status(400).json({ error: error.message || 'Erreur serveur.' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { email, password, confirmPassword, name } = req.body;

    const newUser = await registerUser(email, password, confirmPassword, name);
    const { accessToken, refreshToken } = generateTokens(newUser.id);

    await updateRefreshToken(newUser.id, refreshToken);
    setRefreshTokenCookie(res, refreshToken);

    res.status(201).json({ accessToken, user: removeUserPassword(newUser) });

  } catch (error: any) {
    console.error('Erreur register:', error);
    res.status(400).json({ error: error.message || 'Erreur serveur.' });
  }
});

router.post('/refresh', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  
  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token manquant" });
  }

  try {
    const userId = await verifyRefreshToken(refreshToken);
    const { accessToken } = generateTokens(userId);

    res.json({ accessToken });

  } catch (err) {
    console.error(err);
    res.status(403).json({ error: "Refresh token invalide ou expiré" });
  }
});

router.post('/logout', async (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Déconnecté' });
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const { resetToken, email: userEmail, name } = await generateResetToken(email);
    await sendResetEmail(userEmail, name, resetToken);

    res.json({ message: 'Email de réinitialisation envoyé.' });

  } catch (error: any) {
    console.error('Erreur forgot-password:', error);
    res.status(400).json({ error: error.message || 'Erreur serveur.' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    await resetPassword(token, password);

    res.json({ message: 'Mot de passe réinitialisé avec succès.' });

  } catch (error: any) {
    console.error('Erreur reset-password:', error);
    res.status(400).json({ error: error.message || 'Erreur serveur.' });
  }
});

import { transporter } from '../services/emailService';

router.get('/test-email', async (req, res) => {
  try {
    console.log('Test de connexion SMTP...');
    await transporter.verify();
    console.log('✅ Connexion SMTP OK');
    res.json({ success: true, message: 'SMTP fonctionne' });
  } catch (error: any) {
    console.error('❌ Erreur SMTP:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;