import React, { ReactNode } from "react";
import { Badge } from "../../components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { ThemeCalendarCell } from "../../components/theme-identity/ThemeCalendarCell";
import { DashboardStats } from "../../lib/dashboard-selectors";
import { AppTheme } from "../../themes/theme-types";
import { monthShortLabels } from "../../app/constants";

type AnnualHabitMatrixProps = {
  theme: AppTheme;
  rates: DashboardStats["annualRates"];
  mascot?: ReactNode;
};

export function AnnualHabitMatrix({
  theme,
  rates,
  mascot,
}: AnnualHabitMatrixProps) {
  return (
    <Card className="annual-matrix-card">
      <CardHeader className="section-heading">
        <div>
          <p className="eyebrow compact">Vue annuelle</p>
          <CardTitle>Matrice annuelle des habitudes</CardTitle>
          <CardDescription>
            Une carte météo de ta discipline : solide, fragile ou non suivi.
          </CardDescription>
        </div>
        <Badge variant="warm">12 mois</Badge>
      </CardHeader>
      <CardContent>
        <div
          className={`annual-matrix themed-heatmap heatmap-${theme.charts.visual.heatmapVariant}`}
        >
          <strong>Habitude</strong>
          {monthShortLabels.map((label) => (
            <strong key={label}>{label}</strong>
          ))}
          {rates.map((habit) => (
            <React.Fragment key={habit.id}>
              <span>
                {habit.nom}
                <small>{habit.categorie}</small>
              </span>
              {habit.values.map((value, index) => (
                <ThemeCalendarCell
                  theme={theme}
                  score={value}
                  active={value >= 65}
                  key={`${habit.id}-${index}`}
                >
                  {value < 0 ? "—" : `${value}%`}
                </ThemeCalendarCell>
              ))}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
      {mascot && <div className="annual-matrix-mascot-slot">{mascot}</div>}
    </Card>
  );
}
