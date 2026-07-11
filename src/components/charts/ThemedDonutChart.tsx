import { DonutChart } from "@tremor/react";
import { AppTheme } from "../../themes/theme-types";
import { StatusStats, CategoryStats } from "../../types";
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
};
type CategoryProps = {
  theme: AppTheme;
  variant: "category";
  data: CategoryStats[];
  valueFormatter?: (value: number) => string;
};
export function ThemedDonutChart(props: StatusProps | CategoryProps) {
  const data =
    props.variant === "status"
      ? (statusOrder
          .map((status) => props.data.find((item) => item.status === status))
          .filter(Boolean) as StatusStats[])
      : props.data;
  const colors =
    props.variant === "status"
      ? getStatusChartColors(props.theme)
      : props.data.map((item) => props.theme.charts.category[item.categorie]);
  const total = data.reduce(
    (sum, item) => sum + ("value" in item ? item.value : item.total),
    0,
  );
  return (
    <div
      className={`themed-chart-panel themed-donut donut-${props.theme.charts.visual.donutVariant}`}
      style={chartCssVars(props.theme, props.variant)}
    >
      <DonutChart
        className="tremor-chart"
        data={data}
        index={props.variant === "status" ? "label" : "categorie"}
        category={props.variant === "status" ? "value" : "total"}
        colors={colors}
        valueFormatter={props.valueFormatter}
        showAnimation
      />
      <div className="themed-donut-center">
        <strong>{total}</strong>
        <span>{props.variant === "status" ? "statuts" : "suivis"}</span>
      </div>
    </div>
  );
}
