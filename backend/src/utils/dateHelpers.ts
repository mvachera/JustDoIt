// Fonction helper pour obtenir les 7 jours de la semaine courante (L-D)
export function getLast7Days(): string[] {
  const dates: string[] = [];
  const today = new Date();
  
  // Trouve le lundi de cette semaine
  const dayOfWeek = today.getDay(); // 0 = dimanche, 1 = lundi, etc.
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);

  // Génère lundi à dimanche
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    dates.push(date.toISOString().split('T')[0] as string);
  }

  return dates;
}

// Fonction helper pour obtenir les jours de la semaine JUSQU'À AUJOURD'HUI
export function getWeekDaysUntilToday(): string[] {
  const dates: string[] = [];
  const today = new Date();
  
  const dayOfWeek = today.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);

  // Calcule combien de jours se sont écoulés depuis lundi (0 = lundi, 6 = dimanche)
  const daysElapsed = dayOfWeek === 0 ? 7 : dayOfWeek; // Dimanche = 7 jours écoulés

  // Génère seulement les jours de lundi à aujourd'hui
  for (let i = 0; i < daysElapsed; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    dates.push(date.toISOString().split('T')[0] as string);
  }

  return dates;
}