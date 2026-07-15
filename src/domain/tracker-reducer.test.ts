import { describe, expect, it } from "vitest";
import type { Habit } from "../types";
import { SCHEMA_VERSION, type AppData } from "../persistence";
import { createTrackerState, trackerReducer } from "./tracker-reducer";

const now = new Date(2026, 1, 15, 12);

function habit(id: string): Habit {
  return {
    id,
    nom: id,
    categorie: "Routine",
    frequence: "quotidienne",
    objectif: "1 fois",
    priorite: "normale",
    active: true,
    dateCreation: "2026-01-01",
  };
}

function data(habits = [habit("one")]): AppData {
  return {
    schemaVersion: SCHEMA_VERSION,
    habits,
    logs: [],
    settings: {
      anneeActive: 2026,
      moisActif: 1,
      compterNonSaisisCommeManques: false,
      themeId: "dopamine-pop",
      mascotEnabled: true,
    },
  };
}

describe("trackerReducer", () => {
  it("met à jour les réglages sans modifier les autres références", () => {
    const initial = createTrackerState(data());
    const next = trackerReducer(initial, {
      type: "settings/patch",
      patch: { themeId: "retro-arcade" },
    });
    expect(next.data.settings.themeId).toBe("retro-arcade");
    expect(next.data.habits).toBe(initial.data.habits);
    expect(next.data.logs).toBe(initial.data.logs);
  });

  it("supprime une habitude et tout son historique atomiquement", () => {
    const initial = createTrackerState({
      ...data([habit("one"), habit("two")]),
      logs: [
        { habitId: "one", date: "2026-02-01", status: "done" },
        { habitId: "two", date: "2026-02-01", status: "partial" },
      ],
    });
    const next = trackerReducer(initial, {
      type: "habit/delete",
      habitId: "one",
    });
    expect(next.data.habits.map((item) => item.id)).toEqual(["two"]);
    expect(next.data.logs.map((item) => item.habitId)).toEqual(["two"]);
  });

  it("ne déclenche perfect-day que lorsque toutes les habitudes dues sont closes", () => {
    const initial = createTrackerState(data([habit("one"), habit("two")]));
    const first = trackerReducer(initial, {
      type: "log/cycle",
      habitId: "one",
      date: "2026-02-15",
      now,
    });
    expect(first.mascotReaction?.type).toBe("habit-done");

    const second = trackerReducer(first, {
      type: "log/cycle",
      habitId: "two",
      date: "2026-02-15",
      now,
    });
    expect(second.mascotReaction?.type).toBe("perfect-day");
  });

  it("émet streak-record lorsque le seuil du jour dépasse le record précédent", () => {
    const initial = createTrackerState({
      ...data([habit("one"), habit("two")]),
      logs: [
        { habitId: "two", date: "2026-02-15", status: "partial" },
      ],
    });
    const next = trackerReducer(initial, {
      type: "log/cycle",
      habitId: "one",
      date: "2026-02-15",
      now,
    });
    expect(next.mascotReaction?.type).toBe("streak-record");
  });

  it("ignore une saisie antérieure à la création", () => {
    const initial = createTrackerState(data());
    expect(
      trackerReducer(initial, {
        type: "log/cycle",
        habitId: "one",
        date: "2025-12-31",
        now,
      }),
    ).toBe(initial);
  });
});
