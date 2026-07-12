# Discipline Dashboard

Application React, TypeScript et Vite de suivi d’habitudes en français. Elle fonctionne sans compte ni serveur et conserve les données dans le navigateur.

## Commandes

```bash
npm ci
npm run dev
npm run check
npm run preview
```

`npm run check` exécute successivement ESLint, Vitest, TypeScript et le build Vite.

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
    App.tsx                 orchestration et navigation
    AppErrorBoundary.tsx    écran de secours en cas d’erreur React
    constants.ts            libellés et constantes d’interface
    pages.tsx               pages applicatives
    shared.tsx              composants partagés entre pages
  components/
    charts/                 graphiques Recharts et SVG thémés
    effects/                fond et conteneurs visuels
    stats/                  composants propres aux statistiques
    theme-identity/         cellules, cadres et aperçus thématiques
    ui/                     Button, Card et Badge locaux
  data/
    demoData.ts             jeu de démonstration
  hooks/
    useDebouncedSave.ts     persistance différée
  lib/
    dashboard-selectors.ts  agrégation des données du dashboard
    date-utils.ts           dates locales
    log-index.ts            index des journaux
    stats.ts                règles métier et calculs
    storage.ts              lecture, migration, validation et sauvegarde
  themes/
    apply-theme.ts          variables CSS
    theme-registry.ts       registre des douze thèmes
    theme-types.ts          contrats de thème
```

`main.tsx` ne contient que le montage React, les imports CSS et la frontière d’erreur.

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

Les composants reçoivent le thème actif et utilisent les palettes sémantiques définies dans `AppTheme.charts`.

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

Les thèmes pilotent les couleurs, la typographie, les cadres, la navigation, les cellules de calendrier et la morphologie des graphiques. Les anciennes grandes illustrations de hero Kawaii et Arcade ont été retirées du produit final après compactage de l’en-tête. Leur banque de composants reste dans le projet Lovable dédié.

## Stockage

- stockage principal : `localStorage` ;
- schéma actuel : V3 ;
- sauvegarde différée pour éviter une écriture à chaque frappe ;
- validation de la structure lors d’un import JSON ;
- migration des anciennes données ;
- aucune synchronisation cloud.

## Qualité

La CI GitHub Pages vérifie les pull requests avant publication :

- installation reproductible avec `npm ci` ;
- lint ESLint ;
- tests Vitest ;
- compilation TypeScript ;
- build Vite.

La suite de tests couvre notamment la différence quotidienne/hebdomadaire, les vrais non-saisis, les séries, les habitudes à 0 % et les tâches prioritaires sans identifiant codé en dur.

## Déploiement

Le build utilise `base: "/Tracker-Habit/"` et est publié par `.github/workflows/deploy.yml` sur GitHub Pages après fusion dans `main`.

## Limites actuelles

- stockage uniquement local ;
- pas de synchronisation multi-appareil ;
- pas d’export Excel ;
- pas de notifications PWA ;
- `src/app/pages.tsx` reste le principal fichier à découper lors d’une prochaine évolution fonctionnelle majeure.
