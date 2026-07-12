import type { ReactNode } from "react";
import { AppTheme } from "../../themes/theme-types";
import { HabitStatus } from "../../types";

type ThemeCalendarCellProps = {
  theme: AppTheme;
  status?: HabitStatus;
  score?: number;
  active?: boolean;
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
  active,
  children,
  onClick,
  title,
}: ThemeCalendarCellProps) {
  const content =
    theme.identity.cells.variant === "kawaii-sticker" && status
      ? kawaiiSymbols[status]
      : children;
  const className = `theme-calendar-cell ${status ?? ""}`.trim();

  if (onClick) {
    return (
      <button
        className={className}
        data-cell-variant={theme.identity.cells.variant}
        data-score={score}
        data-active={active}
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
      data-score={score}
      data-active={active}
      title={title}
    >
      {content}
    </span>
  );
}
