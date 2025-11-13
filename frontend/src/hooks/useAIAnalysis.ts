import { useState } from 'react';
import { fetchWithAuth } from '../utils/api';

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

  const analyzeHabits = async () => {
    setIsLoading(true);
    setError(null);

  const lastAnalysis = localStorage.getItem('lastAnalysis');
  if (lastAnalysis && Date.now() - parseInt(lastAnalysis) < 60000) {
    setError("Attendez 1 minute entre chaque analyse");
    setIsLoading(false);
    return null;
  }

  try {
    const response = await fetchWithAuth('/api/ai/analyze', {
      method: 'POST',
    });

    if (response.ok) {
      const data = await response.json();
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

  return { analysis, isLoading, error, analyzeHabits };
}