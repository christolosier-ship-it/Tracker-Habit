import { Habit, HabitCategory, HabitLog, UserSettings } from '../types';

export const categories: HabitCategory[] = [
  'Routine',
  'Santé',
  'Productivité',
  'Anti-procrastination',
  'Maison',
  'Famille',
  'Développement',
  'Finances',
  'Projet perso',
  'Autre',
];

const categoryByHabit: Record<string, HabitCategory> = {
  'Lever tôt': 'Routine',
  'Coucher avant 23h': 'Routine',
  'Deep work 60 min': 'Productivité',
  'Tâche prioritaire du jour': 'Productivité',
  'Lecture 15 min': 'Développement',
  Sport: 'Santé',
  'Marche 20 min': 'Santé',
  'Hydratation 2L': 'Santé',
  'Zéro scrolling matin': 'Anti-procrastination',
  'Rangement 10 min': 'Maison',
  'Admin perso 15 min': 'Productivité',
  'Projet perso': 'Projet perso',
  'Planifier demain': 'Routine',
  'Zéro grignotage': 'Santé',
  'Temps famille': 'Famille',
  Étirements: 'Santé',
  Apprentissage: 'Développement',
  'Budget / finances': 'Finances',
  'Ménage rapide': 'Maison',
  'Inbox zéro': 'Productivité',
  'Commencer par la tâche pénible': 'Anti-procrastination',
  '15 min sur un truc repoussé': 'Anti-procrastination',
  'Préparer affaires du lendemain': 'Routine',
  'Revue de journée': 'Routine',
  'Pas d’écran au lit': 'Routine',
  'Respiration / pause calme': 'Santé',
  'Suivi dépenses': 'Finances',
  'Appel ou message important': 'Famille',
  'Rangement numérique': 'Productivité',
  'Préparer demain': 'Routine',
};

const daily = [
  'Lever tôt',
  'Coucher avant 23h',
  'Deep work 60 min',
  'Tâche prioritaire du jour',
  'Lecture 15 min',
  'Sport',
  'Marche 20 min',
  'Hydratation 2L',
  'Zéro scrolling matin',
  'Rangement 10 min',
  'Admin perso 15 min',
  'Projet perso',
  'Planifier demain',
  'Zéro grignotage',
  'Temps famille',
  'Étirements',
  'Apprentissage',
  'Budget / finances',
  'Ménage rapide',
  'Inbox zéro',
  'Commencer par la tâche pénible',
  '15 min sur un truc repoussé',
  'Préparer affaires du lendemain',
  'Revue de journée',
  'Pas d’écran au lit',
  'Respiration / pause calme',
  'Suivi dépenses',
  'Appel ou message important',
  'Rangement numérique',
  'Préparer demain',
];

const weekly = [
  'Revue hebdomadaire',
  'Planification semaine',
  'Sport long',
  'Courses',
  'Ménage complet',
  'Budget semaine',
  'Sauvegarde fichiers',
  'Appeler famille',
  'Sortie famille',
  'Projet perso 2h',
  'Lecture longue',
  'Préparation repas',
  'Tri administratif',
  'Bilan anti-procrastination',
  'Préparer lundi',
];

const now = new Date();
const demoYear = now.getFullYear();
const isoDate = `${demoYear}-01-01`;

export const demoHabits: Habit[] = [
  ...daily.map((nom, i) => ({
    id: `d${i + 1}`,
    nom,
    categorie: categoryByHabit[nom] ?? categories[i % categories.length],
    frequence: 'quotidienne' as const,
    objectif: i % 4 === 0 ? 'Avant midi' : i % 3 === 0 ? '60 min' : '1 fois',
    priorite: i % 6 === 0 ? ('haute' as const) : i % 2 ? ('normale' as const) : ('faible' as const),
    active: true,
    couleur: ['#0B3D2E', '#1F6B4E', '#C96A3A', '#B98A3B'][i % 4],
    dateCreation: isoDate,
  })),
  ...weekly.map((nom, i) => ({
    id: `w${i + 1}`,
    nom,
    categorie: categories[(i + 3) % categories.length],
    frequence: 'hebdomadaire' as const,
    objectif: '1 fois / semaine',
    priorite: i % 4 === 0 ? ('haute' as const) : ('normale' as const),
    active: true,
    couleur: '#B98A3B',
    dateCreation: isoDate,
  })),
];

export const defaultSettings: UserSettings = {
  anneeActive: demoYear,
  moisActif: now.getMonth(),
  compterNonSaisisCommeManques: false,
  themeId: 'dopamine-pop',
  mascotEnabled: true,
};

function weightedDemoStatus(day: number, month: number, habitIndex: number) {
  const rhythm = (day * 3 + month * 5 + habitIndex * 7) % 100;
  const momentumBonus = Math.min(month * 4, 24);
  if (rhythm < 54 + momentumBonus) return 'done';
  if (rhythm < 70 + momentumBonus) return 'partial';
  if (rhythm < 84 + momentumBonus / 2) return 'missed';
  if (rhythm < 91) return 'rest';
  return 'empty';
}

export function createDemoLogs() {
  const logs: HabitLog[] = [];
  const currentMonth = now.getMonth();
  const currentDay = now.getDate();

  for (let month = 0; month <= currentMonth; month += 1) {
    const daysInMonth = new Date(demoYear, month + 1, 0).getDate();
    const maxDay = month === currentMonth ? currentDay : daysInMonth;

    for (const habit of demoHabits) {
      const habitIndex = Number(habit.id.slice(1));

      for (let day = 1; day <= maxDay; day += 1) {
        if (habit.frequence === 'hebdomadaire' && ![1, 8, 15, 22, 29].includes(day)) continue;
        const status = weightedDemoStatus(day, month, habitIndex) as HabitLog['status'];
        logs.push({
          habitId: habit.id,
          date: `${demoYear}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
          status,
        });
      }
    }
  }

  return logs;
}
