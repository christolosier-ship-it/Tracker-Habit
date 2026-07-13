import { ThemeId } from './themes/theme-types';
export type HabitCategory='Routine'|'Santé'|'Productivité'|'Anti-procrastination'|'Maison'|'Famille'|'Développement'|'Finances'|'Projet perso'|'Autre';
export type HabitFrequency='quotidienne'|'hebdomadaire'; export type HabitPriority='faible'|'normale'|'haute'; export type HabitStatus='empty'|'done'|'partial'|'missed'|'rest';
export type Habit={id:string;nom:string;categorie:HabitCategory;frequence:HabitFrequency;objectif:string;priorite:HabitPriority;active:boolean;couleur?:string;dateCreation:string};
export type HabitLog={habitId:string;date:string;status:HabitStatus}; export type UserSettings={anneeActive:number;moisActif:number;compterNonSaisisCommeManques:boolean;themeId:ThemeId;mascotEnabled:boolean};
export type MonthStats={mois:number;score:number;tauxReussite:number;joursDisciplines:number}; export type YearStats={annee:number;score:number;tauxReussite:number;mois:MonthStats[]};
export type CategoryStats={categorie:HabitCategory;score:number;total:number}; export type StatusStats={status:HabitStatus;label:string;value:number};
