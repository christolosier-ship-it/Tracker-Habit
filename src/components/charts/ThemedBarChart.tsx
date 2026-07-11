import { BarChart } from "@tremor/react";
import { AppTheme } from "../../themes/theme-types";
import {
  ChartVariant,
  chartCssVars,
  getTremorColors,
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
  return (
    <div
      className={`themed-chart-panel themed-bar-chart bar-${theme.charts.visual.barVariant} grid-${theme.charts.visual.grid}`}
      style={chartCssVars(theme, variant)}
    >
      <BarChart
        className="tremor-chart"
        data={data}
        index={index}
        categories={categories}
        colors={getTremorColors(theme, variant)}
        valueFormatter={valueFormatter}
        yAxisWidth={42}
        showLegend={false}
      />
    </div>
  );
}
