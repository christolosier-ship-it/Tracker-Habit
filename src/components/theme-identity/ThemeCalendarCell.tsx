import type { ReactNode } from "react";
import { AppTheme } from "../../themes/theme-types";
import { HabitStatus } from "../../types";
import { getScoreColor } from "../charts/chart-theme-utils";

type ThemeCalendarCellProps = {
  theme: AppTheme;
  status?: HabitStatus;
  score?: number | null;
  children: ReactNode;
  onClick?: () => void;
  title?: string;
};

const kawaiiSymbols: Record<HabitStatus, string> = {
  done: "♥",
  partial: "★",
  missed: "×",
  rest: "☁",
  empty: "·",
};

export function ThemeCalendarCell({
  theme,
  status,
  score,
  children,
  onClick,
  title,
}: ThemeCalendarCellProps) {
  const content =
    theme.identity.cells.variant === "kawaii-sticker" && status
      ? kawaiiSymbols[status]
      : children;
  const className = `theme-calendar-cell ${status ?? ""}`.trim();
  const style = score === undefined
    ? undefined
    : ({
        "--cell-score-color":
          score === null ? theme.charts.status.empty : getScoreColor(theme, score),
      } as React.CSSProperties);

  if (onClick) {
    return (
      <button
        className={className}
        data-cell-variant={theme.identity.cells.variant}
        style={style}
        title={title}
        onClick={onClick}
        type="button"
      >
        {content}
      </button>
    );
  }

  return (
    <span
      className={className}
      data-cell-variant={theme.identity.cells.variant}
      style={style}
      title={title}
    >
      {content}
    </span>
  );
}
