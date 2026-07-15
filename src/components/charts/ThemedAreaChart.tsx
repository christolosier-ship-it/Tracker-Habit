import type { AppTheme } from "../../themes/theme-types";
import type { ChartVariant } from "./chart-theme-utils";
import { NativeCartesianChart } from "./NativeCartesianChart";

type Props<T extends Record<string, unknown>> = {
  theme: AppTheme;
  data: T[];
  index: string;
  categories: string[];
  variant: ChartVariant;
  valueFormatter?: (value: number) => string;
};

export function ThemedAreaChart<T extends Record<string, unknown>>({
  categories,
  ...props
}: Props<T>) {
  return (
    <NativeCartesianChart
      {...props}
      category={categories[0]}
      kind="area"
    />
  );
}
