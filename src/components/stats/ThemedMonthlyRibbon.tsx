import { AppTheme } from "../../themes/theme-types";
import { MonthlyScore, scoreColor } from "./stats-display-utils";

type ThemedMonthlyRibbonProps = { theme: AppTheme; monthly: MonthlyScore[] };

export function ThemedMonthlyRibbon({
  theme,
  monthly,
}: ThemedMonthlyRibbonProps) {
  return (
    <section
      className="monthly-ribbon"
      aria-label="Ruban coloré des scores mensuels"
    >
      {monthly.map((item) => {
        const color = scoreColor(theme, item.score);
        return (
          <div
            className="monthly-ribbon-cell"
            key={item.mois}
            style={
              {
                "--month-color": color,
                "--month-score": item.score,
              } as React.CSSProperties
            }
          >
            <span className="monthly-ribbon-month">{item.mois}</span>
            <strong className="monthly-ribbon-score">{item.score}%</strong>
          </div>
        );
      })}
    </section>
  );
}
