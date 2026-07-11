# Discipline Dashboard — habit-tracker-premium-fr

Application React TypeScript Vite de suivi d’habitudes premium en français, sans compte, sans serveur et avec sauvegarde `localStorage`.

## Installation

```bash
npm install
npm run dev
npm run build
```

## Stack UI

La V3 UI utilise maintenant :

- composants locaux inspirés de `shadcn/ui` : `Button`, `Card`, `Badge`, helper `cn` ;
- `@tremor/react` pour les graphiques dashboard : AreaChart, BarChart, DonutChart, BarList, ProgressCircle ;
- effets ciblés type Magic UI / Aceternity : fond animé, orbes, cartes spotlight, bento shell ;
- `lucide-react` pour les icônes ;
- `date-fns` pour les dates ;
- `localStorage` pour le stockage V1.


## Système de thèmes

L’application inclut un moteur de thèmes visuels sélectionnable depuis **Paramètres > Apparence**. Le thème par défaut est **Dopamine Pop**, pensé comme l’expérience principale : joyeuse, colorée, tactile et motivante.

Les 12 styles disponibles sont :

1. Dopamine Pop
2. Neon Cyberpunk Matrix
3. Memphis Productivity
4. Aurora Glassmorphism
5. Tropical Festival
6. Retro Arcade
7. Cosmic Dreamscape
8. Kawaii Maximalist
9. Brutalist Color Clash
10. Editorial Fashion Tech
11. Comic Book Energy
12. Liquid Gradient Future

Architecture :

- `src/themes/theme-types.ts` définit `ThemeId` et `AppTheme`.
- `src/themes/theme-registry.ts` centralise le registre des 12 thèmes, le thème par défaut et les palettes de graphiques.
- `src/themes/apply-theme.ts` transforme le thème actif en variables CSS (`--bg`, `--surface`, `--primary`, `--radius-card`, etc.).
- `src/styles.css` applique ces variables aux fonds, cartes, badges, boutons, matrices, pages et variantes `data-theme-style`.
- `src/lib/storage.ts` migre en douceur les anciennes données `localStorage` sans `themeId` vers `dopamine-pop`.

Limite actuelle : les thèmes changent l’apparence globale, les palettes, les formes, les effets, les cartes et les graphiques, mais ce ne sont pas encore 12 layouts totalement différents.

## Déploiement GitHub Pages

Le projet est configuré pour GitHub Pages avec Vite :

- `vite.config.ts` utilise `base: '/Tracker-Habit/'` en build.
- `.github/workflows/deploy.yml` compile l’application puis publie le dossier `dist`.
- Le workflow construit aussi les pull requests pour éviter de merger une page blanche.

Après merge sur `main`, GitHub Pages doit servir le build généré, pas les sources brutes du repo.

## Structure

- `src/main.tsx` : application, navigation, pages et composants principaux.
- `src/components/ui` : composants locaux inspirés de shadcn/ui.
- `src/components/effects` : effets visuels premium ciblés.
- `src/types.ts` : modèle de données typé.
- `src/lib/stats.ts` : fonctions de calcul des scores, séries, catégories et anti-procrastination.
- `src/lib/storage.ts` : persistance locale, export/import, reset.
- `src/data/demoData.ts` : 30 habitudes quotidiennes, 15 hebdomadaires et journaux réalistes.
- `src/styles.css` : variables de thème, styles premium responsives et variantes visuelles des 12 ambiances.
- `tailwind.config.ts` et `postcss.config.js` : configuration Tailwind utile à Tremor.

## Fonctionnalités

- Dashboard annuel 12 mois avec heatmap, KPI, anneaux de progression et graphiques Tremor.
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
- La structure applicative reste encore concentrée dans `src/main.tsx`.

## Pistes V2/V4

- Export Excel `.xlsx`.
- IndexedDB.
- Notifications PWA.
- Sauvegarde cloud optionnelle.
- Personnalisation fine des thèmes par utilisateur.
- Découpage plus fin en composants/pages dédiés.
