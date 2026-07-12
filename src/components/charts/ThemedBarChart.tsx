import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppTheme } from "../../themes/theme-types";
import {
  ChartVariant,
  chartCssVars,
  getChartPalette,
  getScoreColor,
} from "./chart-theme-utils";

type Props<T extends Record<string, unknown>> = {
  theme: AppTheme;
  data: T[];
  index: string;
  categories: string[];
  variant: ChartVariant;
  valueFormatter?: (value: number) => string;
};

export function ThemedBarChart<T extends Record<string, unknown>>({
  theme,
  data,
  index,
  categories,
  variant,
  valueFormatter,
}: Props<T>) {
  const palette = getChartPalette(theme, variant);
  const category = categories[0];

  return (
    <div
      className={`themed-chart-panel themed-bar-chart bar-${theme.charts.visual.barVariant} grid-${theme.charts.visual.grid}`}
      data-chart-theme={theme.effects.backgroundStyle}
      style={chartCssVars(theme, variant)}
    >
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 12, right: 14, left: -8, bottom: 2 }}>
          <CartesianGrid vertical={false} strokeDasharray="4 6" />
          <XAxis dataKey={index} tickLine={false} axisLine={false} />
          <YAxis
            width={44}
            domain={[0, 100]}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) =>
              valueFormatter ? valueFormatter(value) : `${value}`
            }
          />
          <Tooltip
            formatter={(value) => {
              const numericValue = Number(value);
              return valueFormatter ? valueFormatter(numericValue) : `${numericValue}`;
            }}
            contentStyle={{
              background: theme.tokens.surface,
              border: `1px solid ${theme.tokens.border}`,
              borderRadius: theme.charts.visual.cornerRadius,
              color: theme.tokens.text,
            }}
            labelStyle={{ color: theme.tokens.text }}
          />
          <Bar
            dataKey={category}
            radius={[
              theme.charts.visual.cornerRadius,
              theme.charts.visual.cornerRadius,
              0,
              0,
            ]}
            isAnimationActive
          >
            {data.map((item, itemIndex) => {
              const value = Number(item[category] ?? 0);
              const color =
                variant === "score"
                  ? getScoreColor(theme, value)
                  : palette[itemIndex % palette.length];
              return <Cell key={`${String(item[index])}-${itemIndex}`} fill={color} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
