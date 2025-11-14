import { useState } from 'react';
import { fetchWithAuth } from '../utils/api';

const COOLDOWN_TIME = 60000; // 1 minute

interface AIAnalysis {
  improve: {
    habit: string;
    reason: string;
    suggestion: string;
  };
  replace: {
    habit: string;
    reason: string;
    newHabit: string;
    category: string;
  };
  motivation: string;
}

export function useAIAnalysis() {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);

  const analyzeHabits = async () => {
    setError(null);

    // Vérifie le cooldown AVANT de set loading
    const lastAnalysis = localStorage.getItem('lastAIAnalysis');
    if (lastAnalysis) {
      const timeSinceLastAnalysis = Date.now() - parseInt(lastAnalysis);
      if (timeSinceLastAnalysis < COOLDOWN_TIME) {
        const remaining = Math.ceil((COOLDOWN_TIME - timeSinceLastAnalysis) / 1000);
        setRemainingTime(remaining);
        setError(`Veuillez attendre avant une nouvelle analyse.`);
        
        // Compte à rebours
        const interval = setInterval(() => {
          setRemainingTime((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              setError(null);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        return;
      }
    }

    setIsLoading(true);

    try {
      const response = await fetchWithAuth('/api/ai/analyze', {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('lastAIAnalysis', Date.now().toString());
        setAnalysis(data);
        return data;
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors de l\'analyse');
        return null;
      }
    } catch (err) {
      setError('Impossible de se connecter au serveur');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { analysis, isLoading, error, remainingTime, analyzeHabits };
}