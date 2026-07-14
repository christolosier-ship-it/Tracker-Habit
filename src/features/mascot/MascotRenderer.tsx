import { lazy, Suspense } from "react";
import type { ThemeId } from "../../themes/theme-types";
import type { DashboardMascotProps } from "./mascot.types";
import { useMascotReaction } from "./useMascotReaction";
import "./mascot.css";
import { mascotLoaders } from "./mascot-manifest";

const mascotByTheme: Record<ThemeId, ReturnType<typeof lazy>> = {
  "dopamine-pop": lazy(mascotLoaders["dopamine-pop"]),
  "neon-cyberpunk-matrix": lazy(mascotLoaders["neon-cyberpunk-matrix"]),
  "memphis-productivity": lazy(mascotLoaders["memphis-productivity"]),
  "aurora-glassmorphism": lazy(mascotLoaders["aurora-glassmorphism"]),
  "tropical-festival": lazy(mascotLoaders["tropical-festival"]),
  "retro-arcade": lazy(mascotLoaders["retro-arcade"]),
  "cosmic-dreamscape": lazy(mascotLoaders["cosmic-dreamscape"]),
  "kawaii-maximalist": lazy(mascotLoaders["kawaii-maximalist"]),
  "brutalist-color-clash": lazy(mascotLoaders["brutalist-color-clash"]),
  "editorial-fashion-tech": lazy(mascotLoaders["editorial-fashion-tech"]),
  "comic-book-energy": lazy(mascotLoaders["comic-book-energy"]),
  "liquid-gradient-future": lazy(mascotLoaders["liquid-gradient-future"]),
};

export function MascotRenderer({ themeId, mood, reaction, onReactionComplete }: DashboardMascotProps) {
  const { activeReaction, complete } = useMascotReaction(reaction, onReactionComplete);
  if (mood === "hidden") return null;

  const Mascot = mascotByTheme[themeId];
  return (
    <aside className="app-mascot" data-theme={themeId} data-mood={mood} data-reaction={activeReaction ?? "none"}>
      <Suspense fallback={<span className="app-mascot-loading" aria-hidden="true" />}>
        <Mascot mood={mood} reaction={activeReaction} onReactionComplete={complete} />
      </Suspense>
    </aside>
  );
}
