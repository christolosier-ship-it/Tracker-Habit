import { describe, expect, it } from "vitest";
import { Habit, HabitLog, UserSettings } from "../types";
import { formatLocalIso } from "./date-utils";
import {
  calculateCurrentStreak,
  calculateDayScore,
  calculateFragileHabits,
  calculateMonthScore,
  calculatePriorityDoneDays,
} from "./stats";

const settings: UserSettings = {
  anneeActive: 2025,
  moisActif: 0,
  compterNonSaisisCommeManques: false,
  themeId: "dopamine-pop",
  mascotEnabled: true,
};

function habit(
  id: string,
  frequence: Habit["frequence"] = "quotidienne",
  priorite: Habit["priorite"] = "normale",
): Habit {
  return {
    id,
    nom: id,
    categorie: "Productivité",
    frequence,
    objectif: "1 fois",
    priorite,
    active: true,
    dateCreation: "2025-01-01",
  };
}

describe("fiabilité des scores", () => {
  it("ne pénalise pas une habitude hebdomadaire sans saisie sur la journée", () => {
    const habits = [habit("daily"), habit("weekly", "hebdomadaire")];
    const logs: HabitLog[] = [
      { habitId: "daily", date: "2025-01-06", status: "done" },
    ];
    expect(calculateDayScore(habits, logs, "2025-01-06", settings)).toBe(100);
  });

  it("compte réellement les jours quotidiens non saisis quand l’option est active", () => {
    const habits = [habit("daily")];
    const logs: HabitLog[] = [
      { habitId: "daily", date: "2025-01-01", status: "done" },
    ];
    expect(calculateMonthScore(habits, logs, 2025, 0, settings)).toBe(100);
    expect(
      calculateMonthScore(habits, logs, 2025, 0, {
        ...settings,
        compterNonSaisisCommeManques: true,
      }),
    ).toBe(3);
  });

  it("ignore aujourd’hui dans la série tant qu’aucune saisie n’existe", () => {
    const habits = [habit("daily")];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const beforeYesterday = new Date();
    beforeYesterday.setDate(beforeYesterday.getDate() - 2);
    const logs: HabitLog[] = [
      { habitId: "daily", date: formatLocalIso(yesterday), status: "done" },
      {
        habitId: "daily",
        date: formatLocalIso(beforeYesterday),
        status: "done",
      },
    ];
    expect(calculateCurrentStreak(habits, logs, settings)).toBe(2);
  });

  it("conserve les habitudes à zéro dans la liste fragile", () => {
    const habits = [habit("zero"), habit("good")];
    const logs: HabitLog[] = [
      { habitId: "zero", date: "2025-01-01", status: "missed" },
      { habitId: "good", date: "2025-01-01", status: "done" },
    ];
    expect(calculateFragileHabits(habits, logs, settings)[0]).toEqual({
      nom: "zero",
      score: 0,
    });
  });

  it("calcule les jours prioritaires sans dépendre d’un identifiant fixe", () => {
    const habits = [habit("custom-priority", "quotidienne", "haute")];
    const logs: HabitLog[] = [
      { habitId: "custom-priority", date: "2025-01-01", status: "done" },
      { habitId: "custom-priority", date: "2025-01-02", status: "done" },
    ];
    expect(calculatePriorityDoneDays(habits, logs)).toBe(2);
  });
});
