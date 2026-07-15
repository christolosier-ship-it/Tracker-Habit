import { lazy, Suspense } from "react";
import type { ThemeId } from "../../themes/theme-types";
import type { DashboardMascotProps } from "./mascot.types";
import { useMascotReaction } from "./useMascotReaction";
import "./mascot.css";
import { mascotLoaders } from "./mascot-manifest";

const mascotByTheme = Object.fromEntries(
  Object.entries(mascotLoaders).map(([themeId, loader]) => [
    themeId,
    lazy(loader),
  ]),
) as Record<ThemeId, ReturnType<typeof lazy>>;

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
