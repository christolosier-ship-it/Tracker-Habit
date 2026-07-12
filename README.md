# Discipline Dashboard

Application React, TypeScript et Vite de suivi d’habitudes en français. Elle fonctionne sans compte ni serveur et conserve les données dans le navigateur.

## Commandes

```bash
npm ci
npm run dev
npm run check
npm run preview
```

`npm run check` exécute le contrôle d’architecture, ESLint, Vitest, TypeScript et le build Vite.

## Fonctionnalités

- suivi d’habitudes quotidiennes et hebdomadaires ;
- saisie rapide des statuts ;
- vue mensuelle habitudes × jours ;
- matrice annuelle ;
- indicateurs de discipline et d’anti-procrastination ;
- statistiques par mois, catégorie et statut ;
- douze thèmes visuels ;
- import et export JSON ;
- sauvegarde locale débouncée et migration des anciens schémas.

## Architecture

```text
src/
  app/
    App.tsx                    shell et navigation
    AppErrorBoundary.tsx       écran de secours React
    constants.ts               constantes d’interface
    tracker-actions.ts         contrats des actions applicatives
    useTrackerController.ts    état, persistance et actions

  pages/
    DashboardPage.tsx
    TodayPage.tsx
    MonthPage.tsx
    HabitsPage.tsx
    StatsPage.tsx
    SettingsPage.tsx
    page-types.ts              contrats ciblés de chaque page

  features/
    analytics/                 panneaux et analyses
    dashboard/                 KPI et matrice annuelle
    period/                    sélection année / mois
    settings/                  thèmes, options, import et export
    tracking/                  cartes et boutons de statut

  components/
    charts/                    graphiques Recharts et SVG thémés
    effects/                   fond et conteneurs visuels
    stats/                     composants propres aux statistiques
    theme-identity/            cellules, cadres et aperçus thématiques
    ui/                        Button, Card et Badge locaux

  lib/
    dashboard-selectors.ts     agrégation des données
    date-utils.ts              dates locales
    log-index.ts               index des journaux
    stats.ts                   règles métier et calculs
    storage.ts                 lecture, migration et sauvegarde

  themes/
    define-theme.ts            fabrique commune des graphiques
    theme-registry.ts          registre court des douze thèmes
    theme-types.ts             contrats réellement consommés
    presets/                   une définition complète par thème

  styles/
    index.css                  feuille consolidée dans l’ordre validé
```

`main.tsx` ne contient que le montage React, le CSS et la frontière d’erreur. Les anciens monolithes `app/pages.tsx` et `app/shared.tsx` ont été supprimés.

## Dépendances entre couches

- `pages` compose les fonctionnalités ;
- `features` utilise les composants et les règles métier ;
- `components` ne connaît pas les pages ;
- `themes` ne dépend pas du stockage ;
- les calculs de `lib/stats.ts` ne dépendent pas de React.

Le script `scripts/check-architecture.mjs` refuse les anciens monolithes, les presets vides et plusieurs reliquats supprimés.

## Règles métier

Statuts disponibles :

- Non saisi
- Accompli
- Partiel
- Manqué
- Repos

Valeurs utilisées pour les scores :

- Accompli = 1
- Partiel = 0,5
- Manqué = 0
- Repos = exclu
- Non saisi = exclu par défaut, ou compté comme manqué lorsque l’option est active

Les habitudes hebdomadaires sont évaluées une fois par semaine et ne pénalisent pas chaque journée sans saisie.

## Graphiques

Les graphiques principaux utilisent Recharts ou des composants SVG/CSS locaux :

- `ThemedAreaChart`
- `ThemedBarChart`
- `ThemedDonutChart`
- `ThemedBarList`
- `ThemedProgressRing`

Les palettes utilisent uniquement les couleurs hexadécimales et sémantiques de `AppTheme.charts`. Les champs et helpers Tremor ont été retirés.

## Thèmes

Les douze styles disponibles sont :

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

Chaque thème est défini dans son propre fichier `themes/presets/`. Le registre central ne contient plus les palettes et les centaines de lignes de configuration.

Les thèmes pilotent uniquement les propriétés réellement consommées : couleurs, typographie, cadres, navigation, cellules de calendrier, rayons, effets et graphiques.

## Stockage

- stockage principal : `localStorage` ;
- schéma actuel : V3 ;
- sauvegarde différée ;
- validation de l’import JSON ;
- migration et déduplication des anciennes données ;
- aucune synchronisation cloud.

## Qualité

La CI vérifie :

- l’architecture attendue ;
- l’installation reproductible avec `npm ci` ;
- le lint ESLint ;
- les tests Vitest ;
- la compilation TypeScript ;
- le build Vite.

La suite de tests couvre notamment la différence quotidienne/hebdomadaire, les vrais non-saisis, les séries, les habitudes à 0 %, les tâches prioritaires sans identifiant codé en dur et l’intégrité des douze thèmes.

## Déploiement

Le build utilise `base: "/Tracker-Habit/"` et est publié par `.github/workflows/deploy.yml` sur GitHub Pages après fusion dans `main`.

## Limites actuelles

- stockage uniquement local ;
- pas de synchronisation multi-appareil ;
- pas d’export Excel ;
- pas de notifications PWA.
