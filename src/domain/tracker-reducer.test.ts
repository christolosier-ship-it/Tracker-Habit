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

  it("rejette les réglages invalides et les patchs sans changement", () => {
    const initial = createTrackerState(data());
    expect(
      trackerReducer(initial, {
        type: "settings/patch",
        patch: { moisActif: 12 },
      }),
    ).toBe(initial);
    expect(
      trackerReducer(initial, {
        type: "settings/patch",
        patch: { moisActif: initial.data.settings.moisActif },
      }),
    ).toBe(initial);
  });

  it("ajoute, modifie et protège l'unicité des habitudes", () => {
    const initial = createTrackerState(data());
    const added = trackerReducer(initial, {
      type: "habit/add",
      habit: habit("two"),
    });
    expect(added.data.habits.map((item) => item.id)).toEqual(["one", "two"]);
    expect(
      trackerReducer(added, { type: "habit/add", habit: habit("two") }),
    ).toBe(added);

    const updated = trackerReducer(added, {
      type: "habit/update",
      habitId: "two",
      patch: { nom: "Deux" },
    });
    expect(updated.data.habits[1].nom).toBe("Deux");
    expect(
      trackerReducer(updated, {
        type: "habit/update",
        habitId: "unknown",
        patch: { nom: "Absent" },
      }),
    ).toBe(updated);
  });

  it("ignore la suppression d'une habitude inconnue", () => {
    const initial = createTrackerState(data());
    expect(
      trackerReducer(initial, { type: "habit/delete", habitId: "unknown" }),
    ).toBe(initial);
  });

  it("parcourt les statuts existants puis supprime le log revenu à empty", () => {
    const initial = createTrackerState({
      ...data(),
      logs: [{ habitId: "one", date: "2026-02-14", status: "partial" }],
    });
    const missed = trackerReducer(initial, {
      type: "log/cycle",
      habitId: "one",
      date: "2026-02-14",
      now,
    });
    expect(missed.data.logs[0].status).toBe("missed");
    const rest = trackerReducer(missed, {
      type: "log/cycle",
      habitId: "one",
      date: "2026-02-14",
      now,
    });
    expect(rest.data.logs[0].status).toBe("rest");
    const empty = trackerReducer(rest, {
      type: "log/cycle",
      habitId: "one",
      date: "2026-02-14",
      now,
    });
    expect(empty.data.logs).toEqual([]);
  });

  it("ignore les habitudes inactives, dates invalides et identifiants inconnus", () => {
    const inactive = habit("inactive");
    inactive.active = false;
    const initial = createTrackerState(data([inactive]));
    for (const [habitId, date] of [
      ["inactive", "2026-02-15"],
      ["inactive", "date-invalide"],
      ["unknown", "2026-02-15"],
    ]) {
      expect(
        trackerReducer(initial, {
          type: "log/cycle",
          habitId,
          date,
          now,
        }),
      ).toBe(initial);
    }
  });

  it("remplace les données via la migration et efface une réaction ciblée", () => {
    const initial = {
      ...createTrackerState(data()),
      mascotReaction: { id: 4, type: "habit-done" as const },
      nextReactionId: 4,
    };
    expect(
      trackerReducer(initial, { type: "reaction/clear", reactionId: 3 }),
    ).toBe(initial);
    const cleared = trackerReducer(initial, {
      type: "reaction/clear",
      reactionId: 4,
    });
    expect(cleared.mascotReaction).toBeNull();

    const replacement = { ...data(), schemaVersion: 4 };
    const replaced = trackerReducer(initial, {
      type: "data/replace",
      data: replacement,
    });
    expect(replaced.data.schemaVersion).toBe(SCHEMA_VERSION);
    expect(replaced.mascotReaction).toBeNull();
  });
});
