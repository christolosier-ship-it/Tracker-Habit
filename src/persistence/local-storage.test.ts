import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  BACKUP_STORAGE_KEY,
  SCHEMA_VERSION,
  STORAGE_KEY,
  type AppData,
} from "./schema";
import { loadData, resetData, saveData } from "./local-storage";

function createStorage(initial: Record<string, string> = {}): Storage {
  const values = new Map(Object.entries(initial));
  return {
    get length() {
      return values.size;
    },
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => [...values.keys()][index] ?? null,
    removeItem: (key) => {
      values.delete(key);
    },
    setItem: (key, value) => {
      values.set(key, value);
    },
  };
}

function fixture(): AppData {
  return {
    schemaVersion: SCHEMA_VERSION,
    habits: [
      {
        id: "lecture",
        nom: "Lecture",
        categorie: "Développement",
        frequence: "quotidienne",
        objectif: "15 min",
        priorite: "normale",
        active: true,
        dateCreation: "2026-01-01",
      },
    ],
    logs: [
      { habitId: "lecture", date: "2026-01-02", status: "done" },
    ],
    settings: {
      anneeActive: 2026,
      moisActif: 0,
      compterNonSaisisCommeManques: false,
      themeId: "dopamine-pop",
      mascotEnabled: true,
    },
  };
}

describe("persistance locale", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", createStorage());
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("charge la démo lorsqu'aucune sauvegarde n'existe", () => {
    const loaded = loadData();
    expect(loaded.schemaVersion).toBe(SCHEMA_VERSION);
    expect(loaded.habits.length).toBeGreaterThan(1);
  });

  it("valide et migre la sauvegarde principale", () => {
    const stored = fixture();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

    expect(loadData()).toEqual(stored);
  });

  it("restaure le backup si la sauvegarde principale est invalide", () => {
    const backup = fixture();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ incompatible: true }));
    localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(backup));
    const warning = vi.spyOn(console, "warn").mockImplementation(() => {});

    expect(loadData()).toEqual(backup);
    expect(warning).toHaveBeenCalledOnce();
  });

  it("retombe sur la démo si principal et backup sont illisibles", () => {
    localStorage.setItem(STORAGE_KEY, "{");
    localStorage.setItem(BACKUP_STORAGE_KEY, "{");
    vi.spyOn(console, "warn").mockImplementation(() => {});

    expect(loadData().habits.length).toBeGreaterThan(1);
  });

  it("sauvegarde uniquement les changements et fait tourner le backup", () => {
    const first = fixture();
    saveData(first);
    const firstSerialized = JSON.stringify(first);
    expect(localStorage.getItem(STORAGE_KEY)).toBe(firstSerialized);

    saveData(first);
    expect(localStorage.getItem(BACKUP_STORAGE_KEY)).toBeNull();

    const second = {
      ...first,
      settings: { ...first.settings, mascotEnabled: false },
    };
    saveData(second);
    expect(localStorage.getItem(BACKUP_STORAGE_KEY)).toBe(firstSerialized);
    expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(second));
  });

  it("absorbe une erreur d'écriture sans casser l'application", () => {
    const storage = createStorage();
    storage.setItem = () => {
      throw new Error("quota");
    };
    vi.stubGlobal("localStorage", storage);
    const warning = vi.spyOn(console, "warn").mockImplementation(() => {});

    expect(() => saveData(fixture())).not.toThrow();
    expect(warning).toHaveBeenCalledOnce();
  });

  it("réinitialise la sauvegarde et son backup", () => {
    localStorage.setItem(STORAGE_KEY, "primary");
    localStorage.setItem(BACKUP_STORAGE_KEY, "backup");

    resetData();

    expect(localStorage.length).toBe(0);
  });
});
