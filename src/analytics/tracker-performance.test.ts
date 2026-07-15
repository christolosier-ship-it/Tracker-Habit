import { expect, it } from "vitest";
import { createTrackerAnalytics } from "./tracker-analytics";
import { demoData } from "../persistence";
import type { Habit, HabitLog } from "../domain/tracker-types";
import { formatLocalIso } from "../lib/date-utils";

const monthShortLabels = [
  "Jan", "Fév", "Mar", "Avr", "Mai", "Juin",
  "Juil", "Août", "Sep", "Oct", "Nov", "Déc",
] as const;

it("calcule le Dashboard en moins de 50 ms en médiane sur la démo", () => {
  const data = demoData();
  const now = new Date();

  const run = () =>
    createTrackerAnalytics(
      data.habits,
      data.logs,
      data.settings,
      now,
    ).dashboard(
      data.settings.anneeActive,
      data.settings.moisActif,
      monthShortLabels,
    );

  run();
  const samples = Array.from({ length: 9 }, () => {
    const start = performance.now();
    run();
    return performance.now() - start;
  }).sort((left, right) => left - right);
  const median = samples[Math.floor(samples.length / 2)];

  expect(
    median,
    `La médiane du sélecteur Dashboard est de ${median.toFixed(1)} ms`,
  ).toBeLessThan(50);
});

it("reste fluide avec 200 habitudes et près de 20 000 saisies", () => {
  const habits: Habit[] = Array.from({ length: 200 }, (_, index) => ({
    id: `scale-${index}`,
    nom: `Habitude ${index}`,
    categorie: index % 4 === 0 ? "Productivité" : "Routine",
    frequence: index % 4 === 0 ? "hebdomadaire" : "quotidienne",
    objectif: "1 fois",
    priorite: index % 5 === 0 ? "haute" : "normale",
    active: true,
    dateCreation: "2026-01-01",
  }));
  const logs: HabitLog[] = [];
  for (let offset = 0; offset < 120; offset += 1) {
    const date = new Date(2026, 0, 1, 12);
    date.setDate(date.getDate() + offset);
    const iso = formatLocalIso(date);
    for (const habit of habits) {
      if (habit.frequence === "hebdomadaire" && offset % 7 !== 0) continue;
      logs.push({ habitId: habit.id, date: iso, status: "done" });
    }
  }
  const run = () =>
    createTrackerAnalytics(
      habits,
      logs,
      { compterNonSaisisCommeManques: false },
      "2026-06-30",
    ).dashboard(2026, 5, monthShortLabels);

  run();
  const samples = Array.from({ length: 5 }, () => {
    const start = performance.now();
    run();
    return performance.now() - start;
  }).sort((left, right) => left - right);
  const median = samples[Math.floor(samples.length / 2)];

  expect(
    median,
    `La médiane à grande échelle est de ${median.toFixed(1)} ms`,
  ).toBeLessThan(250);
});
