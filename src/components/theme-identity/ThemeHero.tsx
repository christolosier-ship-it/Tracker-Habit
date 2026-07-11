import React from "react";
import { AppTheme } from "../../themes/theme-types";

type Props = {
  theme: AppTheme;
  title: string;
  yearControls: React.ReactNode;
  monthControls: React.ReactNode;
  score: number;
  streak: number;
  activeHabits: number;
  year: number;
  doneLogs?: number;
  disciplinedDays?: number;
};

export function ThemeHero({ title, yearControls, monthControls }: Props) {
  return (
    <>
      <div className="hero-copy">
        <p className="eyebrow">Discipline & Productivité</p>
        <h1>{title}</h1>
        <p className="quote">Ce que tu répètes chaque jour façonne la personne que tu deviens.</p>
      </div>
      <div className="hero-controls">
        {yearControls}
        {monthControls}
      </div>
    </>
  );
}
