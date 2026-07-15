import React from "react";
import { Badge } from "../../components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { ThemeCalendarCell } from "../../components/theme-identity/ThemeCalendarCell";
import type { DashboardAnalytics } from "../../analytics/tracker-analytics";
import { AppTheme } from "../../themes/theme-types";
import { monthShortLabels } from "../../app/constants";

type AnnualHabitMatrixProps = {
  theme: AppTheme;
  rates: DashboardAnalytics["annualRates"];
};

export function AnnualHabitMatrix({
  theme,
  rates,
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
        <div className="annual-matrix themed-heatmap">
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
                  key={`${habit.id}-${index}`}
                >
                  {value === null ? "—" : `${value}%`}
                </ThemeCalendarCell>
              ))}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
