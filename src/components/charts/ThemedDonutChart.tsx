import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { AppTheme, ChartCategoryName } from "../../themes/theme-types";
import { CategoryStats, StatusStats } from "../../types";
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
  const chartData =
    visibleSlices.length > 0
      ? visibleSlices
      : [
          {
            key: "empty",
            label: "Aucune donnée",
            value: 1,
            color: props.theme.charts.status.empty,
          },
        ];
  const chartHeight = props.compact ? 190 : 248;
  const outerRadius = props.compact ? 70 : 92;
  const innerRadius = props.compact ? 46 : 62;

  return (
    <div
      className={`themed-chart-panel themed-donut donut-${props.theme.charts.visual.donutVariant} ${props.compact ? "compact" : ""}`}
      data-chart-theme={props.theme.effects.backgroundStyle}
      style={chartCssVars(props.theme, props.variant)}
    >
      <div className="themed-donut-chart" aria-label={`Répartition de ${total} éléments`}>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <PieChart>
            <Tooltip
              formatter={(value) => {
                const numericValue = Number(value);
                return props.valueFormatter
                  ? props.valueFormatter(numericValue)
                  : `${numericValue}`;
              }}
              contentStyle={{
                background: props.theme.tokens.surface,
                border: `1px solid ${props.theme.tokens.border}`,
                borderRadius: props.theme.charts.visual.cornerRadius,
                color: props.theme.tokens.text,
              }}
              labelStyle={{ color: props.theme.tokens.text }}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={visibleSlices.length > 1 ? 3 : 0}
              cornerRadius={props.theme.charts.visual.cornerRadius}
              stroke={props.theme.tokens.surface}
              strokeWidth={3}
              isAnimationActive
            >
              {chartData.map((item) => (
                <Cell key={item.key} fill={item.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
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
