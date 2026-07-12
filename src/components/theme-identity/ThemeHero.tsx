import React from "react";
import { AppTheme } from "../../themes/theme-types";
import { ArcadePlayerHud } from "./imported/ArcadeComponents";
import { KawaiiPartyHero } from "./imported/KawaiiComponents";

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

export function ThemeHero({
  theme,
  title,
  yearControls,
  monthControls,
  score,
  streak,
  activeHabits,
  doneLogs,
}: Props) {
  const controls = <div className="hero-controls">{yearControls}{monthControls}</div>;

  if (theme.id === "kawaii-maximalist") {
    return (
      <div className="theme-hero-imported theme-hero-imported-kawaii">
        <div className="hero-copy">
          <p className="eyebrow">Habit Party</p>
          <h1>{title}</h1>
        </div>
        <KawaiiPartyHero score={score} streak={streak} />
        {controls}
      </div>
    );
  }

  if (theme.id === "retro-arcade") {
    return (
      <div className="theme-hero-imported theme-hero-imported-arcade">
        <div className="hero-copy">
          <p className="eyebrow">Player one ready</p>
          <h1>{title}</h1>
        </div>
        <ArcadePlayerHud score={score} streak={streak} activeHabits={activeHabits} doneLogs={doneLogs} />
        {controls}
      </div>
    );
  }

  return (
    <>
      <div className="hero-copy">
        <p className="eyebrow">Discipline & Productivité</p>
        <h1>{title}</h1>
        <p className="quote">Ce que tu répètes chaque jour façonne la personne que tu deviens.</p>
      </div>
      {controls}
    </>
  );
}
