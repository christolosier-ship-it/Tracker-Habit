import type { ReactNode } from "react";
import "./imported-components.css";

export function ArcadeSprite({ variant = "hero", size = 48 }: { variant?: "hero" | "coin" | "star" | "heart"; size?: number }) {
  const pixel = (x: number, y: number, color: string) => <rect key={`${x}-${y}-${color}`} x={x} y={y} width="1" height="1" fill={color} />;
  const pink = "#ff2e88";
  const green = "#7cff5b";
  const yellow = "#ffd400";
  const black = "#000";

  if (variant === "hero") {
    const grid = [
      ["", "", "", black, black, "", "", ""],
      ["", "", black, green, green, black, "", ""],
      ["", black, green, green, green, green, black, ""],
      ["", black, green, black, black, green, black, ""],
      ["", black, green, green, green, green, black, ""],
      ["", "", black, pink, pink, black, "", ""],
      ["", black, pink, yellow, yellow, pink, black, ""],
      ["", black, black, "", "", black, black, ""],
    ];
    return <svg viewBox="0 0 8 8" width={size} height={size} shapeRendering="crispEdges" aria-hidden="true" focusable="false">{grid.flatMap((row, y) => row.map((color, x) => color ? pixel(x, y, color) : null))}</svg>;
  }

  if (variant === "coin") {
    return <svg viewBox="0 0 8 8" width={size} height={size} shapeRendering="crispEdges" aria-hidden="true" focusable="false">{[[2,0],[3,0],[4,0],[5,0],[1,1],[6,1],[0,2],[7,2],[0,3],[7,3],[0,4],[7,4],[0,5],[7,5],[1,6],[6,6],[2,7],[3,7],[4,7],[5,7]].map(([x,y]) => pixel(x,y,black))}{[[3,1],[4,1],[1,2],[2,2],[5,2],[6,2],[1,3],[2,3],[5,3],[6,3],[1,4],[2,4],[5,4],[6,4],[1,5],[2,5],[5,5],[6,5],[3,6],[4,6]].map(([x,y]) => pixel(x,y,yellow))}</svg>;
  }

  if (variant === "star") {
    return <svg viewBox="0 0 8 8" width={size} height={size} shapeRendering="crispEdges" aria-hidden="true" focusable="false">{[[3,0],[4,0],[3,1],[4,1],[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[2,4],[3,4],[4,4],[5,4],[1,5],[2,5],[5,5],[6,5],[0,6],[1,6],[6,6],[7,6]].map(([x,y]) => pixel(x,y,yellow))}</svg>;
  }

  return <svg viewBox="0 0 8 8" width={size} height={size} shapeRendering="crispEdges" aria-hidden="true" focusable="false">{[[1,1],[2,0],[3,1],[4,0],[5,1],[6,1],[0,2],[7,2],[0,3],[7,3],[1,4],[6,4],[2,5],[5,5],[3,6],[4,6],[3,7],[4,7]].map(([x,y]) => pixel(x,y,pink))}</svg>;
}

export type ArcadeSignatureProps = {
  score: number;
  streak: number;
  activeHabits: number;
  doneLogs?: number;
};

export function ArcadePlayerHud({ score, streak, activeHabits, doneLogs }: ArcadeSignatureProps) {
  const level = Math.max(1, Math.floor(score / 10) + 1);
  const xp = score * 37;
  const coins = doneLogs ?? activeHabits * 25;
  return (
    <section className="imported-arcade-hud" aria-label="HUD joueur Retro Arcade">
      <div className="imported-arcade-hud-top">
        <ArcadeSprite variant="hero" size={48} />
        <div className="imported-arcade-player-copy"><strong>PLAYER 1</strong><span>READY_</span></div>
        <div className="imported-arcade-stats">
          <HudStat label="LVL" value={level} color="#ffd400" />
          <HudStat label="XP" value={xp} color="#7cff5b" />
          <HudStat label="COINS" value={coins} color="#ff2e88" />
        </div>
      </div>
      <ArcadeXpBar value={score} max={100} segments={10} />
      <div className="imported-arcade-streak">COMBO x{streak}</div>
    </section>
  );
}

function HudStat({ label, value, color }: { label: string; value: number; color: string }) {
  return <div className="imported-arcade-hud-stat"><span>{label}</span><strong style={{ color }}>{value}</strong></div>;
}

export function ArcadeXpBar({ value = 0, max = 100, segments = 10 }: { value?: number; max?: number; segments?: number }) {
  const safeMax = max || 1;
  const filled = Math.max(0, Math.min(segments, Math.round((value / safeMax) * segments)));
  return (
    <div className="imported-arcade-xp">
      <div className="imported-arcade-xp-label"><span>XP</span><span>{value} / {max}</span></div>
      <div className="imported-arcade-xp-track">{Array.from({ length: segments }).map((_, index) => <i key={index} data-on={index < filled} />)}</div>
    </div>
  );
}

export function ArcadeCoinCounter({ value = 0 }: { value?: number }) {
  return <span className="imported-arcade-badge"><ArcadeSprite variant="coin" size={17} /> {value}</span>;
}

export function ArcadeLevelBadge({ level = 1 }: { level?: number }) {
  return <span className="imported-arcade-level">LVL {level}</span>;
}

export function ArcadeComboBadge({ combo = 0 }: { combo?: number }) {
  return <span className="imported-arcade-combo">COMBO x{combo}</span>;
}

export function ArcadeQuestCard({ label, xp, done }: { label: string; xp: number; done: boolean }) {
  return (
    <div className="imported-arcade-quest" data-done={done}>
      <span className="imported-arcade-checkbox">{done ? "✓" : ""}</span>
      <span>{label}</span>
      <strong>+{xp}XP</strong>
    </div>
  );
}

export function ArcadeQuestList({ quests }: { quests: Array<{ id: string; label: string; xp: number; done: boolean }> }) {
  return <div className="imported-arcade-panel"><span className="imported-arcade-panel-title">TODAY'S QUESTS</span><div className="imported-arcade-quest-list">{quests.map((quest) => <ArcadeQuestCard key={quest.id} {...quest} />)}</div></div>;
}

export function ArcadeWeeklyScore({ score = 0 }: { score?: number }) {
  return <div className="imported-arcade-panel imported-arcade-weekly"><span className="imported-arcade-panel-title">WEEKLY SCORE</span><strong>+{score} XP</strong><small>CONSISTENCY = SUPERPOWER</small></div>;
}

export function ArcadePixelButton({ children }: { children: ReactNode }) {
  return <button type="button" className="imported-arcade-button">{children}</button>;
}
