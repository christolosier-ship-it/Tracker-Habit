import React, { useMemo, useState } from "react";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import { ThemeCalendarCell } from "../components/theme-identity/ThemeCalendarCell";
import { HabitStatusCard } from "../features/tracking/HabitStatusCard";
import { PeriodControls } from "../features/period/PeriodControls";
import { buildLogIndex, readIndexedLog } from "../lib/log-index";
import { daysInMonth } from "../lib/date-utils";
import { monthLongLabels, statusSymbol } from "../app/constants";
import { MonthPageProps } from "./page-types";
import * as S from "../lib/stats";

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
  const activeHabits = useMemo(
    () => data.habits.filter((habit) => habit.active),
    [data.habits],
  );
  const logIndex = useMemo(() => buildLogIndex(data.logs), [data.logs]);
  const currentDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;

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
            value={selectedDay}
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

      <section
        className="month-grid"
        style={{ "--day-count": dayCount } as React.CSSProperties}
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
              const status = readIndexedLog(logIndex, habit.id, date);
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
              {S.calculateHabitMonthScore(
                habit,
                data.logs,
                year,
                month,
                data.settings,
              )}
              %
            </strong>
          </React.Fragment>
        ))}
      </section>

      <section className="mobile-month-list">
        <div className="section-heading mobile-heading">
          <h2>
            {selectedDay} {monthLongLabels[month]}
          </h2>
          <Badge variant="warm">{activeHabits.length} habitudes actives</Badge>
        </div>
        <div className="habit-card-grid">
          {activeHabits.map((habit) => (
            <HabitStatusCard
              habit={habit}
              date={currentDate}
              data={data}
              cycle={cycle}
              key={habit.id}
            />
          ))}
        </div>
      </section>
    </>
  );
}
