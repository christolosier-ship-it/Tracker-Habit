import { AppTheme } from "../../themes/theme-types";
import { CategoryStats, StatusStats } from "../../types";
import {
  fragileCategory,
  fragileMonth,
  MonthlyScore,
  softColor,
  strongestCategory,
  strongestMonth,
} from "./stats-display-utils";

type StatsInsightCardsProps = {
  theme: AppTheme;
  monthly: MonthlyScore[];
  categoryStats: CategoryStats[];
  statusStats: StatusStats[];
};

export function StatsInsightCards({
  theme,
  monthly,
  categoryStats,
}: StatsInsightCardsProps) {
  const bestMonth = strongestMonth(monthly);
  const weakMonth = fragileMonth(monthly);
  const bestCategory = strongestCategory(categoryStats);
  const weakCategory = fragileCategory(categoryStats);
  const cards = [
    {
      emoji: "🏆",
      label: "Meilleur mois",
      value: bestMonth ? bestMonth.mois : "À construire",
      note: bestMonth
        ? `${bestMonth.score}% de score mensuel`
        : "Aucun mois suivi pour l’instant.",
      color: theme.charts.hexPalette[0] ?? "#999",
    },
    {
      emoji: "🧭",
      label: "Mois fragile",
      value: weakMonth ? weakMonth.mois : "À construire",
      note: weakMonth
        ? `${weakMonth.score}% : zone à consolider.`
        : "Pas encore de mois fragile détecté.",
      color: theme.charts.status.partial ?? "#999",
    },
    {
      emoji: "⚡",
      label: "Catégorie forte",
      value: bestCategory ? bestCategory.categorie : "À construire",
      note: bestCategory
        ? `${bestCategory.score}% sur ${bestCategory.total} suivis.`
        : "Ajoute des suivis pour révéler une force.",
      color: theme.charts.status.done ?? "#999",
    },
    {
      emoji: "🔧",
      label: "Catégorie à reprendre",
      value: weakCategory ? weakCategory.categorie : "À construire",
      note: weakCategory
        ? `${weakCategory.score}% : reprise douce et ciblée.`
        : "Aucune catégorie à reprendre pour l’instant.",
      color: theme.charts.status.missed ?? "#999",
    },
  ];

  return (
    <section className="stats-insight-grid">
      {cards.map((card) => (
        <article
          className="stats-insight-card"
          key={card.label}
          style={
            {
              "--insight-color": card.color,
              "--insight-soft": softColor(card.color),
            } as React.CSSProperties
          }
        >
          <span className="stats-insight-emoji">{card.emoji}</span>
          <span className="stats-insight-label">{card.label}</span>
          <strong className="stats-insight-value">{card.value}</strong>
          <p className="stats-insight-note">{card.note}</p>
        </article>
      ))}
    </section>
  );
}
