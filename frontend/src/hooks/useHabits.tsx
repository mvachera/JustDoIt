import { useState } from 'react';
import { fetchWithAuth } from '../utils/api';
import { useToast } from './use-toast';
import { Habit } from '../types/habits';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchHabits = async () => {
    try {
      const response = await fetchWithAuth('/api/habits', { method: 'GET' });

      if (response.ok) {
        const data = await response.json();
        setHabits(data);
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de récupérer vos habitudes",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur réseau",
        description: "Impossible de se connecter au serveur",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteHabit = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette habitude ?')) {
      return;
    }

    try {
      const response = await fetchWithAuth(`/api/habits/${id}`, { method: 'DELETE' });

      if (response.ok) {
        toast({
          title: "Habitude supprimée",
          description: "L'habitude a été supprimée avec succès",
        });
        setHabits(habits.filter(h => h.id !== id));
      } else {
        const error = await response.json();
        toast({
          title: "Erreur",
          description: error.error || 'Erreur lors de la suppression',
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur réseau",
        description: "Impossible de se connecter au serveur",
        variant: "destructive",
      });
    }
  };

  const toggleHabit = async (id: number) => {
  try {
    const response = await fetchWithAuth(`/api/habits/${id}/toggle`, {
      method: 'POST',
    });

    if (response.ok) {
      const data = await response.json();
      toast({
        title: data.completed ? "Habitude complétée ✓" : "Habitude annulée",
        description: data.completed 
          ? "Bien joué ! Continue comme ça 🎉" 
          : "Marqué comme non complété",
      });
      
      // Recharge les habitudes pour mettre à jour l'affichage
      fetchHabits();
    } else {
      const error = await response.json();
      toast({
        title: "Erreur",
        description: error.error || 'Erreur lors du marquage',
        variant: "destructive",
      });
    }
  } catch (error) {
    toast({
      title: "Erreur réseau",
      description: "Impossible de se connecter au serveur",
      variant: "destructive",
      });
    }
  };

  return {
    habits,
    isLoading,
    fetchHabits,
    deleteHabit,
    toggleHabit,
  };
}