import React, { useMemo, useState } from "react";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import { ThemeCalendarCell } from "../components/theme-identity/ThemeCalendarCell";
import { HabitStatusCard } from "../features/tracking/HabitStatusCard";
import { PeriodControls } from "../features/period/PeriodControls";
import { daysInMonth } from "../lib/date-utils";
import { monthLongLabels, statusSymbol } from "../app/constants";
import { MonthPageProps } from "./page-types";
import { HABIT_STATUS_DEFINITIONS } from "../domain/definitions";
import { readTrackerStatus } from "../analytics/tracker-index";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { habitExistsOnDate } from "../domain/evaluation";

export function MonthPage({
  data,
  theme,
  analytics,
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
  const monthStart = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const monthEnd = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayCount).padStart(2, "0")}`;
  const visibleHabits = useMemo(
    () =>
      data.habits.filter(
        (habit) =>
          habit.dateCreation <= monthEnd &&
          (!habit.archivedAt || habit.archivedAt >= monthStart),
      ),
    [data.habits, monthEnd, monthStart],
  );
  const scores = useMemo(
    () => analytics.monthScores(year, month),
    [analytics, month, year],
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
        {visibleHabits.map((habit) => (
          <React.Fragment key={habit.id}>
            <span>{habit.nom}</span>
            {Array.from({ length: dayCount }, (_, index) => {
              const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(index + 1).padStart(2, "0")}`;
              const status = readTrackerStatus(analytics.index, habit.id, date);
              return (
                <ThemeCalendarCell
                  theme={theme}
                  status={status}
                  title={`${habit.nom} · ${HABIT_STATUS_DEFINITIONS[status].label}`}
                  onClick={
                    habit.active &&
                    habitExistsOnDate(habit, date) &&
                    date <= analytics.today
                      ? () => cycle(habit.id, date)
                      : undefined
                  }
                  key={date}
                >
                  {statusSymbol(status)}
                </ThemeCalendarCell>
              );
            })}
            <strong>
              {scores.get(habit.id) === null || scores.get(habit.id) === undefined
                ? "—"
                : `${scores.get(habit.id)}%`}
            </strong>
          </React.Fragment>
        ))}
      </section>}

      {isCompact && <section className="mobile-month-list">
        <div className="section-heading mobile-heading">
          <h2>
            {safeSelectedDay} {monthLongLabels[month]}
          </h2>
          <Badge variant="warm">{visibleHabits.length} habitudes suivies</Badge>
        </div>
        <div className="habit-card-grid">
          {visibleHabits.map((habit) => (
            <HabitStatusCard
              habit={habit}
              date={currentDate}
              status={readTrackerStatus(analytics.index, habit.id, currentDate)}
              cycle={cycle}
              canEdit={
                currentDate <= analytics.today &&
                habit.active &&
                habitExistsOnDate(habit, currentDate)
              }
              key={habit.id}
            />
          ))}
        </div>
      </section>}
    </>
  );
}
