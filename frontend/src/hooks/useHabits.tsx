import { useState } from 'react';
import { fetchWithAuth } from '../utils/api';
import { useToast } from './use-toast';
import { Habit, HabitCategory, HabitDifficulty } from '../types/habits';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const getHabits = async () => {
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

  const createHabit = async (formData: {
    name: string;
    description?: string;
    category: HabitCategory;
    difficulty: HabitDifficulty;
  }) => {
    try {
      const response = await fetchWithAuth('/api/habits', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Habitude créée !",
          description: `${formData.name} a été ajoutée à vos habitudes.`,
        });

        // Recharge la liste après ajout
        getHabits();
        return true;
      } else {
        const error = await response.json();
        toast({
          title: "Erreur",
          description: error.error || "Erreur lors de la création",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Erreur réseau",
        description: "Impossible de se connecter au serveur",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateHabit = async (
    id: number,
    updatedData: {
      name?: string;
      description?: string;
      category?: HabitCategory;
      difficulty?: HabitDifficulty;
    }
  ) => {
    try {
      const response = await fetchWithAuth(`/api/habits/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Habitude modifiée ✅",
          description: `${data.name || 'Cette habitude'} a été mise à jour.`,
        });

        // Recharge la liste après modification
        getHabits();
        return true;
      } else {
        const error = await response.json();
        toast({
          title: "Erreur",
          description: error.error || "Erreur lors de la mise à jour",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Erreur réseau",
        description: "Impossible de se connecter au serveur",
        variant: "destructive",
      });
      return false;
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
      getHabits();
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

  const toggleAllHabits = async () => {
  try {
    // Filtre seulement les habitudes non complétées aujourd'hui
    const habitsToDo = habits.filter(h => h.completed_today === 0);
    
    if (habitsToDo.length === 0) {
      toast({
        title: "Déjà fait ! 🎉",
        description: "Toutes tes habitudes sont déjà complétées aujourd'hui",
      });
      return;
    }

    // Marque toutes les habitudes non faites
    const promises = habitsToDo.map(habit =>
      fetchWithAuth(`/api/habits/${habit.id}/toggle`, { method: 'POST' })
    );

    await Promise.all(promises);

    toast({
      title: `🎉 ${habitsToDo.length} habitude${habitsToDo.length > 1 ? 's' : ''} complétée${habitsToDo.length > 1 ? 's' : ''} !`,
      description: "Bravo, tu as tout validé pour aujourd'hui !",
    });

    // Recharge les habitudes
    getHabits();
  } catch (error) {
    toast({
      title: "Erreur",
      description: "Impossible de marquer toutes les habitudes",
      variant: "destructive",
    });
  }
  };

  return {
    habits,
    isLoading,
    getHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleHabit,
    toggleAllHabits,
  };
}