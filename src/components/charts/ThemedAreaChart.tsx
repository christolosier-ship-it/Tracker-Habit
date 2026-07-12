import { useId } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
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
} from "./chart-theme-utils";

type Props<T extends Record<string, unknown>> = {
  theme: AppTheme;
  data: T[];
  index: string;
  categories: string[];
  variant: ChartVariant;
  valueFormatter?: (value: number) => string;
};

export function ThemedAreaChart<T extends Record<string, unknown>>({
  theme,
  data,
  index,
  categories,
  variant,
  valueFormatter,
}: Props<T>) {
  const palette = getChartPalette(theme, variant);
  const gradientId = `area-gradient-${useId().replace(/:/g, "")}`;
  const primary = palette[0];
  const secondary = palette[1] ?? primary;
  const category = categories[0];

  return (
    <div
      className={`themed-chart-panel themed-area-chart area-${variant} grid-${theme.charts.visual.grid}`}
      data-chart-theme={theme.style}
      style={
        {
          ...chartCssVars(theme, variant),
          "--area-primary": primary,
          "--area-secondary": secondary,
          "--area-soft": theme.tokens.primarySoft,
        } as React.CSSProperties
      }
    >
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 12, right: 14, left: -8, bottom: 2 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={primary} stopOpacity={0.72} />
              <stop offset="58%" stopColor={secondary} stopOpacity={0.28} />
              <stop offset="100%" stopColor={secondary} stopOpacity={0.03} />
            </linearGradient>
          </defs>
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
            formatter={(value: number) =>
              valueFormatter ? valueFormatter(value) : `${value}`
            }
            contentStyle={{
              background: theme.tokens.surface,
              border: `1px solid ${theme.tokens.border}`,
              borderRadius: theme.charts.visual.cornerRadius,
              color: theme.tokens.text,
            }}
            labelStyle={{ color: theme.tokens.text }}
          />
          <Area
            type={theme.effects.pixel ? "linear" : "monotone"}
            dataKey={category}
            stroke={primary}
            strokeWidth={theme.charts.visual.strokeWidth}
            fill={`url(#${gradientId})`}
            activeDot={{ r: 5, fill: secondary, stroke: theme.tokens.surface }}
            dot={false}
            isAnimationActive
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
