import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHabits } from './useHabits';
import * as api from '../utils/api';

// Simule les dépendances
vi.mock('../utils/api');
vi.mock('./use-toast', () => ({
  useToast: () => ({ toast: vi.fn() })
}));
vi.mock('../contexts/HabitsContext', () => ({
  useHabits: () => ({
    habits: [],
    isLoading: false,
    refreshHabits: vi.fn()
  })
}));

describe('useHabits - Tests courts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ✅ TEST 1 : Création réussie
  it('crée une habitude', async () => {
    // Simule une réponse OK
    vi.mocked(api.fetchWithAuth).mockResolvedValue({
      ok: true,
      json: async () => ({ id: 1, name: 'Sport' })
    } as any);

    const { result } = renderHook(() => useHabits());
    
    let success;
    await act(async () => {
      success = await result.current.createHabit({
        name: 'Sport',
        category: 'Santé',
        difficulty: 'easy'
      });
    });

    expect(success).toBe(true); // ✅ Ça marche
  });

  // ✅ TEST 2 : Erreur
  it('retourne false si erreur', async () => {
    // Simule une erreur
    vi.mocked(api.fetchWithAuth).mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Erreur' })
    } as any);

    const { result } = renderHook(() => useHabits());
    
    let success;
    await act(async () => {
      success = await result.current.createHabit({
        name: 'Sport',
        category: 'Santé',
        difficulty: 'easy'
      });
    });

    expect(success).toBe(false); // ✅ Retourne false
  });

  // ✅ TEST 3 : Appel API correct
  it('appelle la bonne URL', async () => {
    vi.mocked(api.fetchWithAuth).mockResolvedValue({
      ok: true,
      json: async () => ({})
    } as any);

    const { result } = renderHook(() => useHabits());
    
    await act(async () => {
      await result.current.createHabit({
        name: 'Sport',
        category: 'Santé',
        difficulty: 'easy'
      });
    });

    // Vérifie que l'API a été appelée avec la bonne URL
    expect(api.fetchWithAuth).toHaveBeenCalledWith(
      '/api/habits',
      expect.any(Object)
    );
  });
});