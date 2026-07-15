import { AppTheme } from "../../themes/theme-types";
import type { CategoryStats } from "../../analytics/tracker-analytics";
import { scoreBadge } from "./stats-display-utils";

type ThemedCategoryScoreBarsProps = { theme: AppTheme; data: CategoryStats[] };

export function ThemedCategoryScoreBars({
  theme,
  data,
}: ThemedCategoryScoreBarsProps) {
  return (
    <div className="category-score-bars">
      {data.map((item) => {
        const color = theme.charts.category[item.categorie];
        const badge = scoreBadge(theme, item.score);
        return (
          <div
            className="category-score-row"
            key={item.categorie}
            style={
              {
                "--category-color": color,
                "--badge-color": badge.color,
              } as React.CSSProperties
            }
          >
            <div className="category-score-header">
              <strong className="category-score-name">{item.categorie}</strong>
              <span className="category-score-meta">
                {item.score}% · {item.total} suivis
              </span>
              <span className="category-score-badge">{badge.label}</span>
            </div>
            <div className="category-score-track">
              <i
                className="category-score-fill"
                style={{ width: `${Math.max(0, Math.min(100, item.score))}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
