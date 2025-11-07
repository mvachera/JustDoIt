// HabitsContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Habit } from '../types/habits';
import { fetchWithAuth } from '../utils/api';
import { useAuth } from './AuthContext';

interface HabitsContextType {
  habits: Habit[];
  isLoading: boolean;
  refreshHabits: () => Promise<void>;
}

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

export function HabitsProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoggedIn } = useAuth();

  async function fetchHabits() {
    if (!isLoggedIn) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetchWithAuth('/api/habits', { method: 'GET' });
      if (response.ok) {
        const data = await response.json();
        setHabits(data);
      }
    } catch (error) {
      console.error('Erreur chargement habitudes:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchHabits();
  }, [isLoggedIn]);

  return (
    <HabitsContext.Provider value={{ habits, isLoading, refreshHabits: fetchHabits }}>
      {children}
    </HabitsContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitsContext);
  if (!context) {
    throw new Error('useHabits doit être utilisé dans HabitsProvider');
  }
  return context;
}