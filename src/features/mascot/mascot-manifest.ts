import type { ComponentType } from "react";
import type { ThemeId } from "../../themes/theme-types";
import type { MascotCreatureProps } from "./mascot.types";

type MascotModule = { default: ComponentType<MascotCreatureProps> };
export type MascotLoader = () => Promise<MascotModule>;

export const mascotLoaders: Record<ThemeId, MascotLoader> = {
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

export const mascotThemeIds = Object.keys(mascotLoaders) as ThemeId[];
