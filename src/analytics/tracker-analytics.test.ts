import { describe, expect, it } from "vitest";
import type { Habit, HabitLog, UserSettings } from "../types";
import { createTrackerAnalytics } from "./tracker-analytics";

const now = new Date(2026, 1, 15, 12);
const settings: UserSettings = {
  anneeActive: 2026,
  moisActif: 1,
  compterNonSaisisCommeManques: false,
  themeId: "dopamine-pop",
  mascotEnabled: true,
};

function habit(id: string, frequency: Habit["frequence"] = "quotidienne"): Habit {
  return {
    id,
    nom: id,
    categorie: "Productivité",
    frequence: frequency,
    objectif: "1 fois",
    priorite: "normale",
    active: true,
    dateCreation: "2026-01-01",
  };
}

describe("moteur analytique indexé", () => {
  it("évalue une habitude hebdomadaire une seule fois et l’affecte à la fin de semaine", () => {
    const habits = [habit("weekly", "hebdomadaire")];
    const logs: HabitLog[] = [
      { habitId: "weekly", date: "2026-01-30", status: "partial" },
      { habitId: "weekly", date: "2026-01-31", status: "done" },
    ];
    const analytics = createTrackerAnalytics(habits, logs, settings, now);

    expect(analytics.monthScores(2026, 0).get("weekly")).toBe(-1);
    expect(analytics.monthScores(2026, 1).get("weekly")).toBe(100);
    expect(analytics.evaluationsForYear(2026)).toEqual([
      expect.objectContaining({
        habitId: "weekly",
        date: "2026-02-01",
        status: "done",
        score: 1,
      }),
    ]);
  });

  it("utilise la même année pour les KPI, statuts et volumes", () => {
    const habits = [habit("daily")];
    const logs: HabitLog[] = [
      { habitId: "daily", date: "2025-12-31", status: "done" },
      { habitId: "daily", date: "2026-02-01", status: "partial" },
    ];
    const dashboard = createTrackerAnalytics(habits, logs, settings, now).dashboard(
      2026,
      1,
      ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"],
    );

    expect(dashboard.doneLogs).toBe(0);
    expect(dashboard.scoreGlobal).toBe(50);
    expect(dashboard.success).toBe(0);
    expect(dashboard.statusStats.find((item) => item.status === "done")?.value).toBe(0);
    expect(dashboard.statusStats.find((item) => item.status === "partial")?.value).toBe(1);
  });

  it("n’annonce pas une journée parfaite tant que toutes les habitudes dues ne sont pas closes", () => {
    const habits = [habit("one"), habit("two")];
    const oneDone: HabitLog[] = [
      { habitId: "one", date: "2026-02-15", status: "done" },
    ];
    expect(createTrackerAnalytics(habits, oneDone, settings, now).isPerfectDay("2026-02-15")).toBe(false);

    const complete: HabitLog[] = [
      ...oneDone,
      { habitId: "two", date: "2026-02-15", status: "rest" },
    ];
    expect(createTrackerAnalytics(habits, complete, settings, now).isPerfectDay("2026-02-15")).toBe(true);
  });

  it("exclut des habitudes fragiles celles qui n’ont aucune opportunité mesurée", () => {
    const habits = [habit("tracked"), habit("without-data")];
    const logs: HabitLog[] = [
      { habitId: "tracked", date: "2026-02-01", status: "missed" },
    ];
    const dashboard = createTrackerAnalytics(habits, logs, settings, now).dashboard(
      2026,
      1,
      Array.from({ length: 12 }, (_, index) => String(index + 1)),
    );
    expect(dashboard.fragileHabits).toEqual([{ nom: "tracked", score: 0 }]);
  });
});
