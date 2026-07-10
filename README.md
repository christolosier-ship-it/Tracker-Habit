# Discipline Dashboard — habit-tracker-premium-fr

Application React TypeScript Vite de suivi d’habitudes premium en français, sans compte, sans serveur et avec sauvegarde `localStorage`.

## Installation

```bash
npm install
npm run dev
npm run build
```

## Structure

- `src/main.tsx` : application, navigation, pages et composants principaux.
- `src/types.ts` : modèle de données typé.
- `src/lib/stats.ts` : fonctions de calcul testables.
- `src/lib/storage.ts` : persistance locale, export/import, reset.
- `src/data/demoData.ts` : 30 habitudes quotidiennes, 15 hebdomadaires et journaux réalistes.
- `src/styles.css` : thème premium sombre, crème, vert et orange brûlé.

## Fonctionnalités

- Dashboard annuel 12 mois avec heatmap, KPI et graphiques Recharts.
- Page Aujourd’hui optimisée mobile avec cycle de statuts rapide.
- Vue Mois desktop en matrice habitudes × jours.
- Gestion des habitudes : ajout, édition du nom, activation/désactivation.
- Statistiques, anti-procrastination, export/import JSON et reset.

## Limites connues

- V1 locale uniquement : pas de synchronisation multi-appareil.
- Import JSON avec validation minimale.
- Vue mobile mensuelle volontairement simplifiée.

## Pistes V2

- Export Excel `.xlsx`.
- IndexedDB.
- Notifications PWA.
- Sauvegarde cloud optionnelle.
- Thèmes personnalisables.
