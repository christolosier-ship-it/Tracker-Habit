import { AppTheme } from "../../themes/theme-types";
import { ChartVariant, chartCssVars, getScoreColor } from "./chart-theme-utils";

type Item = { name: string; value: number };
type Props = {
  theme: AppTheme;
  data: Item[];
  variant: Extract<ChartVariant, "topHabits" | "fragile">;
  valueFormatter?: (value: number) => string;
};
export function ThemedBarList({
  theme,
  data,
  variant,
  valueFormatter = (value) => `${value}`,
}: Props) {
  const max = Math.max(...data.map((item) => item.value), 1);
  return (
    <div
      className={`themed-chart-panel themed-bar-list bar-${theme.charts.visual.barVariant}`}
      style={chartCssVars(theme, variant)}
    >
      {data.map((item) => {
        const color =
          variant === "fragile"
            ? theme.charts.status.missed
            : getScoreColor(theme, item.value);
        return (
          <div className="themed-bar-list-row" key={item.name}>
            <div>
              <strong>{item.name}</strong>
              <span>{valueFormatter(item.value)}</span>
            </div>
            <i
              style={{
                width: `${Math.max(6, (item.value / max) * 100)}%`,
                background: `linear-gradient(90deg, ${color}, var(--chart-secondary))`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
