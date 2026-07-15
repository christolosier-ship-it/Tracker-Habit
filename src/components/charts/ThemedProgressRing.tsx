import { AppTheme } from "../../themes/theme-types";
import { ChartVariant, chartCssVars, getScoreColor } from "./chart-theme-utils";

type Props = {
  theme: AppTheme;
  value: number | null;
  variant: ChartVariant;
  size?: "sm" | "lg";
  label?: string;
};
export function ThemedProgressRing({
  theme,
  value,
  variant,
  size = "sm",
  label,
}: Props) {
  const clamped = value === null ? 0 : Math.max(0, Math.min(100, value));
  const radius = size === "lg" ? 52 : 34;
  const stroke =
    size === "lg"
      ? theme.charts.visual.strokeWidth
      : Math.max(8, theme.charts.visual.strokeWidth - 4);
  const circumference = 2 * Math.PI * radius;
  const color = getScoreColor(theme, clamped);
  return (
    <div
      className={`themed-progress-ring ${size}`}
      style={
        {
          ...chartCssVars(theme, variant),
          "--ring-color": color,
        } as React.CSSProperties
      }
      aria-label={label ?? (value === null ? "Score non disponible" : `Score ${clamped}%`)}
    >
      <svg viewBox="0 0 140 140" role="img">
        <circle
          className="ring-track"
          cx="70"
          cy="70"
          r={radius}
          strokeWidth={stroke}
        />
        <circle
          className="ring-value"
          cx="70"
          cy="70"
          r={radius}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (clamped / 100) * circumference}
        />
      </svg>
      <span className="themed-progress-ring-inner">
        {value === null ? "—" : `${Math.round(clamped)}%`}
      </span>
    </div>
  );
}
