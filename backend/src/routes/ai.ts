import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { dbAll } from '../config/database';
import { getWeekDaysUntilToday } from '../utils/dateHelpers';
import { HabitRepository } from '../repositories/habit.repository';

const router = express.Router();

interface ClaudeResponse {
  content: Array<{ text: string; type: string }>;
}

router.post('/analyze', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

	const habitRepo = new HabitRepository();

    // Récupère les habitudes avec leurs stats
    const weekDays = getWeekDaysUntilToday();

	if (weekDays.length === 0) {
	  return res.status(400).json({ error: 'Erreur calcul dates' });
	}

	const totalDaysThisWeek = weekDays.length;
	const placeholders = weekDays.map(() => '?').join(',');

	const habitsRaw = await dbAll(
	  `SELECT 
	    h.id,
	    h.name,
	    h.category,
	    h.difficulty,
	    h.best_streak,
	    COUNT(CASE WHEN he.completed = 1 AND he.date IN (${placeholders}) THEN 1 END) as completed_this_week
	  FROM habits h
	  LEFT JOIN habit_entries he ON h.id = he.habit_id
	  WHERE h.user_id = ?
	  GROUP BY h.id`,
	  [...weekDays, userId]
	) as any[];

    // Calcule les vrais streaks et le taux de la semaine en cours
    const habits = await Promise.all(
      habitsRaw.map(async (h) => {
        const streak = await habitRepo.calculateStreak(h.id);
        const completionRate = totalDaysThisWeek > 0 
          ? Math.round((h.completed_this_week / totalDaysThisWeek) * 100)
          : 0;
        
        return {
          ...h,
          streak,
          completed_last_week: h.completed_this_week,
          completionRate
        };
      })
    );

    if (habits.length === 0) {
      return res.status(400).json({ 
        error: 'Vous devez avoir au moins une habitude pour obtenir une analyse' 
      });
    }

    // Appel à l'API Claude
    const analysis = await analyzeHabitsWithAI(habits);

    res.json(analysis);
  } catch (error) {
    console.error('Erreur analyse IA:', error);
    res.status(500).json({ error: 'Erreur lors de l\'analyse' });
  }
});

async function analyzeHabitsWithAI(habits: any[]) {
  // Construit le prompt
  const habitsSummary = habits.map(h => 
    `- ${h.name} (${h.category}, difficulté: ${h.difficulty})
     Streak actuel: ${h.streak} jours
     Record: ${h.best_streak} jours
     Complétée ${h.completed_last_week}/7 derniers jours (${Math.round((h.completed_last_week / 7) * 100)}%)`
  ).join('\n');

  const prompt = `Tu es un coach personnel expert en développement d'habitudes.

CONTEXTE IMPORTANT : L'utilisateur est limité à 5 habitudes maximum. Cette limite existe pour favoriser 
la concentration sur l'essentiel et éviter la dispersion. Trop d'habitudes mènerait à l'échec de certaines.

Voici les habitudes actuelles de l'utilisateur (${habits.length}/5) :

${habitsSummary}

STRUCTURE D'UNE HABITUDE :
- Nom : le nom de l'habitude
- Description : description facultative donnant des détails
- Catégorie : Sport / Détente / Apprentissage / Santé / Travail / Social
- Difficulté : easy (Facile) / medium (Moyen) / hard (Difficile)
- Streak actuel : nombre de jours consécutifs réussis (se réinitialise si un jour manqué)
- Meilleur streak (record) : plus longue série de tous les temps
- Taux de complétion (semaine en cours) : nombre de jours complétés depuis le début de la semaine (lundi-dimanche)

⚠️ IMPORTANT : Le taux de complétion est calculé sur la SEMAINE EN COURS uniquement, pas sur 7 jours glissants.
Exemple : Si on est mardi, le taux maximum possible est 2/7 jours (lundi + mardi).
Ne pénalise pas les utilisateurs si on est en début de semaine !

Analyse ces habitudes et donne des conseils CONCRETS et PERSONNALISÉS en te basant sur :
- Les taux de complétion (en tenant compte du jour de la semaine actuel)
- Les streaks (qui montre la régularité et la motivation sur le long terme)
- La difficulté déclarée vs performance réelle (est-ce que la difficulté choisie est adaptée ?)
- Les catégories (pour un équilibre de vie entre Sport, Détente, Apprentissage, Santé, Travail, Social)
- Les descriptions (pour comprendre l'intention derrière l'habitude)
- Le nombre d'habitudes actuelles (${habits.length}/5)

RÈGLES D'ANALYSE :
- Si une habitude "hard" a un faible taux (<40%) ET un faible streak (<3 jours), suggère de la simplifier ou de baisser la difficulté
- Si une habitude "easy" a un excellent taux (>90%) ET un bon streak (>7 jours), suggère de la rendre plus ambitieuse
- Si l'utilisateur a <5 habitudes ET qu'elles sont performantes (streak >5 jours), suggère d'en ajouter une dans une catégorie manquante
- Si l'utilisateur a 5 habitudes, suggère de REMPLACER une habitude qui performe mal (streak <3 jours et faible complétion) par une meilleure
- Si l'utilisateur a 5 habitudes qui performent toutes bien (bon streak), suggère d'améliorer celle avec le taux le plus faible
- Privilégie la QUALITÉ à la QUANTITÉ : mieux vaut 3 habitudes solides que 5 habitudes négligées
- Analyse l'équilibre des catégories (ex: trop de Sport et pas assez de Détente)
- SOIS INDULGENT en début de semaine : ne critique pas un taux de 1/7 si on est lundi !

Réponds UNIQUEMENT avec un objet JSON valide (sans backticks markdown) dans ce format :
{
  "improve": {
    "habit": "nom exact de l'habitude",
    "reason": "pourquoi cette habitude pose problème (mentionne la difficulté, catégorie, streak ou performance)",
    "suggestion": "conseil concret et actionnable (ex: changer la difficulté, ajuster la description, modifier l'approche)"
  },
  "replace": {
    "habit": "nom exact de l'habitude à remplacer OU 'none' si <5 habitudes",
    "reason": "pourquoi la remplacer OU pourquoi ajouter une nouvelle (mentionne la catégorie manquante si pertinent)",
    "newHabit": "suggestion de nouvelle habitude avec nom concret",
    "category": "catégorie suggérée (Sport/Détente/Apprentissage/Santé/Travail/Social)",
    "difficulty": "difficulté suggérée (easy/medium/hard)",
    "description": "description suggérée pour cette nouvelle habitude"
  },
  "motivation": "message motivant et encourageant basé sur les progrès réels (STREAKS surtout). 
  Mentionne les points forts (bons streaks, catégories bien choisies, etc.). 
  NE MENTIONNE LA LIMITE DE 5 HABITUDES QUE SI l'utilisateur en a exactement 5 OU s'il en a moins de 3 (pour l'encourager à en ajouter)."
}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.CLAUDE_API_KEY || '',
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json() as any;

    if (!response.ok) {
      throw new Error(`Erreur API Claude: ${data.error?.message || 'Unknown'}`);
    }

    const content = data.content?.[0]?.text;
    
    if (!content) {
      throw new Error('Réponse invalide de l\'API Claude');
    }

    // Parse la réponse JSON
    const analysis = JSON.parse(content);
    
    return analysis;
  } catch (error) {
    console.error('Erreur appel Claude:', error);
    throw error;
  }
}

export default router;