import { describe, expect, it } from "vitest";
import type { Habit } from "../domain/tracker-types";
import { SCHEMA_VERSION, type AppData } from "../persistence";
import { createTrackerState, trackerReducer } from "./tracker-reducer";

const today = "2026-02-15";

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

describe("trackerReducer applicatif", () => {
  it("met à jour les réglages sans modifier les collections métier", () => {
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
    const next = trackerReducer(initial, { type: "habit/delete", habitId: "one" });
    expect(next.data.habits.map((item) => item.id)).toEqual(["two"]);
    expect(next.data.logs.map((item) => item.habitId)).toEqual(["two"]);
  });

  it("prépare puis résout une réaction sans dépendre du moteur analytique", () => {
    const initial = createTrackerState(data());
    const completed = trackerReducer(initial, {
      type: "log/cycle",
      habitId: "one",
      date: today,
      today,
      trackCompletion: true,
    });
    expect(completed.pendingCompletion).toEqual(
      expect.objectContaining({ date: today }),
    );
    expect(completed.mascotReaction).toBeNull();

    const resolved = trackerReducer(completed, {
      type: "reaction/resolve",
      completionId: completed.pendingCompletion!.id,
      reaction: "perfect-day",
    });
    expect(resolved.pendingCompletion).toBeNull();
    expect(resolved.mascotReaction?.type).toBe("perfect-day");
  });

  it("refuse les dates futures et antérieures à la création", () => {
    const initial = createTrackerState(data());
    for (const date of ["2026-02-16", "2025-12-31"]) {
      expect(
        trackerReducer(initial, {
          type: "log/cycle",
          habitId: "one",
          date,
          today,
        }),
      ).toBe(initial);
    }
  });

  it("archive sans effacer l’historique puis réactive proprement", () => {
    const initial = createTrackerState({
      ...data(),
      logs: [{ habitId: "one", date: "2026-02-01", status: "done" }],
    });
    const archived = trackerReducer(initial, {
      type: "habit/update",
      habitId: "one",
      patch: { active: false },
      today,
    });
    expect(archived.data.habits[0]).toMatchObject({ active: false, archivedAt: today });
    expect(archived.data.logs).toEqual(initial.data.logs);

    const active = trackerReducer(archived, {
      type: "habit/update",
      habitId: "one",
      patch: { active: true },
      today,
    });
    expect(active.data.habits[0].active).toBe(true);
    expect(active.data.habits[0].archivedAt).toBeUndefined();
  });

  it("mémorise la période inactive lors d’une réactivation différée", () => {
    const archived = trackerReducer(createTrackerState(data()), {
      type: "habit/update",
      habitId: "one",
      patch: { active: false },
      today: "2026-02-15",
    });
    const reactivated = trackerReducer(archived, {
      type: "habit/update",
      habitId: "one",
      patch: { active: true },
      today: "2026-03-01",
    });

    expect(reactivated.data.habits[0]).toMatchObject({
      active: true,
      inactiveRanges: [{ start: "2026-02-16", end: "2026-02-28" }],
    });
  });

  it("fige les dimensions analytiques dès qu’un historique existe", () => {
    const initial = createTrackerState({
      ...data(),
      logs: [{ habitId: "one", date: "2026-02-01", status: "done" }],
    });
    const next = trackerReducer(initial, {
      type: "habit/update",
      habitId: "one",
      patch: {
        nom: "Nouveau nom",
        categorie: "Santé",
        frequence: "hebdomadaire",
        priorite: "haute",
      },
      today,
    });
    expect(next.data.habits[0]).toMatchObject({
      nom: "Nouveau nom",
      categorie: "Routine",
      frequence: "quotidienne",
      priorite: "normale",
    });
  });

  it("rejette les réglages invalides et les opérations inconnues", () => {
    const initial = createTrackerState(data());
    expect(
      trackerReducer(initial, {
        type: "settings/patch",
        patch: { moisActif: 12 },
      }),
    ).toBe(initial);
    expect(
      trackerReducer(initial, { type: "habit/delete", habitId: "unknown" }),
    ).toBe(initial);
  });

  it("ajoute, modifie et protège l’unicité des habitudes", () => {
    const initial = createTrackerState(data());
    const added = trackerReducer(initial, { type: "habit/add", habit: habit("two") });
    expect(added.data.habits.map((item) => item.id)).toEqual(["one", "two"]);
    expect(
      trackerReducer(added, { type: "habit/add", habit: habit("two") }),
    ).toBe(added);

    const updated = trackerReducer(added, {
      type: "habit/update",
      habitId: "two",
      patch: { nom: "Deux" },
      today,
    });
    expect(updated.data.habits[1].nom).toBe("Deux");
  });

  it("parcourt les statuts puis supprime le log revenu à empty", () => {
    const initial = createTrackerState({
      ...data(),
      logs: [{ habitId: "one", date: "2026-02-14", status: "partial" }],
    });
    const missed = trackerReducer(initial, {
      type: "log/cycle",
      habitId: "one",
      date: "2026-02-14",
      today,
    });
    const rest = trackerReducer(missed, {
      type: "log/cycle",
      habitId: "one",
      date: "2026-02-14",
      today,
    });
    const empty = trackerReducer(rest, {
      type: "log/cycle",
      habitId: "one",
      date: "2026-02-14",
      today,
    });
    expect(missed.data.logs[0].status).toBe("missed");
    expect(rest.data.logs[0].status).toBe("rest");
    expect(empty.data.logs).toEqual([]);
  });

  it("efface réactions et complétions quand la mascotte est désactivée", () => {
    const initial = {
      ...createTrackerState(data()),
      mascotReaction: { id: 4, type: "habit-done" as const },
      pendingCompletion: {
        id: 3,
        date: today,
      },
      nextReactionId: 4,
    };
    const disabled = trackerReducer(initial, {
      type: "settings/patch",
      patch: { mascotEnabled: false },
    });
    expect(disabled.mascotReaction).toBeNull();
    expect(disabled.pendingCompletion).toBeNull();
  });
});
