import { mascotByTheme } from "./mascot-config";
import { DashboardMascotProps } from "./mascot.types";
import { useMascotReaction } from "./useMascotReaction";
import "./mascot.css";

export function DashboardMascot({
  themeId,
  mood,
  reaction,
  onReactionComplete,
}: DashboardMascotProps) {
  const activeReaction = useMascotReaction(reaction, onReactionComplete);
  if (mood === "hidden") return null;

  const Mascot = mascotByTheme[themeId];
  return (
    <aside
      className="dashboard-mascot"
      aria-label="Compagnon animé du Dashboard"
      data-theme={themeId}
      data-mood={mood}
      data-reaction={activeReaction ?? "none"}
    >
      <Mascot mood={mood} reaction={activeReaction} />
    </aside>
  );
}
