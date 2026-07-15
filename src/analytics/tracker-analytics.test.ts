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

    expect(analytics.monthScores(2026, 0).get("weekly")).toBeNull();
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

  it("distingue une absence de données d’un échec réel à 0 %", () => {
    const habits = [habit("daily")];
    const empty = createTrackerAnalytics(habits, [], settings, now).dashboard(
      2026,
      1,
      Array.from({ length: 12 }, (_, index) => String(index + 1)),
    );
    expect(empty.scoreGlobal).toBeNull();
    expect(empty.currentMonth).toBeNull();
    expect(empty.monthly[1].score).toBeNull();

    const failed = createTrackerAnalytics(
      habits,
      [{ habitId: "daily", date: "2026-02-01", status: "missed" }],
      settings,
      now,
    ).dashboard(
      2026,
      1,
      Array.from({ length: 12 }, (_, index) => String(index + 1)),
    );
    expect(failed.scoreGlobal).toBe(0);
    expect(failed.currentMonth).toBe(0);
    expect(failed.monthly[1].score).toBe(0);
  });

  it("conserve l’historique d’une habitude archivée sans la compter active", () => {
    const archived = {
      ...habit("archived"),
      active: false,
      archivedAt: "2026-02-10",
    };
    const dashboard = createTrackerAnalytics(
      [archived],
      [{ habitId: archived.id, date: "2026-02-05", status: "done" }],
      settings,
      now,
    ).dashboard(
      2026,
      1,
      Array.from({ length: 12 }, (_, index) => String(index + 1)),
    );
    expect(dashboard.scoreGlobal).toBe(100);
    expect(dashboard.activeHabits).toBe(0);
    expect(dashboard.annualRates).toHaveLength(1);
  });

  it("n’assimile pas une période inactive passée à des échecs", () => {
    const paused = {
      ...habit("paused"),
      dateCreation: "2026-02-01",
      inactiveRanges: [{ start: "2026-02-02", end: "2026-02-14" }],
    };
    const analytics = createTrackerAnalytics(
      [paused],
      [
        { habitId: paused.id, date: "2026-02-01", status: "done" },
        { habitId: paused.id, date: "2026-02-15", status: "done" },
      ],
      { ...settings, compterNonSaisisCommeManques: true },
      now,
    );

    expect(analytics.dashboard(2026, 1, Array(12).fill("M")).scoreGlobal).toBe(100);
  });

  it("compte les statuts explicitement saisis, jamais les manques synthétiques", () => {
    const countMissing = {
      ...settings,
      compterNonSaisisCommeManques: true,
    };
    const dashboard = createTrackerAnalytics(
      [habit("one"), habit("two")],
      [{ habitId: "one", date: "2026-02-01", status: "missed" }],
      countMissing,
      now,
    ).dashboard(
      2026,
      1,
      Array.from({ length: 12 }, (_, index) => String(index + 1)),
    );
    expect(dashboard.statusStats.find((item) => item.status === "missed")?.value).toBe(1);
    expect(dashboard.statusStats.some((item) => item.status === "empty")).toBe(false);
  });

  it("ne tronque pas la matrice annuelle au-delà de trente habitudes", () => {
    const habits = Array.from({ length: 45 }, (_, index) => habit(`h-${index}`));
    const dashboard = createTrackerAnalytics(habits, [], settings, now).dashboard(
      2026,
      1,
      Array.from({ length: 12 }, (_, index) => String(index + 1)),
    );
    expect(dashboard.annualRates).toHaveLength(45);
  });
});
