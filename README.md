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
- `@tremor/react` comme base de rendu pour les graphiques, encapsulée par des composants `ThemedChart` locaux ;
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
- `src/themes/theme-registry.ts` centralise le registre des 12 thèmes, le thème par défaut et les palettes sémantiques de graphiques.
- `src/themes/apply-theme.ts` transforme le thème actif en variables CSS (`--bg`, `--surface`, `--primary`, `--radius-card`, etc.).
- `src/styles.css` applique ces variables aux fonds, cartes, badges, boutons, matrices, pages et variantes `data-theme-style`.
- `src/lib/storage.ts` migre en douceur les anciennes données `localStorage` sans `themeId` vers `dopamine-pop`.

Limite actuelle : les thèmes changent l’apparence globale, les palettes, les formes, les effets, les cartes et les graphiques, mais ce ne sont pas encore 12 layouts totalement différents.

## Graphiques thématiques

Les 12 thèmes ne se limitent plus à une palette décorative appliquée aux graphiques. Une couche dédiée vit dans `src/components/charts/` et centralise les intentions visuelles :

- `ThemedAreaChart`, `ThemedBarChart`, `ThemedDonutChart`, `ThemedBarList` et `ThemedProgressRing` reçoivent le thème actif, les données et un variant sémantique (`score`, `status`, `category`, `fragile`, `antiProcrastination`, etc.).
- `chart-theme-utils.ts` sépare les helpers de couleur : statuts, catégories, scores, palettes Tremor et couleurs hex exactes pour CSS/SVG.
- `AppTheme.charts` distingue désormais `tremorPalette` (noms compatibles Tremor) et `hexPalette` (couleurs exactes), plus des palettes sémantiques `status`, `score`, `category`, `gradients` et `visual`.
- Les donuts de statuts utilisent toujours une sémantique stable : accompli = positif, partiel = intermédiaire, manqué = danger, repos = calme, non saisi = neutre. Les donuts de catégories utilisent une palette stable par famille d’habitude.
- Les progress rings choisissent leur couleur par score : `low`, `mid`, `good`, `great`, sans modifier les calculs métier.
- La heatmap annuelle conserve ses seuils fonctionnels mais change de personnalité via `heatmapVariant` : pastilles candy, néon, Memphis, glass pills, tropical seeds, pixel blocks, cosmic stars, stickers kawaii, blocs brutalistes, dots éditoriaux, badges comic ou bulles liquides.

**Dopamine Pop** reste prioritaire : anneaux épais, pastilles candy, couleurs joyeuses et lisibles, cartes claires, rendu premium/fun sans casser la compatibilité mobile.

## Page Statistiques verrouillée par thème

La page **Statistiques** dispose d’une couche visuelle dédiée, strictement limitée à cette page, pour éviter un rendu générique des analyses :

- `StatsInsightCards` affiche les 4 lectures rapides : meilleur mois, mois fragile, catégorie forte et catégorie à reprendre.
- `ThemedMonthlyRibbon` ajoute un ruban de 12 tuiles mensuelles colorées selon le niveau de score.
- `ThemedCategoryScoreBars` remplace le bar chart monochrome des catégories par des barres React/CSS custom, avec une couleur stable par catégorie issue de `theme.charts.category`.
- `ThemedStatusBreakdown` combine le donut de statuts avec une légende claire en couleurs sémantiques (`done`, `partial`, `missed`, `rest`, `empty`).
- **Dopamine Pop** reste prioritaire : rendu plus candy, lisible, fun et premium.
- Les 12 thèmes possèdent chacun une section CSS dédiée pour que les statistiques changent réellement de personnalité : pop, neon, memphis, aurora, tropical, arcade, cosmic, kawaii, brutalist, editorial, comic et liquid.

## Déploiement GitHub Pages

Le projet est configuré pour GitHub Pages avec Vite :

- `vite.config.ts` utilise `base: '/Tracker-Habit/'` en build.
- `.github/workflows/deploy.yml` compile l’application puis publie le dossier `dist`.
- Le workflow construit aussi les pull requests pour éviter de merger une page blanche.

Après merge sur `main`, GitHub Pages doit servir le build généré, pas les sources brutes du repo.

## Structure

- `src/main.tsx` : application, navigation, pages et orchestration des composants principaux.
- `src/components/ui` : composants locaux inspirés de shadcn/ui.
- `src/components/effects` : effets visuels premium ciblés.
- `src/components/charts` : composants graphiques thémés et helpers de palettes sémantiques.
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
- La structure applicative reste partiellement concentrée dans `src/main.tsx`, même si la logique graphique est isolée dans `src/components/charts`.

## Pistes V2/V4

- Export Excel `.xlsx`.
- IndexedDB.
- Notifications PWA.
- Sauvegarde cloud optionnelle.
- Personnalisation fine des thèmes par utilisateur.
- Découpage plus fin en composants/pages dédiés.

## Identités visuelles des 12 thèmes

Les thèmes ne se limitent plus aux tokens de palette : les couleurs restent la base, mais une couche d’identité visuelle définit maintenant le vocabulaire d’interface de chaque univers. `AppTheme.identity` décrit la typographie, le type de cadre, la navigation, le hero, les décorations, les cellules, les badges et le widget signature associés au thème actif.

`ThemeIdentityLayer` ajoute des objets décoratifs globaux en CSS/SVG locaux, sans interaction et sans donnée métier. `ThemeHero` remplace la structure visuelle interne du header tout en conservant les titres français, les contrôles d’année et de mois, ainsi que les calculs existants. `ThemeSignatureWidget` sélectionne le widget purement visuel du thème actif à partir de valeurs déjà calculées : score, série et habitudes actives.

Les 12 widgets signatures sont :

- SystemStatusWidget
- MoodBubbleWidget
- MemphisShapeScore
- AuroraFocusWidget
- GrowthBloomWidget
- ArcadePlayerHud
- CosmicOrbitScore
- KawaiiRewardCollection
- BrutalistManifesto
- EditorialQuoteWidget
- ComicHeroMission
- LiquidFlowScore

Ces objets restent strictement présentatifs : aucune donnée de jeu, d’XP, de pièces, de mascotte, de récompense ou de collection n’est sauvegardée. Les calculs visuels de Retro Arcade et Kawaii Maximalist sont dérivés temporairement depuis les données existantes. La logique métier, le localStorage, l’import/export JSON, les habitudes, les catégories et les statuts restent inchangés.

Retro Arcade dispose d’un HUD joueur avec niveau, XP segmentée, pièces et sprite pixel local. Kawaii Maximalist dispose d’une mascotte lapin originale, de compteurs étoiles/cœurs, d’un badge récompense et de stickers. Tous les visuels sont construits avec CSS ou SVG inline locaux, sans image distante et sans dépendance graphique externe.
