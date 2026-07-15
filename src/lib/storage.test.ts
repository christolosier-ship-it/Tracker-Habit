import { describe, expect, it } from "vitest";
import { AppData, migrateData, validateImport } from "./storage";

const v3: AppData = {
  schemaVersion: 3,
  habits: [
    {
      id: "h1",
      nom: "Lecture",
      categorie: "Développement",
      frequence: "quotidienne",
      objectif: "15 min",
      priorite: "normale",
      active: true,
      dateCreation: "2026-01-01",
    },
  ],
  logs: [{ habitId: "h1", date: "2026-01-02", status: "done" }],
  settings: {
    anneeActive: 2026,
    moisActif: 0,
    compterNonSaisisCommeManques: false,
    themeId: "dopamine-pop",
    mascotEnabled: undefined as unknown as boolean,
  },
};

describe("migration stockage mascotte", () => {
  it("migre une sauvegarde V3 sans mascotEnabled avec true sans perdre les données", () => {
    const legacy = { ...v3, settings: { ...v3.settings } } as unknown as AppData;
    delete (legacy.settings as Partial<AppData["settings"]>).mascotEnabled;
    expect(validateImport(legacy)).toBe(true);
    const migrated = migrateData(legacy);
    expect(migrated.schemaVersion).toBe(5);
    expect(migrated.settings.mascotEnabled).toBe(true);
    expect(migrated.habits).toHaveLength(1);
    expect(migrated.logs).toEqual(v3.logs);
  });

  it("conserve false en V4", () => {
    const migrated = migrateData({ ...v3, schemaVersion: 4, settings: { ...v3.settings, mascotEnabled: false } });
    expect(migrated.settings.mascotEnabled).toBe(false);
  });

  it("rejette une valeur mascotEnabled invalide", () => {
    expect(
      validateImport({
        ...v3,
        settings: { ...v3.settings, mascotEnabled: "oui" },
      }),
    ).toBe(false);
  });

  it.each([
    ["date impossible", { ...v3, logs: [{ ...v3.logs[0], date: "2026-99-99" }] }],
    ["catégorie inconnue", { ...v3, habits: [{ ...v3.habits[0], categorie: "Divers" }] }],
    ["année décimale", { ...v3, settings: { ...v3.settings, anneeActive: 2026.5 } }],
    ["version future", { ...v3, schemaVersion: 99 }],
  ])("rejette %s", (_label, candidate) => {
    expect(validateImport(candidate)).toBe(false);
  });

  it("déduplique les habitudes et les logs tout en supprimant les valeurs empty", () => {
    const migrated = migrateData({
      ...v3,
      habits: [...v3.habits, { ...v3.habits[0], nom: "Doublon" }],
      logs: [
        ...v3.logs,
        { ...v3.logs[0], status: "partial" },
        { ...v3.logs[0], date: "2026-01-03", status: "empty" },
      ],
    });

    expect(migrated.habits).toHaveLength(1);
    expect(migrated.logs).toEqual([
      { habitId: "h1", date: "2026-01-02", status: "partial" },
    ]);
  });
});
