import React, { useMemo, useState } from "react";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import { ThemeCalendarCell } from "../components/theme-identity/ThemeCalendarCell";
import { HabitStatusCard } from "../features/tracking/HabitStatusCard";
import { PeriodControls } from "../features/period/PeriodControls";
import { daysInMonth } from "../lib/date-utils";
import { monthLongLabels, statusSymbol } from "../app/constants";
import { MonthPageProps } from "./page-types";
import * as S from "../lib/stats";
import { selectMonthTracking } from "../lib/tracking-selectors";
import { readTrackerStatus } from "../analytics/tracker-index";
import { useMediaQuery } from "../hooks/useMediaQuery";

export function MonthPage({
  data,
  theme,
  setSettings,
  cycle,
}: MonthPageProps) {
  const [selectedDay, setSelectedDay] = useState(() => {
    const now = new Date();
    return now.getMonth() === data.settings.moisActif ? now.getDate() : 1;
  });
  const year = data.settings.anneeActive;
  const month = data.settings.moisActif;
  const dayCount = daysInMonth(year, month);
  const isCompact = useMediaQuery("(max-width: 720px)");
  const activeHabits = useMemo(
    () => data.habits.filter((habit) => habit.active),
    [data.habits],
  );
  const tracking = useMemo(
    () =>
      selectMonthTracking(
        data.habits,
        data.logs,
        data.settings.compterNonSaisisCommeManques,
        year,
        month,
      ),
    [
      data.habits,
      data.logs,
      data.settings.compterNonSaisisCommeManques,
      year,
      month,
    ],
  );
  const safeSelectedDay = Math.min(selectedDay, dayCount);
  const currentDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(safeSelectedDay).padStart(2, "0")}`;

  return (
    <>
      <PeriodControls
        year={year}
        month={month}
        onYearChange={(nextYear) => setSettings({ anneeActive: nextYear })}
        onMonthChange={(nextMonth) => setSettings({ moisActif: nextMonth })}
      />
      <Card className="month-toolbar">
        <label>
          Mois
          <select
            value={month}
            onChange={(event) =>
              setSettings({ moisActif: Number(event.target.value) })
            }
          >
            {monthLongLabels.map((label, index) => (
              <option value={index} key={label}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Jour mobile
          <select
            value={safeSelectedDay}
            onChange={(event) => setSelectedDay(Number(event.target.value))}
          >
            {Array.from({ length: dayCount }, (_, index) => (
              <option value={index + 1} key={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
        </label>
        <strong>
          {monthLongLabels[month]} {year}
        </strong>
      </Card>

      {!isCompact && <section
        className="month-grid"
        style={{ gridTemplateColumns: `220px repeat(${dayCount}, 38px) 70px` }}
      >
        <b>Habitude</b>
        {Array.from({ length: dayCount }, (_, index) => (
          <b key={index + 1}>{index + 1}</b>
        ))}
        <b>Score</b>
        {activeHabits.map((habit) => (
          <React.Fragment key={habit.id}>
            <span>{habit.nom}</span>
            {Array.from({ length: dayCount }, (_, index) => {
              const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(index + 1).padStart(2, "0")}`;
              const status = readTrackerStatus(tracking.index, habit.id, date);
              return (
                <ThemeCalendarCell
                  theme={theme}
                  status={status}
                  title={`${habit.nom} · ${S.statusLabels[status]}`}
                  onClick={() => cycle(habit.id, date)}
                  key={date}
                >
                  {statusSymbol(status)}
                </ThemeCalendarCell>
              );
            })}
            <strong>
              {(tracking.scores.get(habit.id) ?? -1) < 0
                ? "—"
                : `${tracking.scores.get(habit.id)}%`}
            </strong>
          </React.Fragment>
        ))}
      </section>}

      {isCompact && <section className="mobile-month-list">
        <div className="section-heading mobile-heading">
          <h2>
            {safeSelectedDay} {monthLongLabels[month]}
          </h2>
          <Badge variant="warm">{activeHabits.length} habitudes actives</Badge>
        </div>
        <div className="habit-card-grid">
          {activeHabits.map((habit) => (
            <HabitStatusCard
              habit={habit}
              date={currentDate}
              status={readTrackerStatus(tracking.index, habit.id, currentDate)}
              cycle={cycle}
              key={habit.id}
            />
          ))}
        </div>
      </section>}
    </>
  );
}
