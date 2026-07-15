import { useId } from "react";
import type { AppTheme } from "../../themes/theme-types";
import {
  type ChartVariant,
  chartCssVars,
  getChartPalette,
  getScoreColor,
} from "./chart-theme-utils";

type NativeCartesianChartProps<T extends Record<string, unknown>> = {
  kind: "area" | "bar";
  theme: AppTheme;
  data: T[];
  index: string;
  category: string;
  variant: ChartVariant;
  valueFormatter?: (value: number) => string;
};

type ChartPoint = {
  key: string;
  label: string;
  value: number | null;
  x: number;
  y: number | null;
};

const WIDTH = 720;
const HEIGHT = 280;
const PADDING = { top: 16, right: 16, bottom: 38, left: 46 };
const PLOT_WIDTH = WIDTH - PADDING.left - PADDING.right;
const PLOT_HEIGHT = HEIGHT - PADDING.top - PADDING.bottom;
const GRID_VALUES = [0, 25, 50, 75, 100] as const;

function clampScore(value: number) {
  return Math.max(0, Math.min(100, value));
}

function contiguousSegments(points: ChartPoint[]) {
  const segments: ChartPoint[][] = [];
  let segment: ChartPoint[] = [];
  for (const point of points) {
    if (point.value === null) {
      if (segment.length) segments.push(segment);
      segment = [];
    } else {
      segment.push(point);
    }
  }
  if (segment.length) segments.push(segment);
  return segments;
}

function linePath(points: ChartPoint[]) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`)
    .join(" ");
}

function areaPath(points: ChartPoint[]) {
  const baseline = PADDING.top + PLOT_HEIGHT;
  return `${linePath(points)} L${points[points.length - 1].x},${baseline} L${points[0].x},${baseline} Z`;
}

export function NativeCartesianChart<T extends Record<string, unknown>>({
  kind,
  theme,
  data,
  index,
  category,
  variant,
  valueFormatter = (value) => `${value}`,
}: NativeCartesianChartProps<T>) {
  const palette = getChartPalette(theme, variant);
  const gradientId = `native-area-${useId().replace(/:/g, "")}`;
  const points: ChartPoint[] = data.map((item, itemIndex) => {
    const raw = item[category];
    const value = typeof raw === "number" && Number.isFinite(raw)
      ? clampScore(raw)
      : null;
    const x =
      data.length <= 1
        ? PADDING.left + PLOT_WIDTH / 2
        : PADDING.left + (itemIndex / (data.length - 1)) * PLOT_WIDTH;
    return {
      key: `${String(item[index])}-${itemIndex}`,
      label: String(item[index] ?? ""),
      value,
      x,
      y: value === null
        ? null
        : PADDING.top + PLOT_HEIGHT - (value / 100) * PLOT_HEIGHT,
    };
  });
  const segments = contiguousSegments(points);
  const barStep = PLOT_WIDTH / Math.max(points.length, 1);
  const barWidth = Math.max(8, Math.min(34, barStep * 0.58));

  return (
    <div
      className={`themed-chart-panel themed-${kind}-chart bar-${theme.charts.visual.barVariant} grid-${theme.charts.visual.grid}`}
      style={chartCssVars(theme, variant)}
    >
      <svg
        className="native-cartesian-chart"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label={`Graphique ${kind === "area" ? "d’évolution" : "en barres"}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {kind === "area" && (
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={palette[0]} stopOpacity="0.7" />
              <stop offset="100%" stopColor={palette[1] ?? palette[0]} stopOpacity="0.04" />
            </linearGradient>
          </defs>
        )}

        <g className="native-chart-grid" aria-hidden="true">
          {GRID_VALUES.map((value) => {
            const y = PADDING.top + PLOT_HEIGHT - (value / 100) * PLOT_HEIGHT;
            return (
              <g key={value}>
                <line x1={PADDING.left} x2={WIDTH - PADDING.right} y1={y} y2={y} />
                <text x={PADDING.left - 8} y={y + 4} textAnchor="end">
                  {valueFormatter(value)}
                </text>
              </g>
            );
          })}
        </g>

        {kind === "area" && segments.map((segment) => (
          <g key={segment[0].key}>
            <path className="native-chart-area" d={areaPath(segment)} fill={`url(#${gradientId})`} />
            <path className="native-chart-line" d={linePath(segment)} stroke={palette[0]} />
          </g>
        ))}

        {kind === "bar" && points.map((point, itemIndex) => {
          if (point.value === null || point.y === null) return null;
          const color = variant === "score"
            ? getScoreColor(theme, point.value)
            : palette[itemIndex % palette.length];
          return (
            <rect
              className="native-chart-bar"
              key={point.key}
              x={point.x - barWidth / 2}
              y={point.y}
              width={barWidth}
              height={PADDING.top + PLOT_HEIGHT - point.y}
              rx={theme.charts.visual.barVariant === "rounded" ? Math.min(8, barWidth / 2) : 0}
              fill={color}
            >
              <title>{`${point.label} : ${valueFormatter(point.value)}`}</title>
            </rect>
          );
        })}

        {kind === "area" && points.map((point) =>
          point.value === null || point.y === null ? null : (
            <circle
              className="native-chart-dot"
              key={point.key}
              cx={point.x}
              cy={point.y}
              r="4"
              fill={palette[0]}
            >
              <title>{`${point.label} : ${valueFormatter(point.value)}`}</title>
            </circle>
          ),
        )}

        <g className="native-chart-labels" aria-hidden="true">
          {points.map((point) => (
            <text key={point.key} x={point.x} y={HEIGHT - 12} textAnchor="middle">
              {point.label}
            </text>
          ))}
        </g>
      </svg>
    </div>
  );
}
