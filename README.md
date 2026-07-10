# Discipline Dashboard — habit-tracker-premium-fr

Application React TypeScript Vite de suivi d’habitudes premium en français, sans compte, sans serveur et avec sauvegarde `localStorage`.

## Installation

```bash
npm install
npm run dev
npm run build
```

## Déploiement GitHub Pages

Le projet est configuré pour GitHub Pages avec Vite :

- `vite.config.ts` utilise `base: '/Tracker-Habit/'` en build.
- `.github/workflows/deploy.yml` compile l’application puis publie le dossier `dist`.
- Le workflow construit aussi les pull requests pour éviter de merger une page blanche.

Après merge sur `main`, GitHub Pages doit servir le build généré, pas les sources brutes du repo.

## Structure

- `src/main.tsx` : application, navigation, pages et composants principaux.
- `src/types.ts` : modèle de données typé.
- `src/lib/stats.ts` : fonctions de calcul des scores, séries, catégories et anti-procrastination.
- `src/lib/storage.ts` : persistance locale, export/import, reset.
- `src/data/demoData.ts` : 30 habitudes quotidiennes, 15 hebdomadaires et journaux réalistes.
- `src/styles.css` : thème premium sombre, crème, vert et orange brûlé.

## Fonctionnalités

- Dashboard annuel 12 mois avec heatmap, KPI et graphiques Recharts.
- Page Aujourd’hui optimisée mobile avec cycle de statuts rapide.
- Vue Mois desktop en matrice habitudes × jours.
- Vue Mois mobile en cartes par jour sélectionné.
- Gestion des habitudes : ajout, édition complète, activation/désactivation.
- Statistiques, indice anti-procrastination, export/import JSON et reset.
- Données de démonstration dynamiques sur l’année courante.

## Statuts

- `Non saisi`
- `Accompli`
- `Partiel`
- `Manqué`
- `Repos`

Règles de score :

- Accompli = 1
- Partiel = 0,5
- Manqué = 0
- Repos = exclu
- Non saisi = exclu par défaut, ou compté comme manqué si l’option est activée

## Limites connues

- V1 locale uniquement : pas de synchronisation multi-appareil.
- Import JSON avec validation structurelle minimale.
- Pas encore d’export Excel `.xlsx`.
- Pas encore de notifications PWA.

## Pistes V2

- Export Excel `.xlsx`.
- IndexedDB.
- Notifications PWA.
- Sauvegarde cloud optionnelle.
- Thèmes personnalisables.
- Découpage plus fin en composants/pages dédiés.
