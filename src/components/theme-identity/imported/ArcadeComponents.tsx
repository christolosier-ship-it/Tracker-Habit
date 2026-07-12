import "./imported-components.css";

export function ArcadeSprite({ size = 48 }: { size?: number }) {
  const pixel = (x: number, y: number, color: string) => (
    <rect
      key={`${x}-${y}-${color}`}
      x={x}
      y={y}
      width="1"
      height="1"
      fill={color}
    />
  );
  const pink = "#ff2e88";
  const green = "#7cff5b";
  const yellow = "#ffd400";
  const black = "#000";
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
  return (
    <svg
      viewBox="0 0 8 8"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      {grid.flatMap((row, y) =>
        row.map((color, x) => (color ? pixel(x, y, color) : null)),
      )}
    </svg>
  );
}

export type ArcadeSignatureProps = {
  score: number;
  streak: number;
  activeHabits: number;
  doneLogs?: number;
};

export function ArcadePlayerHud({
  score,
  streak,
  activeHabits,
  doneLogs,
}: ArcadeSignatureProps) {
  const level = Math.max(1, Math.floor(score / 10) + 1);
  const xp = score * 37;
  const coins = doneLogs ?? activeHabits * 25;
  return (
    <section className="imported-arcade-hud" aria-label="HUD joueur Retro Arcade">
      <div className="imported-arcade-hud-top">
        <ArcadeSprite size={48} />
        <div className="imported-arcade-player-copy">
          <strong>PLAYER 1</strong>
          <span>READY_</span>
        </div>
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

function HudStat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="imported-arcade-hud-stat">
      <span>{label}</span>
      <strong style={{ color }}>{value}</strong>
    </div>
  );
}

function ArcadeXpBar({
  value,
  max,
  segments,
}: {
  value: number;
  max: number;
  segments: number;
}) {
  const filled = Math.max(
    0,
    Math.min(segments, Math.round((value / Math.max(1, max)) * segments)),
  );
  return (
    <div className="imported-arcade-xp">
      <div className="imported-arcade-xp-label">
        <span>XP</span>
        <span>
          {value} / {max}
        </span>
      </div>
      <div className="imported-arcade-xp-track">
        {Array.from({ length: segments }).map((_, index) => (
          <i key={index} data-on={index < filled} />
        ))}
      </div>
    </div>
  );
}
