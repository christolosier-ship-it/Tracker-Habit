import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from "react";
import type { ThemeId } from "../../themes/theme-types";
import type { DashboardMascotProps, MascotCreatureProps } from "./mascot.types";
import { useMascotReaction } from "./useMascotReaction";
import "./mascot.css";

type MascotModule = { default: ComponentType<MascotCreatureProps> };
type MascotLoader = () => Promise<MascotModule>;

const loaders: Record<ThemeId, MascotLoader> = {
  "dopamine-pop": () => import("./creatures/DopamineMascot").then((module) => ({ default: module.DopamineMascot })),
  "neon-cyberpunk-matrix": () => import("./creatures/CyberpunkMascot").then((module) => ({ default: module.CyberpunkMascot })),
  "memphis-productivity": () => import("./creatures/MemphisMascot").then((module) => ({ default: module.MemphisMascot })),
  "aurora-glassmorphism": () => import("./creatures/AuroraMascot").then((module) => ({ default: module.AuroraMascot })),
  "tropical-festival": () => import("./creatures/TropicalMascot").then((module) => ({ default: module.TropicalMascot })),
  "retro-arcade": () => import("./creatures/ArcadeMascot").then((module) => ({ default: module.ArcadeMascot })),
  "cosmic-dreamscape": () => import("./creatures/CosmicMascot").then((module) => ({ default: module.CosmicMascot })),
  "kawaii-maximalist": () => import("./creatures/KawaiiMascot").then((module) => ({ default: module.KawaiiMascot })),
  "brutalist-color-clash": () => import("./creatures/BrutalistMascot").then((module) => ({ default: module.BrutalistMascot })),
  "editorial-fashion-tech": () => import("./creatures/EditorialMascot").then((module) => ({ default: module.EditorialMascot })),
  "comic-book-energy": () => import("./creatures/ComicMascot").then((module) => ({ default: module.ComicMascot })),
  "liquid-gradient-future": () => import("./creatures/LiquidMascot").then((module) => ({ default: module.LiquidMascot })),
};

const cache = new Map<ThemeId, LazyExoticComponent<ComponentType<MascotCreatureProps>>>();

function getMascot(themeId: ThemeId) {
  const cached = cache.get(themeId);
  if (cached) return cached;
  const component = lazy(loaders[themeId]);
  cache.set(themeId, component);
  return component;
}

export function preloadMascot(themeId: ThemeId) {
  void loaders[themeId]();
}

export function MascotRenderer({ themeId, mood, reaction, onReactionComplete }: DashboardMascotProps) {
  const activeReaction = useMascotReaction(reaction, onReactionComplete);
  if (mood === "hidden") return null;

  const Mascot = getMascot(themeId);
  return (
    <aside className="app-mascot" data-theme={themeId} data-mood={mood} data-reaction={activeReaction ?? "none"}>
      <Suspense fallback={<span className="app-mascot-loading" aria-hidden="true" />}>
        <Mascot mood={mood} reaction={activeReaction} />
      </Suspense>
    </aside>
  );
}
