import { ThemedDonutChart } from "../charts/ThemedDonutChart";
import { AppTheme } from "../../themes/theme-types";
import { StatusStats } from "../../types";
import { statusLegendOrder } from "./stats-display-utils";

type ThemedStatusBreakdownProps = { theme: AppTheme; data: StatusStats[] };

export function ThemedStatusBreakdown({
  theme,
  data,
}: ThemedStatusBreakdownProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const byStatus = new Map(data.map((item) => [item.status, item]));
  return (
    <div className="status-breakdown">
      <div className="status-breakdown-chart">
        <ThemedDonutChart
          theme={theme}
          variant="status"
          data={data}
          valueFormatter={(value: number) => `${value}`}
          compact
        />
      </div>
      <div className="status-legend">
        {statusLegendOrder.map(({ status, label }) => {
          const value = byStatus.get(status)?.value ?? 0;
          const percent = total === 0 ? 0 : Math.round((value / total) * 100);
          const color = theme.charts.status[status];
          return (
            <div
              className="status-legend-row"
              key={status}
              style={{ "--status-color": color } as React.CSSProperties}
            >
              <span className="status-legend-dot" />
              <span className="status-legend-label">{label}</span>
              <strong className="status-legend-value">{value}</strong>
              <span className="status-legend-percent">{percent}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
