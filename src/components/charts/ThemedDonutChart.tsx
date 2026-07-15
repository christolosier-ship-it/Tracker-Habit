import type {
  CategoryStats,
  StatusStats,
} from "../../analytics/tracker-analytics";
import type { AppTheme, ChartCategoryName } from "../../themes/theme-types";
import {
  chartCssVars,
  getStatusChartColors,
  statusOrder,
} from "./chart-theme-utils";

type StatusProps = {
  theme: AppTheme;
  variant: "status";
  data: StatusStats[];
  valueFormatter?: (value: number) => string;
  compact?: boolean;
};

type CategoryProps = {
  theme: AppTheme;
  variant: "category";
  data: CategoryStats[];
  valueFormatter?: (value: number) => string;
  compact?: boolean;
};

type ChartSlice = {
  key: string;
  label: string;
  value: number;
  color: string;
};

const RADIUS = 66;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ThemedDonutChart(props: StatusProps | CategoryProps) {
  const slices: ChartSlice[] =
    props.variant === "status"
      ? statusOrder.map((status, index) => {
          const item = props.data.find((entry) => entry.status === status);
          return {
            key: status,
            label: item?.label ?? status,
            value: item?.value ?? 0,
            color: getStatusChartColors(props.theme)[index],
          };
        })
      : props.data.map((item, index) => ({
          key: item.categorie,
          label: item.categorie,
          value: item.total,
          color:
            props.theme.charts.category[item.categorie as ChartCategoryName] ??
            props.theme.charts.hexPalette[index % props.theme.charts.hexPalette.length],
        }));

  const total = slices.reduce((sum, item) => sum + item.value, 0);
  const visibleSlices = slices.filter((item) => item.value > 0);
  const chartData: ChartSlice[] = visibleSlices.length
    ? visibleSlices
    : [{
        key: "empty",
        label: "Aucune donnée",
        value: 1,
        color: props.theme.charts.status.empty,
      }];
  const chartTotal = Math.max(1, chartData.reduce((sum, item) => sum + item.value, 0));
  const gap = chartData.length > 1 ? 4 : 0;
  const segments = chartData.map((item, index) => {
    const length = (item.value / chartTotal) * CIRCUMFERENCE;
    const offset = chartData
      .slice(0, index)
      .reduce(
        (sum, precedingItem) =>
          sum + (precedingItem.value / chartTotal) * CIRCUMFERENCE,
        0,
      );
    return {
      ...item,
      dash: Math.max(0, length - gap),
      offset: -offset,
    };
  });
  return (
    <div
      className={`themed-chart-panel themed-donut donut-${props.theme.charts.visual.donutVariant} ${props.compact ? "compact" : ""}`}
      style={chartCssVars(props.theme, props.variant)}
    >
      <div className="themed-donut-chart" aria-label={`Répartition de ${total} éléments`}>
        <svg
          className="native-donut-chart"
          viewBox="0 0 200 200"
          role="img"
          aria-label={`Répartition de ${total} éléments`}
        >
          {segments.map((segment) => (
            <circle
              className="native-donut-segment"
              key={segment.key}
              cx="100"
              cy="100"
              r={RADIUS}
              fill="none"
              stroke={segment.color}
              strokeWidth="34"
              strokeLinecap="butt"
              strokeDasharray={`${segment.dash} ${CIRCUMFERENCE - segment.dash}`}
              strokeDashoffset={segment.offset}
              transform="rotate(-90 100 100)"
            >
              <title>
                {`${segment.label} : ${props.valueFormatter?.(segment.value) ?? segment.value}`}
              </title>
            </circle>
          ))}
        </svg>
      </div>
      <div className="themed-donut-center" aria-hidden="true">
        <strong>{total}</strong>
        <span>{props.variant === "status" ? "statuts" : "suivis"}</span>
      </div>
      {!props.compact && (
        <div className="themed-donut-legend" aria-label="Légende du graphique">
          {slices.map((item) => (
            <span key={item.key} title={`${item.label}: ${item.value}`}>
              <i style={{ background: item.color }} />
              {item.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
