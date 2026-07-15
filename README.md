# Discipline Dashboard

Application React, TypeScript et Vite de suivi d’habitudes en français. Elle fonctionne sans compte ni serveur et conserve les données dans le navigateur.

## Commandes

```bash
npm ci
npm run dev
npm run check
npm run preview
```

`npm run check` vérifie l’architecture, le CSS, les cycles, le code mort, ESLint, la couverture Vitest, TypeScript et les budgets du build Vite.

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
    useTrackerController.ts    orchestration React et commandes

  domain/
    definitions.ts             catégories, statuts et valeurs canoniques
    evaluation.ts              règle unique quotidien / hebdomadaire
    tracker-reducer.ts         transitions d’état pures

  analytics/
    tracker-index.ts           index par clé, date, habitude et semaine
    tracker-analytics.ts       agrégations par période en une passe

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
    dashboard-selectors.ts     sélecteurs de vues
    tracking-selectors.ts      instantanés jour et mois
    date-utils.ts              dates locales
    stats.ts                   façade de compatibilité testée

  persistence/
    schema.ts                  validation stricte du JSON
    migrations.ts              migration V3/V4 vers le schéma courant
    local-storage.ts           lecture, backup et sauvegarde locale

  themes/
    define-theme.ts            fabrique commune des graphiques
    theme-registry.ts          registre court des douze thèmes
    theme-types.ts             contrats réellement consommés
    presets/                   une définition complète par thème

  styles/
    index.css                  ordre explicite des couches
    foundations.css            reset, tokens et ambiance
    layout.css                 shell et grilles
    components.css             composants applicatifs
    charts.css                 Recharts et SVG
    themes.css                 12 identités via variables
    responsive.css             tablette, mobile et mouvement réduit
```

`main.tsx` ne contient que le montage React, le CSS et la frontière d’erreur. Les anciens monolithes `app/pages.tsx` et `app/shared.tsx` ont été supprimés.

## Dépendances entre couches

- `pages` compose les fonctionnalités ;
- `features` utilise les composants et les commandes applicatives ;
- `components` ne connaît pas les pages ;
- `themes` ne dépend pas du stockage ;
- `analytics` dépend du domaine, jamais de React ;
- `persistence` conserve le format sérialisé sans contaminer le domaine.

Les scripts de qualité refusent les anciens monolithes, cycles, fichiers/exports morts, dépendances inutiles, couches CSS historiques et dépassements de bundle.

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

Les habitudes hebdomadaires sont évaluées une fois par semaine, rattachées au dimanche de cette semaine et ne pénalisent pas chaque journée sans saisie. Tous les KPI du Dashboard utilisent l’année sélectionnée.

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
- schéma actuel : V5 ;
- sauvegarde différée uniquement après une modification ;
- validation de l’import JSON ;
- migration et déduplication des anciennes données ;
- aucune synchronisation cloud.

## Qualité

La CI vérifie :

- l’architecture attendue ;
- l’absence de cycles, de fichiers et d’exports morts ;
- les budgets CSS et du graphe bundle complet ;
- l’installation reproductible avec `npm ci` ;
- le lint ESLint ;
- les tests Vitest et leurs seuils de couverture ;
- la compilation TypeScript ;
- le build Vite ;
- un parcours Chrome : navigation, changement de statut, persistance, thème et mobile.

La suite de tests couvre notamment la différence quotidienne/hebdomadaire, les vrais non-saisis, les séries, les habitudes à 0 %, les tâches prioritaires sans identifiant codé en dur et l’intégrité des douze thèmes.

## Déploiement

Le build utilise `base: "/Tracker-Habit/"` et est publié par `.github/workflows/deploy.yml` sur GitHub Pages après fusion dans `main`.

## Limites actuelles

- stockage uniquement local ;
- pas de synchronisation multi-appareil ;
- pas d’export Excel ;
- pas de notifications PWA.
