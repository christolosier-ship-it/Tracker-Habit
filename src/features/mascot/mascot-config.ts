import { ComponentType } from "react";
import { ThemeId } from "../../themes/theme-types";
import { MascotCreatureProps } from "./mascot.types";
import { DopamineMascot } from "./creatures/DopamineMascot";
import { CyberpunkMascot } from "./creatures/CyberpunkMascot";
import { MemphisMascot } from "./creatures/MemphisMascot";
import { AuroraMascot } from "./creatures/AuroraMascot";
import { TropicalMascot } from "./creatures/TropicalMascot";
import { ArcadeMascot } from "./creatures/ArcadeMascot";
import { CosmicMascot } from "./creatures/CosmicMascot";
import { KawaiiMascot } from "./creatures/KawaiiMascot";
import { BrutalistMascot } from "./creatures/BrutalistMascot";
import { EditorialMascot } from "./creatures/EditorialMascot";
import { ComicMascot } from "./creatures/ComicMascot";
import { LiquidMascot } from "./creatures/LiquidMascot";

type MascotComponent = ComponentType<MascotCreatureProps>;

export const mascotByTheme: Record<ThemeId, MascotComponent> = {
  "dopamine-pop": DopamineMascot,
  "neon-cyberpunk-matrix": CyberpunkMascot,
  "memphis-productivity": MemphisMascot,
  "aurora-glassmorphism": AuroraMascot,
  "tropical-festival": TropicalMascot,
  "retro-arcade": ArcadeMascot,
  "cosmic-dreamscape": CosmicMascot,
  "kawaii-maximalist": KawaiiMascot,
  "brutalist-color-clash": BrutalistMascot,
  "editorial-fashion-tech": EditorialMascot,
  "comic-book-energy": ComicMascot,
  "liquid-gradient-future": LiquidMascot,
};
