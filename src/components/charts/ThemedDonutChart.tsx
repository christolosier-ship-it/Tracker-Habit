import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { AppTheme } from "../../themes/theme-types";
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
            props.theme.charts.category[item.categorie] ??
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

  return (
    <div
      className={`themed-chart-panel themed-donut donut-${props.theme.charts.visual.donutVariant} ${props.compact ? "compact" : ""}`}
      style={chartCssVars(props.theme, props.variant)}
    >
      <div className="themed-donut-chart" aria-label={`Répartition de ${total} éléments`}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius="58%"
              outerRadius="86%"
              paddingAngle={visibleSlices.length > 1 ? 2 : 0}
              cornerRadius={props.theme.charts.visual.cornerRadius}
              isAnimationActive
            >
              {chartData.map((item) => (
                <Cell key={item.key} fill={item.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number | string) => {
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
              itemStyle={{ color: props.theme.tokens.text }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="themed-donut-center" aria-hidden="true">
        <strong>{total}</strong>
        <span>{props.variant === "status" ? "statuts" : "suivis"}</span>
      </div>
    </div>
  );
}
